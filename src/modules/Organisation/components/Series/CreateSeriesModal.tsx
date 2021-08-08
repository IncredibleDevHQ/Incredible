import React, { useState } from 'react'
import Modal from 'react-responsive-modal'
import { Button, TextField } from '../../../../components'
import { useCreateSeriesMutation } from '../../../../generated/graphql'
import { useUploadFile } from '../../../../hooks/use-upload-file'

interface Props {
  seriesModal: boolean
  setSeriesModal: React.Dispatch<React.SetStateAction<boolean>>
  organisationSlug: string
  seriesCreated: boolean
  setSeriesCreated: React.Dispatch<React.SetStateAction<boolean>>
}

const seriesModal = ({
  seriesModal,
  setSeriesModal,
  organisationSlug,
  seriesCreated,
  setSeriesCreated,
}: Props) => {
  const [name, setName] = useState<string>()
  const [pic, setPic] = useState<string>()
  const [loadingPic, setLoadingPic] = useState<boolean>(false)

  const [uploadFile] = useUploadFile()

  const handleClick = async (file: File | Blob) => {
    if (!file) return

    setLoadingPic(true)
    const pic = await uploadFile({
      extension: file.name.split('.')[1],
      file,
      handleProgress: ({ percentage }) => {
        console.log({ percentage })
      },
    })
    setLoadingPic(false)
    setPic(pic.url)
  }

  const [CreateSeries, { data, loading }] = useCreateSeriesMutation()

  const handleCreateSeries = async () => {
    await CreateSeries({
      variables: {
        name,
        organisationSlug,
        picture: pic,
      },
    })

    setSeriesCreated(!seriesCreated)
    setSeriesModal(false)
  }

  return (
    <Modal
      classNames={{
        modal: 'w-full h-2/5',
        closeButton: 'focus:outline-none',
      }}
      open={seriesModal}
      onClose={() => setSeriesModal(false)}
      center
    >
      <div className="flex flex-col items-center justify-evenly h-full">
        <h2 className="text-3xl font-bold">Create a New Series</h2>
        <div className="flex w-2/3 flex-col flex-1 justify-around items-center">
          <TextField
            label="Name"
            className="my-2"
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setName(e.target.value)
            }
          />
          <input
            type="file"
            className="w-full mb-2"
            accept="image/*"
            onChange={(e) => handleClick(e.target.files[0])}
          />
          <Button
            appearance="primary"
            type="button"
            onClick={handleCreateSeries}
            disabled={loadingPic}
            loading={loadingPic || loading}
          >
            Upload from System
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default seriesModal
