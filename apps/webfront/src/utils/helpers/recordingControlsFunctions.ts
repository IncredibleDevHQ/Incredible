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

import { ListBlockProps, ListBlock, Block } from 'editor/src/utils/types'
import {
	ListBlockView,
	CodeBlockView,
	CodeAnimation,
	IntroBlockView,
	OutroBlockView,
	ViewConfig,
} from 'utils/src'
import { ComputedPoint, ControlsConfig } from '../configs'

export const handleListBlock = (
	viewConfig: ViewConfig,
	payload: any,
	updatePayload: ((value: any) => void) | undefined,
	controlsConfig: ControlsConfig,
	direction: 'next' | 'previous',
	block: Block
): boolean => {
	const listBlock = (block as ListBlockProps)?.listBlock as ListBlock
	const listBlockViewProps = viewConfig.blocks[block.id]?.view as ListBlockView
	const appearance = listBlockViewProps?.list?.appearance

	const computedPoints: ComputedPoint[] = controlsConfig?.computedPoints || []

	const noOfPoints = listBlock?.list?.length || 0

	if (direction === 'next') {
		if (payload?.activePointIndex === noOfPoints) {
			// updatePayload?.({
			//   activeObjectIndex: payload?.activeObjectIndex + 1,
			// })
			return true
			// eslint-disable-next-line no-else-return
		} else if (appearance === 'allAtOnce') {
			const index = computedPoints.findIndex(
				point =>
					point.startFromIndex >
					computedPoints[payload?.activePointIndex].startFromIndex
			)
			updatePayload?.({
				activePointIndex: index !== -1 ? index : computedPoints.length,
			})
			return false
		} else {
			updatePayload?.({
				activePointIndex: (payload?.activePointIndex || 0) + 1 || 1,
			})
		}
	} else if (direction === 'previous') {
		updatePayload?.({
			activePointIndex: (payload?.activePointIndex || 1) - 1,
		})
		return false
	}
	return false
}

export const handleImageBlock = (
	// payload: any,
	// updatePayload: ((value: any) => void) | undefined,
	direction: 'next' | 'previous'
): boolean => {
	if (direction === 'next') {
		// updatePayload?.({
		//   activeObjectIndex: payload?.activeObjectIndex + 1,
		// })
		return true
	}
	return false
}

export const handleVideoBlock = (
	// payload: any,
	// updatePayload: ((value: any) => void) | undefined,
	direction: 'next' | 'previous'
): boolean => {
	if (direction === 'next') {
		// updatePayload?.({
		//   activeObjectIndex: payload?.activeObjectIndex + 1,
		// })
		return true
	}
	return false
}

export const handleCodeBlock = (
	viewConfig: ViewConfig,
	payload: any,
	updatePayload: ((value: any) => void) | undefined,
	controlsConfig: ControlsConfig,
	direction: 'next' | 'previous',
	blockId: string
): boolean | undefined => {
	const codeBlockViewProps = viewConfig.blocks[blockId]?.view as CodeBlockView
	const noOfBlocks = codeBlockViewProps?.code.highlightSteps?.length
	const codeAnimation = codeBlockViewProps?.code.animation
	const { position, computedTokens } = controlsConfig

	if (!position || !computedTokens) return false
	if (direction === 'next') {
		switch (codeAnimation) {
			case CodeAnimation.HighlightLines: {
				if (noOfBlocks === undefined) return false
				if (
					payload?.activeBlockIndex === noOfBlocks &&
					!payload?.focusBlockCode
				) {
					// updatePayload?.({
					//   activeObjectIndex: payload?.activeObjectIndex + 1,
					// })
					return true
					// eslint-disable-next-line no-else-return
				} else if (payload?.focusBlockCode) {
					updatePayload?.({
						focusBlockCode: false,
					})
				} else if (payload?.activeBlockIndex < noOfBlocks) {
					updatePayload?.({
						activeBlockIndex: (payload?.activeBlockIndex || 0) + 1,
						focusBlockCode: true,
					})
				}
				return false
				// break
			}
			case CodeAnimation.TypeLines: {
				if (payload?.currentIndex === computedTokens?.length) {
					// updatePayload?.({
					//   activeObjectIndex: payload?.activeObjectIndex + 1,
					// })
					return true
				}
				const current = computedTokens?.[position?.currentIndex]
				let next = computedTokens?.findIndex(
					(t: any) => t.lineNumber > current?.lineNumber
				)
				if (next === -1) next = computedTokens.length
				updatePayload?.({
					prevIndex: position.currentIndex,
					currentIndex: next,
					isFocus: false,
				})

				return false
				// break
			}
			default:
				return false
		}
	} else if (direction === 'previous') {
		switch (codeAnimation) {
			case CodeAnimation.HighlightLines: {
				if (noOfBlocks === undefined) return false
				if (payload?.activeBlockIndex === 1) {
					updatePayload?.({
						activeBlockIndex: (payload?.activeBlockIndex || 1) - 1,
						focusBlockCode: false,
					})
				} else {
					updatePayload?.({
						activeBlockIndex: (payload?.activeBlockIndex || 1) - 1,
						focusBlockCode: true,
					})
				}
				break
			}
			case CodeAnimation.TypeLines: {
				const current = computedTokens?.[position.currentIndex - 1]
				let next = [...computedTokens]
					.reverse()
					.findIndex((t: any) => t.lineNumber < current.lineNumber)
				if (next === -1) next = computedTokens.length
				updatePayload?.({
					prevIndex: computedTokens.length - next - 1,
					currentIndex: computedTokens.length - next,
					isFocus: false,
				})
				break
			}
			default:
				break
		}
		return false
	}
	return false
}

export const handleIntroBlock = (
	viewConfig: ViewConfig,
	payload: any,
	updatePayload: ((value: any) => void) | undefined,
	updateActiveObjectIndex: ((value: any) => void) | undefined,
	activeObjectIndex: number,
	direction: 'next' | 'previous',
	blockId: string
): boolean => {
	const introBlockViewProps = viewConfig.blocks[blockId]?.view as IntroBlockView

	if (direction === 'next') {
		if (
			payload?.activeIntroIndex ===
			(introBlockViewProps.intro?.order?.length || 0) - 1
		) {
			// updatePayload?.({
			//   activeObjectIndex: payload?.activeObjectIndex + 1,
			// })
			return true
		}
		updatePayload?.({
			activeIntroIndex: (payload?.activeIntroIndex || 0) + 1,
		})
	} else if (direction === 'previous') {
		if (payload?.activeIntroIndex === 0) {
			updateActiveObjectIndex?.({
				activeObjectIndex: (activeObjectIndex || 1) - 1,
			})
		} else {
			updatePayload?.({
				activeIntroIndex: (payload?.activeIntroIndex || 1) - 1,
			})
		}
	}
	return false
}

export const handleOutroBlock = (
	viewConfig: ViewConfig,
	payload: any,
	updatePayload: ((value: any) => void) | undefined,
	updateActiveObjectIndex: ((value: any) => void) | undefined,
	activeObjectIndex: number,
	direction: 'next' | 'previous',
	blockId: string
): boolean => {
	const outroBlockViewProps = viewConfig.blocks[blockId]?.view as OutroBlockView

	if (direction === 'next') {
		if (
			payload?.activeOutroIndex ===
			(outroBlockViewProps?.outro?.order?.length || 0) - 1
		) {
			// updatePayload?.({
			//   activeObjectIndex: payload?.activeObjectIndex + 1,
			// })
			return true
			// eslint-disable-next-line no-else-return
		} else {
			updatePayload?.({
				activeOutroIndex: (payload?.activeOutroIndex || 0) + 1,
			})
		}
	} else if (direction === 'previous') {
		if (payload?.activeOutroIndex === 0) {
			updateActiveObjectIndex?.((activeObjectIndex || 1) - 1)
		} else {
			updatePayload?.({
				activeOutroIndex: (payload?.activeOutroIndex || 1) - 1,
			})
		}
	}
	return false
}
