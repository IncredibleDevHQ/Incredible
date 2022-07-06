import * as trpc from '@trpc/server'
import { TRPCError } from '@trpc/server'
// eslint-disable-next-line import/no-extraneous-dependencies
import { s3 } from 'src/utils/aws'
import serverEnvs from 'src/utils/env'
import { getStoragePath, UploadType } from 'src/utils/helpers/s3-path-builder'
import { z } from 'zod'
import type { Context } from '../createContext'
import { isKeyAllowed } from '../utils/upload'

const userRouter = trpc
	.router()
	.middleware(async ({ ctx, next }) => {
		const context = await (ctx as Context)
		if (!context.user) {
			throw new TRPCError({ code: 'UNAUTHORIZED' })
		}
		return next()
	})
	/*
	Dummy test query
	*/
	.query('me', {
		input: z
			.object({
				text: z.string().nullish(),
			})
			.nullish(),
		resolve: async ({ input, ctx }) => {
			const context = await (ctx as Context)
			const out = {
				greeting: `hello ${input?.text ?? context.user?.email}`,
				ctx: context.user,
			}

			return out
		},
	})
	.mutation('getUploadUrl', {
		input: z.object({
			key: z.string(),
			tag: z.string(),
			meta: z.object({
				flickId: z.string().nullable(),
				fragmentId: z.string().nullable(),
				brandId: z.string().nullable(),
				recordingId: z.string().nullable(),
			}),
		}),
		resolve: async ({ input, ctx }) => {
			const context = await (ctx as Context)
			let uploadType: UploadType

			// validate upload tag
			try {
				uploadType = input.tag as UploadType
			} catch (e) {
				throw new TRPCError({
					code: 'BAD_REQUEST',
					message: 'Invalid upload tag',
				})
			}

			// check validity of passed key of new object
			const { valid, mime } = await isKeyAllowed(input.key)
			if (!valid)
				throw new trpc.TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: 'invalid file extension.',
				})

			// Check if key is duplicate
			try {
				if (serverEnvs.AWS_S3_UPLOAD_BUCKET)
					await s3
						.headObject({
							Bucket: serverEnvs.AWS_S3_UPLOAD_BUCKET,
							Key: input.key,
						})
						.promise()
				else {
					// TODO: Add sentry alert
					throw new Error('INTERNAL SERVER ERROR')
				}
			} catch (e) {
				throw new TRPCError({
					code: 'CONFLICT',
					message: 'This key already exists. Please select another key.',
				})
			}

			// generate pre-signed URL to upload object
			try {
				const path = getStoragePath(context.user!.sub, uploadType, input.meta)
				const url = await s3.getSignedUrlPromise('putObject', {
					Bucket: serverEnvs.AWS_S3_UPLOAD_BUCKET,
					Expires: 20 * 60,
					Key: path + input.key,
					ContentType: mime,
				})
				// TODO: Add entry on Assets table to track objects uploaded by user
				return { success: true, url }
			} catch (e) {
				console.log('Error generating pre-signed URL :', e)
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: 'Failed to generate upload url.',
				})
			}
		},
	})

export default userRouter
