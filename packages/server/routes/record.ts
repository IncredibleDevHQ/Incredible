// Copyright 2022 Pixelbyte Studio Pvt Ltd
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { TRPCError } from '@trpc/server'
import * as trpc from '@trpc/server'
import { z } from 'zod'
import { nanoid } from 'nanoid'
import {
	ContentTypeEnum,
	OrientationEnum,
	RecordingStatusEnum,
} from 'utils/src/enums'
import serverEnvs from '../utils/env'
import { s3 } from '../utils/aws'
import { Context } from '../createContext'
import { BlocksEntity, Meta } from '../utils/helpers'
import mediaConvertToMp4 from '../utils/mediaConvert'

const recordingRouter = trpc
	.router<Context, Meta>()
	/*
		AUTH CHECK MIDDLEWARE

		Note: Certain routes that don't require authentication can be excluded from this middleware
		by passing meta.hasAuth = false.
	*/
	.middleware(({ meta, ctx, next }) => {
		// only check authorization if enabled
		if (meta?.hasAuth && !ctx.user) {
			throw new TRPCError({
				code: 'UNAUTHORIZED',
				message: 'Invalid Auth Token',
			})
		}
		return next({
			ctx: {
				...ctx,
				user: ctx.user,
			},
		})
	})
	.query('get', {
		meta: {
			hasAuth: true,
		},
		input: z.object({
			flickId: z.string(),
			fragmentId: z.string(),
		}),
		resolve: async ({ ctx, input }) => {
			const recording = await ctx.prisma.recording.findMany({
				where: {
					flickId: input.flickId,
					fragmentId: input.fragmentId,
				},
				select: {
					id: true,
					fragmentId: true,
					type: true,
					url: true,
					status: true,
					checkpoint: true,
					thumbnail: true,
					storyboard: true,
				},
			})
			return recording
		},
	})
	// ACTIONS
	.mutation('create', {
		meta: {
			hasAuth: true,
		},
		input: z.object({
			contentType: z.nativeEnum(ContentTypeEnum),
			editorState: z.any(),
			flickId: z.string(),
			fragmentId: z.string(),
			viewconfig: z.any().optional(),
		}),
		resolve: async ({ ctx, input }) => {
			if (!ctx.user?.sub)
				throw new TRPCError({
					code: 'UNAUTHORIZED',
					message: 'Invalid Auth Token',
				})

			// allow only 1 recording per fragment in notebook, note this is enforced in the app and not on db
			const fragmentRecording = await ctx.prisma.recording.findFirst({
				where: {
					fragmentId: input.fragmentId,
				},
				select: {
					id: true,
				},
			})
			if (fragmentRecording?.id) {
				throw new TRPCError({
					code: 'CONFLICT',
					message: 'Recording already exists for this notebook',
				})
			}

			// init recording
			const rec = await ctx.prisma.recording.create({
				data: {
					flickId: input.flickId,
					fragmentId: input.fragmentId,
					type: input.contentType,
					editorState: input.editorState,
					viewConfig: input.viewconfig,
					status: RecordingStatusEnum.Pending,
				},
				select: {
					id: true,
				},
			})

			// return recording Id
			return {
				recordingId: rec.id,
				success: true,
			}
		},
	})
	.mutation('complete', {
		meta: {
			hasAuth: true,
		},
		input: z.object({
			checkpoint: z.any().optional(),
			editorState: z.any(),
			recordingId: z.string(),
			viewConfig: z.any().optional(),
		}),
		resolve: async ({ ctx, input }) => {
			if (!ctx.user?.sub)
				throw new TRPCError({
					code: 'UNAUTHORIZED',
					message: 'Invalid Auth Token',
				})

			const editorState = JSON.parse(input.editorState)
			if (
				!editorState ||
				!editorState.blocks ||
				editorState.blocks.length === 0
			) {
				throw Error('No blocks found')
			}

			// get recording data from db
			const recordingData = await ctx.prisma.recording.findUnique({
				where: {
					id: input.recordingId,
				},
				select: {
					type: true,
					url: true,
					status: true,
					Fragment: {
						select: {
							id: true,
							configuration: true,
						},
					},
					Flick: {
						select: {
							id: true,
						},
					},
					Blocks: {
						select: {
							id: true,
							objectUrl: true,
							updatedAt: true,
						},
					},
				},
			})

			// if currently processing wait for it to finish
			if (recordingData?.status === RecordingStatusEnum.Processing) {
				throw new TRPCError({
					code: 'CONFLICT',
					message: 'Recording is currently processing...',
				})
			}

			// If recording was previously produced , delete the old recording
			if (recordingData && recordingData?.url) {
				console.log('Found old recording, deleting...')
				try {
					const delS3Obj = await s3
						.deleteObject({
							Bucket: serverEnvs.AWS_S3_UPLOAD_BUCKET,
							Key: recordingData.url,
						})
						.promise()
					console.log(
						'Deleted Old recording : ',
						recordingData.url,
						' res: ',
						delS3Obj.$response.data
					)
				} catch (e) {
					console.log('Failed to delete old recording')
					// TODO: Sentry.captureException(e)
				}
			} else {
				console.log(
					'First produce event.Recording was not previously produced.'
				)
			}

			if (!recordingData)
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'Recording not found',
				})

			// first add timestamps and urls to the recording sequence
			let recordingSequence = editorState.blocks.map((block: BlocksEntity) => {
				const recordedBlock = recordingData.Blocks.find(b => b.id === block.id)
				const ts = recordedBlock?.updatedAt
					? new Date(recordedBlock.updatedAt)
					: new Date()
				if (ts) {
					// eslint-disable-next-line no-param-reassign
					block.ts = ts
				}

				if (recordedBlock && recordedBlock.objectUrl) {
					// eslint-disable-next-line no-param-reassign
					block.url = recordedBlock.objectUrl
				} else {
					console.log('One of the blocks was not recorded : ', block.id)
				}
				return recordedBlock
			})

			// sort by pos, in case duplicates at same pos are found sort by timestamp
			recordingSequence = recordingSequence?.sort(
				(b1: BlocksEntity, b2: BlocksEntity) => {
					if (b1.pos === b2.pos) {
						return b1.ts > b2.ts ? -1 : 1
					}
					return b1.pos > b2.pos ? -1 : 1
				}
			)

			console.log({ recordingSequence })

			// get all the blocks with a url
			let inputVideos: string[] = recordingSequence.map(
				(block: { id: string; objectUrl: string; updatedAt: string }) => {
					if (block && block.objectUrl) return block.objectUrl
					return undefined
				}
			)
			inputVideos = inputVideos.filter(v => typeof v === 'string')

			if (inputVideos.length === 0) {
				throw new Error('No blocks were recorded')
			}

			inputVideos = [...new Set(inputVideos)]

			const id = nanoid()
			const outputVideo = `${id}.mp4`
			const flickId = recordingData.Flick.id
			const fragmentId = recordingData.Fragment.id

			const orientation =
				recordingData.type === ContentTypeEnum.Video
					? OrientationEnum.Landscape
					: OrientationEnum.Portrait

			await mediaConvertToMp4({
				flickId,
				fragmentId,
				inputVideos,
				outputVideo,
				recordingId: input.recordingId,
				orientation,
			})

			// mark the recording as processing
			await ctx.prisma.recording.update({
				where: {
					id: input.recordingId,
				},
				data: {
					status: RecordingStatusEnum.Processing,
				},
			})
			return {
				success: true,
			}
		},
	})

export default recordingRouter
