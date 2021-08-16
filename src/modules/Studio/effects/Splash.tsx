import React, { useEffect, useState } from 'react'
import { Group, Image, Rect, Text } from 'react-konva'
import useImage from 'use-image'
import { useRecoilValue } from 'recoil'
import { Concourse } from '../components'
import { User, userState } from '../../../stores/user.store'
import { CONFIG } from '../components/Concourse'
import { StudioProviderProps, studioStore } from '../stores'

const Splash = () => {
  const { picture, displayName, username } =
    (useRecoilValue(userState) as User) || {}

  const [image] = useImage(picture as string, 'anonymous')

  const { fragment, state } =
    (useRecoilValue(studioStore) as StudioProviderProps) || {}

  const controls: any = []

  useEffect(() => {
    if (state === 'recording') {
      handleRecord()
    }
  }, [state])

  const [layerChildren, setLayerChildren] = useState([
    <Rect
      x={0}
      y={0}
      fillLinearGradientColorStops={[0, '#5156EA', 1, '#51A3EA']}
      fillLinearGradientStartPoint={{ x: 0, y: CONFIG.height / 2 }}
      fillLinearGradientEndPoint={{ x: CONFIG.width, y: CONFIG.height / 2 }}
      width={CONFIG.width}
      height={CONFIG.height}
      cornerRadius={8}
    />,
  ])

  const handleRecord = () => {
    setLayerChildren((layerChildren) => [
      ...layerChildren,
      <Group x={-100} y={200} ref={(ref) => ref?.to({ x: -10, duration: 1 })}>
        <Rect fill="#fff" width={400} height={60} cornerRadius={12} />
        <Text
          x={20}
          y={15}
          text={fragment?.flick.name}
          fill="#5156EA"
          fontSize={40}
          align="center"
        />
      </Group>,
      <Group x={20} y={360}>
        <Group
          x={0}
          y={-10}
          clipFunc={(ctx: any) => {
            ctx.arc(40, 40, 40, 0, Math.PI * 2, true)
          }}
          scaleX={0}
          scaleY={0}
          ref={(ref) => ref?.to({ scaleY: 1, scaleX: 1, duration: 1 })}
        >
          <Image image={image} width={80} height={80} />
        </Group>
        <Text
          x={100}
          y={10}
          fill="white"
          fontSize={24}
          fontStyle="700"
          text={displayName as string}
          scaleX={0}
          ref={(ref) => ref?.to({ scaleX: 1, duration: 1 })}
        />
        <Text
          x={100}
          y={40}
          fill="white"
          fontSize={16}
          letterSpacing={1}
          text={`@${username}`}
          scaleY={0}
          ref={(ref) => ref?.to({ offsetY: -5, scaleY: 1, duration: 1 })}
        />
      </Group>,
    ])
  }

  return (
    <Concourse
      disableUserMedia
      layerChildren={layerChildren}
      controls={controls}
    />
  )
}

export default Splash
