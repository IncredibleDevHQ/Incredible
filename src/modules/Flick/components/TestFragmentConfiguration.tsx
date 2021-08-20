import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import { useFormik } from 'formik'
import { Button, emitToast, EmptyState, ScreenState } from '../../../components'
import {
  FlickFragmentFragment,
  useUpdateFragmentConfigurationMutation,
} from '../../../generated/graphql'
import { fragmentTemplateStore } from '../../../stores/fragment.store'
import { getSchemaElement, SchemaElementProps } from './Effects'

const TestFragmentConfiguration = ({
  fragment,
}: {
  fragment?: FlickFragmentFragment
}) => {
  const [selectedTemplates] = useRecoilState(fragmentTemplateStore)
  const [config, setConfig] = useState<SchemaElementProps[]>()

  const history = useHistory()

  const [isConfigured, setConfigured] = useState(false)
  // const [updateFragment,{data, error}] = useUpdateFragmentConfigurationMutation(
  //   {
  //     variables: {
  //        fragmentId: fragment?.id
  //        items: schema
  //     },
  //   }
  // )

  // const submit = () => {

  // }

  useEffect(() => {
    if (!fragment || !fragment.configuration) return
    setConfig(fragment!.configuration.properties)
  }, [fragment?.configuration])

  // if (error)
  //   return (
  //     <ScreenState title="Something went wrong!!" subtitle={error.message} />
  //   )

  if (!fragment) return <EmptyState text="No fragment Selected" width={400} />

  const obj: { [key: string]: any } = {}

  config?.forEach((code) => {
    obj[code.key] = code.value
  })

  const {
    errors,
    handleChange,
    handleSubmit,
    values,
    handleBlur,
    touched,
    isValid,
    setSubmitting,
  } = useFormik({
    initialValues: obj,
    onSubmit: async (values) => {
      if (!isValid) return
      try {
        setSubmitting(true)
        console.log('submit', values)
      } catch (e: any) {
        emitToast({
          title: 'Something went wrong.',
          description: e.message,
          type: 'error',
        })
      } finally {
        setSubmitting(false)
      }
    },
  })

  const questions = [
    {
      key: 'questions',
      type: 'text[]',
      name: 'Please Enter Your Questions',
      description: 'Add Your Question',
      dirty: false,
      required: true,
      editable: true,
      value: [],
    },
  ]

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {config?.map((attribute) =>
          getSchemaElement(attribute, handleChange, values[attribute.key])
        )}
        <Button
          type="button"
          size="small"
          className="ml-4"
          appearance="secondary"
          onClick={(e) => {
            e?.preventDefault()
            handleSubmit()
          }}
        >
          Save Configuration
        </Button>
      </form>

      <Button
        type="button"
        className="ml-auto"
        size="medium"
        appearance="primary"
        disabled={!isConfigured}
        onClick={() => {
          history.push(`/${fragment.id}/studio`)
        }}
      >
        Record
      </Button>
      {/* <TestConfig /> */}
    </div>
  )
}

TestFragmentConfiguration.defaultProps = {
  fragment: undefined,
}

export default TestFragmentConfiguration
