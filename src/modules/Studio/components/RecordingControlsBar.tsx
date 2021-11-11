/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
import { cx } from '@emotion/css'
import React, { HTMLAttributes, useEffect, useState } from 'react'
import { IconType } from 'react-icons'
import { FiCheck, FiX, FiZoomIn, FiZoomOut } from 'react-icons/fi'
import {
  IoHandRightOutline,
  IoMicOffOutline,
  IoMicOutline,
  IoVideocamOffOutline,
  IoVideocamOutline,
} from 'react-icons/io5'
import { useRecoilState, useRecoilValue } from 'recoil'
import { Timer } from '.'
import startRecordIcon from '../../../assets/StartRecord.svg'
import stopRecordIcon from '../../../assets/StopRecord.svg'
import swapIcon from '../../../assets/Swap.svg'
import { Avatar, Heading, Tooltip } from '../../../components'
import { Fragment_Status_Enum_Enum } from '../../../generated/graphql'
import { useTimekeeper } from '../../../hooks'
import { canvasStore, StudioProviderProps, studioStore } from '../stores'

export const ControlButton = ({
  appearance,
  className,
  icon: I,
  disabled,
  ...rest
}: {
  appearance: 'primary' | 'danger' | 'success'
  icon: IconType
  disabled?: boolean
} & HTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      type="button"
      disabled={disabled}
      className={cx(
        'p-2 rounded-full flex items-center justify-center',
        {
          'bg-brand-10 text-brand': appearance === 'primary',
          'bg-error-10 text-error': appearance === 'danger',
          'bg-success-10 text-success': appearance === 'success',
          'opacity-70 cursor-not-allowed': disabled,
        },
        className
      )}
      {...rest}
    >
      <I
        color={(() => {
          switch (appearance) {
            case 'danger':
              return '#EF2D56'
            case 'primary':
              return '#5156EA'
            case 'success':
              return '#137547'
            default:
              return 'transparent'
          }
        })()}
      />
    </button>
  )
}

const RaiseHandsMenu = ({ participants }: { participants: any[] }) => {
  return (
    <div className="flex flex-col shadow-2xl p-1 rounded-md bg-background">
      {participants.map(({ name, id, picture, email }, index) => (
        <div
          className="flex justify-start items-center w-full mb-2 last:mb-0"
          key={id || index}
        >
          <Avatar
            className="w-6 h-6 rounded-full"
            src={picture}
            alt={name}
            email={email}
          />
          <Heading fontSize="small" className="ml-1">
            {name}
          </Heading>
        </div>
      ))}
    </div>
  )
}

const RecordingControlsBar = () => {
  const {
    constraints,
    upload,
    reset,
    state,
    mute,
    participants,
    updateParticipant,
    payload,
    updatePayload,
    participantId,
  } = (useRecoilValue(studioStore) as StudioProviderProps) || {}
  const [canvas, setCanvas] = useRecoilState(canvasStore)
  const [studio, setStudio] = useRecoilState(studioStore)
  const [isRaiseHandsTooltip, setRaiseHandsTooltip] = useState(false)
  const [participant, setParticipant] = useState<any>()
  const [participantsArray, setParticipantsArray] = useState<any[]>([])
  const { handleStart, handleReset, timer } = useTimekeeper(0)

  useEffect(() => {
    if (!participants) return
    const arr = []
    for (const i in participants) {
      arr.push({
        id: participants[i].id,
        name: participants[i].displayName,
        email: participants[i].email,
        picture: participants[i].picture,
        raiseHands: participants[i].raiseHands,
        audio: participants[i].audio,
        video: participants[i].video,
      })
    }
    setParticipantsArray(arr)
  }, [participants])

  useEffect(() => {
    if (participants && participantId) {
      setParticipant(participants[participantId])
    }
  }, [participants, participantId])

  useEffect(() => {
    if (!participantsArray) return
    setRaiseHandsTooltip(participantsArray.some((p) => p.raiseHands))
  }, [participantsArray])

  useEffect(() => {
    if (payload?.status === Fragment_Status_Enum_Enum.Live && timer === 0) {
      handleStart()
    }
    if (payload?.status === Fragment_Status_Enum_Enum.Ended) {
      handleReset()
    }
  }, [payload])

  useEffect(() => {
    if (timer === 0) return
    if (timer === 180) {
      updatePayload?.({ ...payload, status: Fragment_Status_Enum_Enum.Ended })
    }
  }, [timer])

  return (
    <div className="flex gap-x-4 items-center justify-center">
      {state === 'preview' && (
        <div className="flex items-center rounded-md">
          <button
            type="button"
            className="p-3 bg-red-600 rounded-tl-md rounded-bl-md"
            onClick={() => {
              reset()
              handleReset()
              updatePayload?.({
                status: Fragment_Status_Enum_Enum.NotStarted,
              })
            }}
          >
            <FiX className="text-white" />
          </button>
          <button
            type="button"
            className="p-3 bg-gray-800 rounded-tr-md rounded-br-md"
            onClick={() => {
              upload()
              updatePayload?.({
                status: Fragment_Status_Enum_Enum.Completed,
              })
            }}
          >
            <FiCheck className="text-white" />
          </button>
        </div>
      )}

      {(state === 'recording' ||
        payload?.status === Fragment_Status_Enum_Enum.Live) && (
        <button
          type="button"
          onClick={() => {
            updatePayload?.({
              ...payload,
              status: Fragment_Status_Enum_Enum.Ended,
            })
          }}
          className="flex gap-x-2 bg-gray-700 items-center justify-center p-2 rounded-md"
        >
          <img src={stopRecordIcon} alt="stop" />
          <Timer target={180} timer={timer} />
        </button>
      )}
      {state === 'ready' && (
        <button
          type="button"
          onClick={() => {
            setStudio({ ...studio, state: 'countDown' })
            updatePayload?.({
              status: Fragment_Status_Enum_Enum.CountDown,
            })
          }}
          className="flex bg-gray-700 items-center justify-center p-2 rounded-md"
        >
          <img src={startRecordIcon} alt="start" />
        </button>
      )}
      <button
        type="button"
        onClick={async () => {
          updateParticipant?.({ audio: !constraints?.audio })
          await mute('audio')
        }}
      >
        {constraints?.audio ? (
          <IoMicOutline className="text-gray-600" size={24} />
        ) : (
          <IoMicOffOutline className="text-gray-600" size={24} />
        )}
      </button>
      <button
        type="button"
        onClick={async () => {
          updateParticipant?.({ video: !constraints?.video })
          await mute('video')
        }}
      >
        {constraints?.video ? (
          <IoVideocamOutline className="text-gray-600" size={24} />
        ) : (
          <IoVideocamOffOutline className="text-gray-600" size={24} />
        )}
      </button>
      <div className="w-px bg-gray-200 h-full mx-1" />
      <button
        type="button"
        onClick={() => {
          if (canvas) setCanvas({ ...canvas, zoomed: !canvas.zoomed })
        }}
      >
        {canvas?.zoomed ? (
          <FiZoomIn className="text-gray-600" size={24} />
        ) : (
          <FiZoomOut className="text-gray-600" size={24} />
        )}
      </button>
      <button
        type="button"
        onClick={() => {
          if (payload?.fragmentState === 'onlyUserMedia') {
            // updating the fragment state in the payload to customLayout state
            updatePayload?.({
              fragmentState: 'customLayout',
            })
          } else {
            // updating the fragment state in the payload to onlyUserMedia state
            updatePayload?.({
              fragmentState: 'onlyUserMedia',
            })
          }
        }}
      >
        <img src={swapIcon} alt="swap" />
      </button>
      <Tooltip
        isOpen={isRaiseHandsTooltip}
        setIsOpen={setRaiseHandsTooltip}
        content={
          <RaiseHandsMenu
            participants={participantsArray.filter((p) => p.raiseHands)}
          />
        }
        placement="left-end"
        hideOnOutsideClick={false}
      >
        <button
          type="button"
          onClick={() => {
            updateParticipant?.({ raiseHands: !participant?.raiseHands })
          }}
        >
          <IoHandRightOutline className="text-gray-600 -mb-1.5" size={24} />
        </button>
      </Tooltip>
    </div>
  )
}

ControlButton.defaultProps = {
  disabled: false,
}

export default RecordingControlsBar
