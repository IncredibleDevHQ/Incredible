import { css } from '@emotion/css'
import React, { HTMLProps } from 'react'

interface CheckBoxProps extends HTMLProps<HTMLInputElement> {
  name: string
  label: string
}

const Checkbox = ({
  name,
  label,
  className,
  onChange,
  checked,
  key,
}: CheckBoxProps) => {
  const switchCSS = css`
    position: relative;
    display: inline-block;
    width: 3.4375rem;
    height: 1.75rem;
    & input {
      opacity: 0;
      width: 0;
      height: 0;
    }
  `

  const slider = css`
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    -webkit-transition: 0.4s;
    transition: 0.4s;

    &:before {
      position: absolute;
      content: '';
      height: 1.25rem;
      width: 1.25rem;
      left: 4px;
      bottom: 4px;
      background-color: white;
      -webkit-transition: 0.4s;
      transition: 0.4s;
      border-radius: 50%;
    }

    input:checked + & {
      background-color: #5156ea;
    }

    input:focus + & {
      box-shadow: 0 0 1px #5156ea;
    }

    input:checked + &:before {
      -webkit-transform: translateX(1.625rem);
      -ms-transform: translateX(1.625rem);
      transform: translateX(1.625rem);
    }

    border-radius: 2.125rem;
  `

  return (
    <div className="flex gap-1 items-center p-4" key={key}>
      <span className="text-base mr-2">{label}</span>
      <label className={switchCSS} htmlFor={label}>
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          name={name}
          id={label}
          className={className}
        />
        <span className={`${slider} round`} />
      </label>
    </div>
  )
}

export default Checkbox