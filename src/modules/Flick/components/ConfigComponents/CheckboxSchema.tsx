import React from 'react'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { Checkbox } from '../../../../components'
// eslint-disable-next-line import/namespace
import { GetSchemaElementProps } from '../Effects'

export const CheckboxSchema = ({
  schema,
  setFieldValue,
  setConfigured,
  value,
}: GetSchemaElementProps) => {
  return (
    <Checkbox
      name={schema.key}
      label={schema.name}
      id={schema.key}
      value={value}
      key={schema.key}
      checked={value}
      onChange={() => {
        setConfigured(false)
        if (setFieldValue) setFieldValue(schema.key, !value)
      }}
      className="flex flex-wrap lg:align-middle gap-3 text-lg text-black ml-4 lg:capitalize p-4"
    />
  )
}
export default CheckboxSchema
