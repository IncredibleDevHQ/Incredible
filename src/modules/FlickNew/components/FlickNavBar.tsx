import React, { useEffect, useState } from 'react'
import { FiBell, FiChevronLeft, FiLink2, FiUpload } from 'react-icons/fi'
import { Link, useHistory } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import { Heading, Button, updateToast, emitToast } from '../../../components'
import { ASSETS } from '../../../constants'
import {
  useProduceVideoMutation,
  useUpdateFlickMutation,
} from '../../../generated/graphql'
import { FlickActivity } from '../../Flick/components'
import { newFlickStore } from '../store/flickNew.store'
import ShareModal from './ShareModal'

const FlickNavBar = () => {
  const [{ flick }, setFlickStore] = useRecoilState(newFlickStore)
  const [isActivityMenu, setIsActivityMenu] = useState(false)
  const [isShareOpen, setIsShareOpen] = useState(false)

  const [editFlickName, setEditFlickName] = useState(false)
  const [flickName, setFlickName] = useState(flick?.name || '')
  const history = useHistory()

  const [updateFlickMutation, { data, error }] = useUpdateFlickMutation()

  const [produceVideoMutation] = useProduceVideoMutation()

  const updateFlick = async (newName: string) => {
    if (editFlickName) {
      await updateFlickMutation({
        variables: {
          name: newName,
          flickId: flick?.id,
        },
      })
    }
  }

  const produceVideo = async () => {
    const toastProps = {
      title: 'Pushing pixels...',
      type: 'info',
      autoClose: false,
      description: 'Our hamsters are gift-wrapping your Fragment. Do hold. :)',
    }

    // @ts-ignore
    const toast = emitToast(toastProps)

    try {
      const { errors } = await produceVideoMutation({
        variables: {
          flickId: flick?.id,
        },
      })
      if (errors) throw errors[0]

      updateToast({
        id: toast,
        ...toastProps,
        autoClose: false,
        type: 'info',
        description: 'Almost done! Click here to see all your Flicks!',
        onClick: () => history.push('/dashboard'),
      })
    } catch (e) {
      emitToast({
        title: 'Yikes. Something went wrong.',
        type: 'error',
        autoClose: false,
        description: 'Our servers are a bit cranky today. Try in a while?',
      })
    }
  }

  useEffect(() => {
    if (!data) return
    if (flick) {
      setFlickStore((prev) => ({
        ...prev,
        flick: { ...flick, name: flickName },
      }))
    }
  }, [data])

  return (
    <div className="flex justify-between items-center pr-6 pl-3 py-2">
      <div className="flex items-center">
        <Link to="/dashboard">
          <div className="flex">
            <FiChevronLeft size={32} className="text-gray-700 mr-2" />
            <img src={ASSETS.ICONS.StudioLogo} alt="" className="w-32" />
          </div>
        </Link>
        <Heading
          className="font-semibold ml-12 p-2 rounded-md hover:bg-gray-100"
          contentEditable={editFlickName}
          onMouseDown={() => setEditFlickName(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              setEditFlickName(false)
              setFlickName(e.currentTarget.innerText)
              updateFlick(e.currentTarget.innerText)
            }
          }}
        >
          {flick?.name}
        </Heading>
      </div>
      <div className="flex items-center">
        <FiBell
          className="text-gray-600 mr-8 cursor-pointer"
          size={24}
          onClick={() => setIsActivityMenu(!isActivityMenu)}
        />
        <Button
          appearance="link"
          icon={FiLink2}
          type="button"
          onClick={() => {
            setIsShareOpen(true)
          }}
        >
          Invite
        </Button>
        <ShareModal
          open={isShareOpen}
          handleClose={() => {
            setIsShareOpen(false)
          }}
        />
        <Button
          appearance="primary"
          size="small"
          icon={FiUpload}
          type="button"
          disabled={!flick?.fragments.every((f) => f.producedLink !== null)}
          onClick={produceVideo}
        >
          Publish
        </Button>
      </div>
      <div className="absolute right-0">
        <FlickActivity menu={isActivityMenu} setMenu={setIsActivityMenu} />
      </div>
    </div>
  )
}

export default FlickNavBar
