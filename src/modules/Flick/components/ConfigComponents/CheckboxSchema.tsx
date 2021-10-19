import React from 'react'
import { Checkbox } from '../../../../components'
import { GetSchemaElementProps } from '../Effects'

const CheckboxSchema = ({
  schema,
  setFieldValue,
  setConfigured,
  value,
}: GetSchemaElementProps) => {
  const handleOnDatachange = (schemaValue: boolean, value: boolean) => {
    if (schemaValue === value) {
      setConfigured(true)
    } else if (schemaValue !== value) {
      setConfigured(false)
    }
  }
  return (
    <Checkbox
      name={schema.key}
      label={schema.name}
      id={schema.key}
      value={value}
      key={schema.key}
      checked={value}
      onChange={() => {
        handleOnDatachange(schema?.value, !value)
        if (setFieldValue) setFieldValue(schema.key, !value)
      }}
      className="flex flex-wrap lg:align-middle gap-3 text-lg text-black ml-4 lg:capitalize p-4"
    />
  )
}
export default CheckboxSchema
