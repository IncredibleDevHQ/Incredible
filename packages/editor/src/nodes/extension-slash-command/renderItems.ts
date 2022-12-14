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

/* eslint-disable import/no-extraneous-dependencies */
import { ReactRenderer } from '@tiptap/react'
import { SuggestionKeyDownProps, SuggestionProps } from '@tiptap/suggestion'
import tippy, { Instance, Props } from 'tippy.js'
import { CommandsList } from './CommandsList'

const renderItems = () => {
	let component: ReactRenderer<CommandsList>
	let popup: Instance<Props>[]
	let suggestionProps: SuggestionProps

	return {
		onStart: (props: SuggestionProps) => {
			suggestionProps = props
			component = new ReactRenderer(CommandsList, {
				props,
				editor: props.editor,
			})

			popup = tippy('body', {
				getReferenceClientRect: props.clientRect as any,
				appendTo: () => document.body,
				content: component.element,
				showOnCreate: true,
				interactive: true,
				trigger: 'manual',
				placement: 'bottom-start',
			})
		},
		onUpdate(props: SuggestionProps) {
			suggestionProps = props
			component.updateProps(props)

			popup[0].setProps({
				getReferenceClientRect: props.clientRect as any,
			})
		},
		onKeyDown(props: SuggestionKeyDownProps) {
			if (props.event.key === 'Escape') {
				popup[0].hide()

				return true
			}

			if (props.event.key === 'Enter') {
				if (
					suggestionProps.items.filter(item =>
						item.title
							.toLowerCase()
							.startsWith(suggestionProps.query.toLowerCase())
					).length === 0
				) {
					this.onExit()
				}
			}

			return component.ref?.onKeyDown(props) || false
		},
		onExit() {
			popup[0].destroy()
			component.destroy()
		},
	}
}

export default renderItems
