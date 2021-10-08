import React, { useEffect, useState } from 'react'
import { IoRemoveSharp } from 'react-icons/io5'
import { Button, TextField } from '../../../../components'
// eslint-disable-next-line import/namespace
import { GetSchemaElementProps } from '../Effects'

const TextArraySchema = ({
  schema,
  handleChange,
  setConfigured,
  value,
}: GetSchemaElementProps) => {
  const addToFormik = (valueArray: any) => {
    const event = new Event('input', { bubbles: true })
    dispatchEvent(event)
    // @ts-ignore
    event.target.name = schema.key
    // @ts-ignore
    event.target.value = valueArray
    handleChange(event as any)
    handleOnDatachange(schema.value, valueArray)
  }

  const [currentPoint, setCurrentPoint] = useState<string>()
  const [points, setPoints] = useState<string[]>([])

  useEffect(() => {
    if (!schema.value || schema.value.length <= 0) {
      setConfigured(false)
    } else {
      setConfigured(true)
    }
  }, [schema])

  useEffect(() => {
    if (!value || value.length <= 0) {
      setConfigured(false)
    }
    setPoints(value)
  }, [value])

  const handleOnAdd = () => {
    if (!currentPoint) return
    setPoints((points) => [...points, currentPoint])
    addToFormik([...points, currentPoint])
    setCurrentPoint('')
  }

  const handleDeleteText = (index: number) => {
    const pointArray = points.filter((ques, quesIndex) => quesIndex !== index)
    setPoints(pointArray)
    addToFormik(pointArray)
  }

  const handleOnDatachange = (schemaValue: string[], value: string[]) => {
    if (
      schemaValue.length === value.length &&
      schemaValue.every((v, i) => v === value[i])
    ) {
      setConfigured(true)
    } else if (
      schemaValue.length === value.length &&
      schemaValue.every((v, i) => v !== value[i])
    ) {
      setConfigured(false)
    } else if (schemaValue.length !== value.length) {
      setConfigured(false)
    }
  }

  return (
    <div className="flex flex-col gap-1 m-4" key={schema.key}>
      <div className="flex gap-2 items-end">
        <div
          className="flex flex-col md:flex-row items-end gap-2"
          key={schema.key}
        >
          <TextField
            // eslint-disable-next-line react/no-array-index-key
            className="text-lg"
            name={schema.key}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setCurrentPoint(e.target.value)
            }}
            value={currentPoint}
            placeholder={schema.description}
            label="Add a Point"
          />

          <Button
            onClick={handleOnAdd}
            appearance="secondary"
            type="button"
            size="large"
            className="w-full md:w-28"
          >
            Add
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2">
        {points?.map((ques, index) => (
          <div
            key={index}
            className="border-blue-200 px-4 py-2 m-1 flex items-center justify-between gap-2"
          >
            <div className="flex flex-col">
              <span className="font-bold">Point {index + 1}:</span>
              <span className="text-justify">{ques}</span>
            </div>
            <Button
              onClick={() => handleDeleteText(index)}
              type="button"
              appearance="danger"
              size="extraSmall"
            >
              <IoRemoveSharp />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
export default TextArraySchema
