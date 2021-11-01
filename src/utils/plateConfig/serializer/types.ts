export interface NodeTypes {
  paragraph: string
  block_quote: string
  code_block: string
  link: string
  image: string
  ul_list: string
  ol_list: string
  listItem: string
  heading: {
    1: string
    2: string
    3: string
    4: string
    5: string
    6: string
  }
  emphasis_mark: string
  strong_mark: string
  delete_mark: string
  inline_code_mark: string
  thematic_break: string
}

// Convert these to plate node types
export const defaultNodeTypes: NodeTypes = {
  paragraph: 'p',
  block_quote: 'blockquote',
  code_block: 'code_block',
  link: 'link',
  ul_list: 'ul',
  ol_list: 'ol',
  listItem: 'li',
  heading: {
    1: 'h1',
    2: 'h2',
    3: 'h3',
    4: 'h4',
    5: 'h5',
    6: 'h6',
  },
  emphasis_mark: 'italic',
  strong_mark: 'bold',
  delete_mark: 'strikeThrough', // this is currently set as a property on p type as {strikethrough: true}
  inline_code_mark: 'code_block',
  thematic_break: 'thematic_break',
  image: 'image',
}

export interface CodejamConfig {
  type: string
  value: {
    gistURL: string
    explanations?: {
      explanation: string
      from: number
      to: number
      id: string
    }[]
    isAutomated: boolean
    language: string
    code: string
  }
  notes?: string[]
}

export interface VideojamConfig {
  type: string
  value: {
    videoURL: string
    // time in seconds
    from: number
    // time in seconds
    to: number
    // crop details
    x?: number
    y?: number
    width?: number
    height?: number
  }
  notes?: string[]
}

export interface TriviaConfig {
  type: string
  value: {
    id: string
    text: string
    image?: string
  }[]
  notes?: string[]
}

export interface PointsConfig {
  type: string
  value: {
    level?: number
    text: string
  }[]
  notes?: string[]
}
