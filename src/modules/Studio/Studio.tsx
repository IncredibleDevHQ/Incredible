import React, { useEffect, useMemo, useState } from 'react'
import { FiArrowLeft } from 'react-icons/fi'
import { useHistory, useParams } from 'react-router-dom'
import { useRecoilState, useRecoilValue } from 'recoil'
import getBlobDuration from 'get-blob-duration'

import {
  emitToast,
  dismissToast,
  EmptyState,
  Heading,
  ScreenState,
  updateToast,
} from '../../components'
import {
  Fragment_Status_Enum_Enum,
  StudioFragmentFragment,
  useGetFragmentByIdQuery,
  useGetRtcTokenMutation,
  useMarkFragmentCompletedMutation,
} from '../../generated/graphql'
import { useCanvasRecorder, useTimekeeper } from '../../hooks'
import { User, userState } from '../../stores/user.store'
import { getEffect } from './effects/effects'
import { useUploadFile } from '../../hooks/use-upload-file'
import { useAgora } from './hooks'
import { StudioProviderProps, StudioState, studioStore } from './stores'
import { useRTDB } from './hooks/use-rtdb'
import { Timer, Countdown } from './components'

const Studio = () => {
  const { fragmentId } = useParams<{ fragmentId: string }>()
  const { constraints } =
    (useRecoilValue(studioStore) as StudioProviderProps) || {}
  const [studio, setStudio] = useRecoilState(studioStore)
  const { sub } = (useRecoilValue(userState) as User) || {}
  const [fragment, setFragment] = useState<StudioFragmentFragment>()
  const history = useHistory()

  const { data, loading } = useGetFragmentByIdQuery({
    variables: { id: fragmentId, sub: sub as string },
  })

  const [markFragmentCompleted] = useMarkFragmentCompletedMutation()

  const [uploadFile] = useUploadFile()

  const {
    stream,
    join,
    users,
    mute,
    ready,
    leave,
    userAudios,
    tracks,
    renewToken,
    cameraDevice,
    microphoneDevice,
    getCameras,
    getMicrophones,
    updateCameraDevices,
    updateMicroPhoneDevices,
  } = useAgora(fragmentId, {
    onTokenWillExpire: async () => {
      const { data } = await getRTCToken({ variables: { fragmentId } })
      if (data?.RTCToken?.token) {
        renewToken(data.RTCToken.token)
      }
    },
    onTokenDidExpire: async () => {
      const { data } = await getRTCToken({ variables: { fragmentId } })
      if (data?.RTCToken?.token) {
        const participantId = fragment?.participants.find(
          ({ participant }) => participant.userSub === sub
        )?.participant.id
        if (participantId) {
          join(data?.RTCToken?.token, participantId as string)
        } else {
          leave()
          emitToast({
            title: 'Yikes. Something went wrong.',
            type: 'error',
            description:
              'You do not belong to this studio!! Please ask the host to invite you again.',
          })
          history.goBack()
        }
      }
    },
  })

  const [getRTCToken] = useGetRtcTokenMutation({
    variables: { fragmentId },
  })

  const { participants, init, payload, updatePayload, updateParticipant } =
    useRTDB<any, any>({
      lazy: true,
      path: `rtdb/fragments/${fragmentId}`,
      participants: {
        enabled: true,
        path: `rtdb/fragments/${fragmentId}/participants`,
        childPath: `rtdb/fragments/${fragmentId}/participants/${
          fragment?.participants.find(
            ({ participant }) => participant.userSub === sub
          )?.participant.id
        }`,
      },
      presence: {
        enabled: true,
        path: `rtdb/fragments/${fragmentId}/participants/${
          fragment?.participants.find(
            ({ participant }) => participant.userSub === sub
          )?.participant.id
        }`,
      },
      payload: { enabled: true, path: `rtdb/fragments/${fragmentId}/payload` },
    })

  useEffect(() => {
    if (fragment && ready) {
      ;(async () => {
        init()
        const { data } = await getRTCToken({ variables: { fragmentId } })
        if (data?.RTCToken?.token) {
          const participantId = fragment?.participants.find(
            ({ participant }) => participant.userSub === sub
          )?.participant.id
          if (participantId) {
            join(data?.RTCToken?.token, participantId as string)
          } else {
            leave()
            emitToast({
              title: 'Yikes. Something went wrong.',
              type: 'error',
              description:
                'You do not belong to this studio!! Please ask the host to invite you again.',
            })
            history.goBack()
          }
        }
      })()
    }
  }, [fragment, ready])

  useEffect(() => {
    if (data?.Fragment[0] === undefined) return
    setFragment(data.Fragment[0])
  }, [data, fragmentId])

  useEffect(() => {
    return () => {
      leave()
      setFragment(undefined)
      setStudio({
        ...studio,
        fragment: undefined,
        tracks,
      })
    }
  }, [])

  const [state, setState] = useState<StudioState>('ready')

  const { startRecording, stopRecording, reset, getBlobs } = useCanvasRecorder({
    options: {},
  })

  const { handleStart, handleReset, timer } = useTimekeeper(0)

  /**
   * END STREAM HOOKS...
   */

  /**
   * =====================
   * Event Handlers...
   * =====================
   */

  const resetRecording = () => {
    reset()
    init()
    handleReset()
    setState('ready')
  }

  const upload = async () => {
    setState('upload')

    const toastProps = {
      title: 'Pushing pixels...',
      type: 'info',
      autoClose: false,
      description: 'Our hamsters are gift-wrapping your Fragment. Do hold. :)',
    }

    // @ts-ignore
    const toast = emitToast(toastProps)

    try {
      const uploadVideoFile = await getBlobs()
      const { uuid } = await uploadFile({
        extension: 'webm',
        file: uploadVideoFile,
        handleProgress: ({ percentage }) => {
          updateToast({
            id: toast,
            ...toastProps,
            type: 'info',
            autoClose: false,
            title: `Pushing pixels... (${percentage}%)`,
          })
        },
      })

      const duration = await getBlobDuration(uploadVideoFile)

      await markFragmentCompleted({
        variables: { id: fragmentId, producedLink: uuid, duration },
      })

      dismissToast(toast)
      leave()
      stream?.getTracks().forEach((track) => track.stop())
      setFragment(undefined)
      setStudio({
        ...studio,
        fragment: undefined,
        tracks,
      })
      history.push(`/flick/${fragment?.flickId}/${fragmentId}`)
    } catch (e) {
      emitToast({
        title: 'Yikes. Something went wrong.',
        type: 'error',
        autoClose: false,
        description: 'Our servers are a bit cranky today. Try in a while?',
      })
    }
  }

  const start = () => {
    const canvas = document
      .getElementsByClassName('konvajs-content')[0]
      .getElementsByTagName('canvas')[0]

    // @ts-ignore
    startRecording(canvas, {
      localStream: stream as MediaStream,
      remoteStreams: userAudios,
    })

    setState('recording')
  }

  const finalTransition = () => {
    if (!payload) return
    payload.playing = false
    updatePayload?.({ status: Fragment_Status_Enum_Enum.Ended })
  }

  const stop = () => {
    stopRecording()
    setState('preview')
  }

  useEffect(() => {
    if (timer === 0) return
    if (timer === 180) {
      updatePayload({ ...payload, status: Fragment_Status_Enum_Enum.Ended })
    }
  }, [timer])

  useEffect(() => {
    if (payload?.status === Fragment_Status_Enum_Enum.Live && timer === 0) {
      handleStart()
    }
    if (payload?.status === Fragment_Status_Enum_Enum.Ended) {
      handleReset()
      finalTransition()
    }
  }, [payload])

  useEffect(() => {
    if (payload?.status === Fragment_Status_Enum_Enum.NotStarted) {
      setState('ready')
    }
    if (
      !studio.isHost &&
      payload?.status === Fragment_Status_Enum_Enum.Completed
    ) {
      stream?.getTracks().forEach((track) => track.stop())
      history.goBack()
      emitToast({
        title: 'This Fragment is completed.',
        type: 'success',
        autoClose: 3000,
      })
    }
  }, [payload, studio.isHost])

  useMemo(() => {
    if (!fragment || !cameraDevice || !microphoneDevice) return
    setStudio({
      ...studio,
      fragment,
      stream: stream as MediaStream,
      startRecording: start,
      stopRecording: stop,
      showFinalTransition: finalTransition,
      reset: resetRecording,
      getCameras,
      getMicrophones,
      cameraDevice,
      microphoneDevice,
      updateCameraDevices,
      updateMicroPhoneDevices,
      upload,
      getBlobs,
      state,
      tracks,
      constraints: {
        audio: constraints ? constraints.audio : true,
        video: constraints ? constraints.video : true,
      },
      users,
      payload,
      mute: (type: 'audio' | 'video') => mute(type),
      participants,
      updateParticipant,
      updatePayload,
      participantId: fragment?.participants.find(
        ({ participant }) => participant.userSub === sub
      )?.participant.id,
      isHost:
        fragment?.participants.find(
          ({ participant }) => participant.userSub === sub
        )?.participant.owner || false,
    })
  }, [
    fragment,
    stream,
    users,
    state,
    userAudios,
    payload,
    participants,
    cameraDevice,
    microphoneDevice,
  ])

  /**
   * =======================
   * END EVENT HANDLERS...
   * =======================
   */

  if (loading) return <ScreenState title="Just a jiffy..." loading />

  if (!fragment || fragment.id !== fragmentId)
    return <EmptyState text="Fragment not found" width={400} />

  const C = getEffect(fragment.type, fragment.configuration)

  return (
    <div>
      <Countdown />
      <div className="py-2 px-4">
        <div className="flex flex-row justify-between bg-gray-100 p-2 rounded-md">
          <div className="flex-1 flex flex-row items-center">
            <FiArrowLeft
              className="cursor-pointer mr-2"
              onClick={async () => {
                setFragment(undefined)
                setStudio({
                  ...studio,
                  fragment: undefined,
                })
                stream?.getTracks().forEach((track) => track.stop())
                history.goBack()
              }}
            />
            <Heading
              className="font-semibold"
              onClick={() => {
                stream?.getTracks().forEach((track) => track.stop())
                history.goBack()
              }}
            >
              {fragment.flick.name} / {fragment.name}
            </Heading>
          </div>
          {payload?.status === Fragment_Status_Enum_Enum.Live ? (
            <Timer target={180} timer={timer} />
          ) : (
            <></>
          )}
        </div>
        {fragment && <C />}
      </div>
    </div>
  )
}

export default Studio
