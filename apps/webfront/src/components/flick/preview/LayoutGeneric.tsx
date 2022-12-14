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

/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/require-default-props */
/* eslint-disable react/no-unknown-property */
import { cx } from '@emotion/css'
import React, { HTMLAttributes } from 'react'
import {
	IoCodeSlashOutline,
	IoImageOutline,
	IoListOutline,
	IoPlayOutline,
} from 'react-icons/io5'
import { CgFormatHeading } from 'react-icons/cg'
import { Text } from 'ui/src'
import { Layout, ViewConfig } from 'utils/src/types/viewConfig'
import { Block } from 'editor/src/utils/types'

export const FragmentTypeIcon = ({
	type,
	shouldDisplayIcon = true,
}: {
	type: Block['type']
	shouldDisplayIcon?: boolean
}) => {
	if (!shouldDisplayIcon) return null

	return (
		<>
			{(() => {
				switch (type) {
					case 'imageBlock':
						return <IoImageOutline className='w-full h-full text-gray-400' />
					case 'videoBlock':
						return <IoPlayOutline className='w-full h-full text-gray-400' />
					case 'listBlock':
						return <IoListOutline className='w-full h-full text-gray-400' />
					case 'codeBlock':
						return (
							<IoCodeSlashOutline className='w-full h-full text-gray-400' />
						)
					case 'headingBlock':
						return <CgFormatHeading className='w-full h-full text-gray-400' />
					case 'introBlock':
						return (
							<Text textStyle='caption' className='text-gray-400'>
								Title
							</Text>
						)
					case 'outroBlock':
						return (
							<Text textStyle='caption' className='text-gray-400'>
								Outro
							</Text>
						)
					default:
						return null
				}
			})()}
		</>
	)
}

const LayoutGeneric = ({
	type,
	layout,
	mode = 'Landscape',
	isSelected,
	shouldDisplayIcon = true,
	darkMode = false,
	...rest
}: {
	isSelected?: boolean
	mode?: ViewConfig['mode']
	layout: Layout
	type: Block['type']
	shouldDisplayIcon?: boolean
	darkMode?: boolean
} & HTMLAttributes<HTMLDivElement>) => (
	<>
		{(() => {
			switch (layout) {
				case 'classic':
					return (
						<div
							className={cx(
								'border border-gray-200 rounded-md cursor-pointer bg-white',
								{
									'!border-green-600': isSelected,
									'p-1 w-16 h-28': mode === 'Portrait',
									'p-2 w-28 h-16': mode === 'Landscape',
								}
							)}
							{...rest}
						>
							<div className='w-full h-full p-2 bg-gray-200 rounded-sm'>
								{type && (
									<FragmentTypeIcon
										shouldDisplayIcon={shouldDisplayIcon}
										type={type}
									/>
								)}
							</div>
						</div>
					)
				case 'float-full-right':
					return (
						<div
							className={cx(
								'border border-gray-200 rounded-md cursor-pointer flex gap-x-2',
								{
									'!border-green-600': isSelected,
									'p-1 w-16 h-28': mode === 'Portrait',
									'p-2 w-28 h-16': mode === 'Landscape',
									'bg-white': darkMode,
								}
							)}
							{...rest}
						>
							<div className='h-full w-5/6 bg-gray-200 rounded-sm p-2.5'>
								{type && (
									<FragmentTypeIcon
										shouldDisplayIcon={shouldDisplayIcon}
										type={type}
									/>
								)}
							</div>
							<div className='w-1/6 h-full p-2 bg-gray-500 rounded-sm' />
						</div>
					)
				case 'float-full-left':
					return (
						<div
							className={cx(
								'p-2 border border-gray-200 rounded-md cursor-pointer flex gap-x-2',
								{
									'!border-green-600': isSelected,
									'w-16 h-28': mode === 'Portrait',
									'w-28 h-16': mode === 'Landscape',
									'bg-white': darkMode,
								}
							)}
							{...rest}
						>
							<div className='w-1/6 h-full p-2 bg-gray-500 rounded-sm' />
							<div className='h-full w-5/6 bg-gray-200 rounded-sm p-2.5'>
								{type && (
									<FragmentTypeIcon
										shouldDisplayIcon={shouldDisplayIcon}
										type={type}
									/>
								)}
							</div>
						</div>
					)
				case 'float-half-right':
					return (
						<div
							className={cx(
								'p-2 border border-gray-200 rounded-md cursor-pointer flex justify-end items-center relative',
								{
									'!border-green-600': isSelected,
									'w-16 h-28': mode === 'Portrait',
									'w-28 h-16': mode === 'Landscape',
									'bg-white': darkMode,
								}
							)}
							{...rest}
						>
							<div className='w-full h-full p-2 mr-2 bg-gray-200 rounded-sm'>
								{type && (
									<FragmentTypeIcon
										shouldDisplayIcon={shouldDisplayIcon}
										type={type}
									/>
								)}
							</div>
							<div className='absolute w-1/6 p-2 bg-gray-500 rounded-sm h-7' />
						</div>
					)
				case 'padded-bottom-right-tile':
					return (
						<div
							className={cx(
								'p-2 border border-gray-200 rounded-md cursor-pointer flex justify-end items-end relative',
								{
									'!border-green-600': isSelected,
									'w-16 h-28': mode === 'Portrait',
									'w-28 h-16': mode === 'Landscape',
									'bg-white': darkMode,
								}
							)}
							{...rest}
						>
							<div className='w-full h-full p-2 bg-gray-200 rounded-sm'>
								{type && (
									<FragmentTypeIcon
										shouldDisplayIcon={shouldDisplayIcon}
										type={type}
									/>
								)}
							</div>
							<div className='absolute w-4 h-4 p-2 -m-1 bg-gray-500 rounded-sm' />
						</div>
					)
				case 'padded-bottom-right-circle':
					return (
						<div
							className={cx(
								'p-2 border border-gray-200 rounded-md cursor-pointer flex justify-end items-end relative',
								{
									'!border-green-600': isSelected,
									'w-16 h-28': mode === 'Portrait',
									'w-28 h-16': mode === 'Landscape',
									'bg-white': darkMode,
								}
							)}
							{...rest}
						>
							<div className='w-full h-full p-2 bg-gray-200 rounded-sm'>
								{type && (
									<FragmentTypeIcon
										shouldDisplayIcon={shouldDisplayIcon}
										type={type}
									/>
								)}
							</div>
							<div className='absolute w-4 h-4 p-2 -m-1 bg-gray-500 rounded-full' />
						</div>
					)
				case 'bottom-right-tile':
					return (
						<div
							className={cx(
								'border border-gray-200 rounded-md cursor-pointer flex justify-end items-end relative',
								{
									'!border-green-600': isSelected,
									'w-16 h-28': mode === 'Portrait',
									'w-28 h-16': mode === 'Landscape',
									'bg-white': darkMode,
								}
							)}
							{...rest}
						>
							<div className='h-full w-full bg-gray-200 rounded-md p-3.5'>
								{type && (
									<FragmentTypeIcon
										shouldDisplayIcon={shouldDisplayIcon}
										type={type}
									/>
								)}
							</div>
							<div className='absolute w-4 h-4 p-2 m-1 bg-gray-500 rounded-sm' />
						</div>
					)
				case 'bottom-right-circle':
					return (
						<div
							className={cx(
								'border border-gray-200 rounded-md cursor-pointer flex justify-end items-end relative',
								{
									'!border-green-600': isSelected,
									'w-16 h-28': mode === 'Portrait',
									'w-28 h-16': mode === 'Landscape',
									'bg-white': darkMode,
								}
							)}
							{...rest}
						>
							<div className='h-full w-full bg-gray-200 rounded-md p-3.5'>
								{type && (
									<FragmentTypeIcon
										shouldDisplayIcon={shouldDisplayIcon}
										type={type}
									/>
								)}
							</div>
							<div className='absolute w-4 h-4 p-2 m-1 bg-gray-500 rounded-full' />
						</div>
					)
				case 'padded-split':
					return (
						<div
							className={cx(
								'border border-gray-200 rounded-md cursor-pointer flex items-center gap-x-2',
								{
									'!border-green-600': isSelected,
									'w-16 h-28': mode === 'Portrait',
									'w-28 h-16': mode === 'Landscape',
									'bg-white': darkMode,
								}
							)}
							{...rest}
						>
							<div className='h-7 w-5/6 bg-gray-200 rounded-sm p-1.5 ml-2'>
								{type && (
									<FragmentTypeIcon
										shouldDisplayIcon={shouldDisplayIcon}
										type={type}
									/>
								)}
							</div>
							<div className='w-3/6 h-full p-2 bg-gray-500 rounded-tr-sm rounded-br-sm' />
						</div>
					)
				case 'split':
					return (
						<div
							className={cx(
								'border border-gray-200 rounded-md cursor-pointer flex items-center',
								{
									'!border-green-600': isSelected,
									'flex-col w-16 h-28 p-1.5 gap-y-1': mode === 'Portrait',
									'w-28 h-16': mode === 'Landscape',
									'bg-white': darkMode,
								}
							)}
							{...rest}
						>
							<div
								className={cx(' bg-gray-200', {
									'w-full h-1/2 rounded-sm p-2': mode === 'Portrait',
									'w-3/6 h-8 p-1.5': mode === 'Landscape',
								})}
							>
								{type && (
									<FragmentTypeIcon
										shouldDisplayIcon={shouldDisplayIcon}
										type={type}
									/>
								)}
							</div>
							<div
								className={cx('bg-gray-500 items-self-end', {
									'w-full h-1/2 rounded-sm': mode === 'Portrait',
									'h-full w-3/6 rounded-tr-sm rounded-br-sm':
										mode === 'Landscape',
								})}
							/>
						</div>
					)
				case 'full-left':
					return (
						<div
							className={cx(
								'border border-gray-200 rounded-md cursor-pointer flex items-center relative',
								{
									'!border-green-600': isSelected,
									'w-16 h-28 justify-center': mode === 'Portrait',
									'w-28 h-16': mode === 'Landscape',
									'bg-white': darkMode,
								}
							)}
							{...rest}
						>
							<div className='w-full h-full bg-gray-500 rounded-sm items-self-end' />
							<div
								className={cx('bg-gray-200 p-1.5 absolute rounded-sm', {
									'w-4/5 h-2/5 top-2': mode === 'Portrait',
									'h-8 w-2/5 left-1': mode === 'Landscape',
								})}
							>
								{type && (
									<FragmentTypeIcon
										shouldDisplayIcon={shouldDisplayIcon}
										type={type}
									/>
								)}
							</div>
						</div>
					)
				case 'full-right':
					return (
						<div
							className={cx(
								'border border-gray-200 rounded-md cursor-pointer flex items-center relative',
								{
									'!border-green-600': isSelected,
									'w-16 h-28 justify-center': mode === 'Portrait',
									'w-28 h-16': mode === 'Landscape',
									'bg-white': darkMode,
								}
							)}
							{...rest}
						>
							<div className='w-full h-full bg-gray-500 rounded-sm items-self-end' />
							<div
								className={cx('bg-gray-200 p-1.5 absolute rounded-sm', {
									'w-4/5 h-2/5 bottom-2': mode === 'Portrait',
									'h-8 w-2/5 right-1': mode === 'Landscape',
								})}
							>
								{type && (
									<FragmentTypeIcon
										shouldDisplayIcon={shouldDisplayIcon}
										type={type}
									/>
								)}
							</div>
						</div>
					)
				case 'split-without-media':
					return (
						<div
							className={cx(
								'border border-gray-200 rounded-md cursor-pointer flex items-center relative',
								{
									'!border-green-600': isSelected,
									'w-16 h-28 justify-center': mode === 'Portrait',
									'w-28 h-16': mode === 'Landscape',
									'bg-white': darkMode,
								}
							)}
							{...rest}
						>
							<div className='w-full h-full rounded-sm items-self-end' />
							<div
								className={cx('bg-gray-200 p-1.5 absolute rounded-sm', {
									'w-4/5 h-2/5 top-2': mode === 'Portrait',
									'h-10 w-1/2 left-1': mode === 'Landscape',
								})}
							>
								{type && (
									<FragmentTypeIcon
										shouldDisplayIcon={shouldDisplayIcon}
										type={type}
									/>
								)}
							</div>
						</div>
					)
				default:
					return null
			}
		})()}
	</>
)

export default LayoutGeneric
