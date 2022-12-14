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

import { Extension } from '@tiptap/core'
import { PluginKey, Plugin } from 'prosemirror-state'

// @ts-ignore
function nodeEqualsType({ types, node }) {
	return (
		(Array.isArray(types) && types.includes(node.type)) || node.type === types
	)
}

/**
 * Extension based on:
 * - https://github.com/ueberdosis/tiptap/blob/v1/packages/tiptap-extensions/src/extensions/TrailingNode.js
 * - https://github.com/remirror/remirror/blob/e0f1bec4a1e8073ce8f5500d62193e52321155b9/packages/prosemirror-trailing-node/src/trailing-node-plugin.ts
 */

export interface TrailingNodeOptions {
	node: string
	notAfter: string[]
}

export default Extension.create<TrailingNodeOptions>({
	name: 'trailingNode',

	addOptions() {
		return {
			node: 'paragraph',
			notAfter: ['paragraph'],
		}
	},

	addProseMirrorPlugins() {
		const plugin = new PluginKey(this.name)
		const disabledNodes = Object.entries(this.editor.schema.nodes)
			.map(([, value]) => value)
			.filter(node => this.options.notAfter.includes(node.name))

		return [
			new Plugin({
				key: plugin,
				appendTransaction: (_, __, state) => {
					const { doc, tr, schema } = state
					const shouldInsertNodeAtEnd = plugin.getState(state)
					const endPosition = doc.content.size
					const type = schema.nodes[this.options.node]

					if (!shouldInsertNodeAtEnd) {
						return
					}

					// eslint-disable-next-line consistent-return
					return tr.insert(endPosition, type.create())
				},
				state: {
					init: (_, state) => {
						const lastNode = state.tr.doc.lastChild

						return !nodeEqualsType({ node: lastNode, types: disabledNodes })
					},
					apply: (tr, value) => {
						if (!tr.docChanged) {
							return value
						}

						const lastNode = tr.doc.lastChild

						return !nodeEqualsType({ node: lastNode, types: disabledNodes })
					},
				},
			}),
		]
	},
})
