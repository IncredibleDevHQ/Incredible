import { cx } from '@emotion/css'
import React, { HTMLProps } from 'react'

interface TextProps extends HTMLProps<HTMLParagraphElement> {
  fontSize: 'small' | 'normal'
}

const Text = ({ fontSize, className, children, ...rest }: TextProps) => {
  switch (fontSize) {
    case 'normal':
      return (
        <p className={cx(className)} {...rest}>
          {children}
        </p>
      )
    case 'small':
      return (
        <small className={cx(className)} {...rest}>
          {children}
        </small>
      )
    default:
      return (
        <p className={cx(className)} {...rest}>
          {children}
        </p>
      )
  }
}

export default Text
