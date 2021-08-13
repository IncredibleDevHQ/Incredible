import { useRef } from 'react'
import Konva from 'konva'

interface Token {
  content: string
  color: string
  lineNumber: number
}

interface ComputedToken extends Token {
  x: number
  y: number
  width: number
}

const useCode = () => {
  /**
   *
   * 1 // 1 2
   * 2 // 3
   * 3 // 4 5
   * 4 // 6
   */

  const computedLineNumber = useRef(0)
  const computedTokens = useRef<ComputedToken[]>([])
  const currentWidth = useRef(0)

  /**
   * 1. import
   * 2. now time
   * 3. this
   * 4. ;
   *
   * computedLineNumber = 0
   *
   * l=1 c=1
   * now l=2 c=2
   * time l=2 c=3
   * this l=3 c=4
   * ; l=4 c=5
   *
   */

  const initUseCode = ({
    tokens,
    canvasWidth,
    gutter,
    fontSize,
    fontFamily,
  }: {
    tokens: Token[]
    canvasWidth: number
    gutter: number
    fontSize: number
    fontFamily: string
  }) => {
    const layer = new Konva.Layer({ width: canvasWidth })
    tokens.forEach((token) => {
      console.log(token.content, token.lineNumber, computedLineNumber.current)
      if (computedLineNumber.current !== token.lineNumber) {
        computedLineNumber.current +=
          token.lineNumber - computedLineNumber.current
        currentWidth.current = 0
      }

      const text = new Konva.Text({ text: token.content, fontSize, fontFamily })
      layer.add(text)

      const width = text.textWidth

      // Check for wrapping...
      if (width + currentWidth.current > canvasWidth) {
        // wrap
        computedLineNumber.current += 1
        currentWidth.current = 0
      }

      // console.log(text.measureSize(undefined))

      // console.log(text)
      // @ts-ignore
      // const m = layer.getContext().measureText(text)
      // console.log(m)

      const computedToken: ComputedToken = {
        ...token,
        x: currentWidth.current,
        y: (fontSize + gutter) * computedLineNumber.current,
        width,
      }

      currentWidth.current += width

      computedTokens.current.push(computedToken)

      text.destroy()
    })
  }

  return { initUseCode, computedTokens }
}

export default useCode
