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

const Pattern = () => (
	<>
		<svg
			className='hidden sm:block'
			width='252'
			height='181'
			viewBox='0 0 252 181'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
		>
			<rect
				x='5'
				y='-5'
				width='110'
				height='110'
				rx='55'
				transform='matrix(1 0 0 -1 13.219 110.5)'
				stroke='#16A34A'
				strokeWidth='10'
			/>
			<g filter='url(#a)'>
				<rect
					width='180'
					height='180'
					rx='90'
					transform='matrix(1 0 0 -1 83.219 180.5)'
					fill='#2E2F34'
					fillOpacity='.4'
				/>
			</g>
			<defs>
				<filter
					id='a'
					x='43.219'
					y='-39.5'
					width='260'
					height='260'
					filterUnits='userSpaceOnUse'
					colorInterpolationFilters='sRGB'
				>
					<feFlood floodOpacity='0' result='BackgroundImageFix' />
					<feGaussianBlur in='BackgroundImage' stdDeviation='20' />
					<feComposite
						in2='SourceAlpha'
						operator='in'
						result='effect1_backgroundBlur_3086:31433'
					/>
					<feBlend
						in='SourceGraphic'
						in2='effect1_backgroundBlur_3086:31433'
						result='shape'
					/>
				</filter>
			</defs>
		</svg>

		<svg
			className='block sm:hidden'
			width='276'
			height='181'
			viewBox='0 0 276 181'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
		>
			<rect
				x='5'
				y='-5'
				width='110'
				height='110'
				rx='55'
				transform='matrix(1 0 0 -1 13.219 110.5)'
				stroke='#16A34A'
				strokeWidth='10'
			/>
			<g filter='url(#a)'>
				<rect
					width='180'
					height='180'
					rx='90'
					transform='matrix(1 0 0 -1 83.219 180.5)'
					fill='#2E2F34'
					fillOpacity='.4'
				/>
			</g>
			<defs>
				<filter
					id='a'
					x='43.219'
					y='-39.5'
					width='260'
					height='260'
					filterUnits='userSpaceOnUse'
					colorInterpolationFilters='sRGB'
				>
					<feFlood floodOpacity='0' result='BackgroundImageFix' />
					<feGaussianBlur in='BackgroundImage' stdDeviation='20' />
					<feComposite
						in2='SourceAlpha'
						operator='in'
						result='effect1_backgroundBlur_3086:31467'
					/>
					<feBlend
						in='SourceGraphic'
						in2='effect1_backgroundBlur_3086:31467'
						result='shape'
					/>
				</filter>
			</defs>
		</svg>
	</>
)

export default Pattern
