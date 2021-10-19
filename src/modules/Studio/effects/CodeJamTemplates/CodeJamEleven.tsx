import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Circle, Group, Image, Rect } from 'react-konva'
import { useRecoilValue } from 'recoil'
import useImage from 'use-image'
import config from '../../../../config'
import { API } from '../../../../constants'
import {
  Fragment_Status_Enum_Enum,
  useGetTokenisedCodeLazyQuery,
} from '../../../../generated/graphql'
import { Concourse } from '../../components'
import { CONFIG, StudioUserConfig } from '../../components/Concourse'
import RenderTokens, {
  controls,
  getRenderedTokens,
  RenderFocus,
} from '../../components/RenderTokens'
import useCode from '../../hooks/use-code'
import { StudioProviderProps, studioStore } from '../../stores'

export const codeConfig = {
  fontSize: 14,
  width: 960,
  height: 540,
}

interface Position {
  prevIndex: number
  currentIndex: number
}

const CodeJamEleven = () => {
  const { fragment, payload, updatePayload, state, isHost } =
    (useRecoilValue(studioStore) as StudioProviderProps) || {}

  const [titleSpalshData, settitleSpalshData] = useState<{
    enable: boolean
    title?: string
  }>({ enable: false })

  const { initUseCode, computedTokens } = useCode()
  const [getTokenisedCode, { data }] = useGetTokenisedCodeLazyQuery()
  const [position, setPosition] = useState<Position>({
    prevIndex: -1,
    currentIndex: 0,
  })
  const [focusCode, setFocusCode] = useState<boolean>(false)

  const [incredibleLogo] = useImage(
    `${config.storage.baseUrl}x-incredible.svg`,
    'anonymous'
  )
  const [pytorchLogo] = useImage(
    `${config.storage.baseUrl}pytorch.svg`,
    'anonymous'
  )
  const [pytorchBg] = useImage(
    `${config.storage.baseUrl}pytorch_bg.svg`,
    'anonymous'
  )

  useEffect(() => {
    if (!fragment?.configuration.properties) return
    const gistURL = fragment.configuration.properties.find(
      (property: any) => property.key === 'gistUrl'
    )?.value

    // setConfig of titleSpalsh
    settitleSpalshData({
      enable: fragment.configuration.properties.find(
        (property: any) => property.key === 'showTitleSplash'
      )?.value,
      title: fragment.name as string,
    })

    if (!gistURL) throw new Error('Missing gist URL')
    ;(async () => {
      try {
        const { data } = await axios.get(
          `${API.GITHUB.BASE_URL}gists/${(gistURL as string).split('/').pop()}`
        )
        const file = data.files[Object.keys(data.files)[0]]
        getTokenisedCode({
          variables: {
            code: file.content,
            language: (file.language as string).toLowerCase(),
          },
        })
      } catch (e) {
        console.error(e)
        throw e
      }
    })()
  }, [fragment?.configuration.properties])

  useEffect(() => {
    if (!data?.TokenisedCode) return
    initUseCode({
      tokens: data.TokenisedCode.data,
      canvasWidth: 585,
      canvasHeight: 360,
      gutter: 5,
      fontSize: codeConfig.fontSize,
    })
  }, [data])

  useEffect(() => {
    setPosition({
      prevIndex: payload?.prevIndex || 0,
      currentIndex: payload?.currentIndex || 1,
    })
    setFocusCode(payload?.isFocus)
  }, [payload])

  useEffect(() => {
    if (state === 'ready') {
      setPosition({
        prevIndex: -1,
        currentIndex: 0,
      })
      updatePayload?.({
        currentIndex: 1,
        prevIndex: 0,
        isFocus: false,
      })
    }
  }, [state])

  const studioCoordinates: StudioUserConfig[] = (() => {
    switch (fragment?.participants.length) {
      case 2:
        return [
          {
            x: 700,
            y: 60,
            width: 240,
            height: 180,
            clipTheme: 'rect',
            borderWidth: 12,
            borderColor: '#8B008B',
            studioUserClipConfig: {
              x: 30,
              y: 0,
              width: 180,
              height: 180,
              radius: 90,
            },
          },
          {
            x: 700,
            y: 265,
            width: 240,
            height: 180,
            clipTheme: 'rect',
            borderWidth: 12,
            borderColor: '#8B008B',
            studioUserClipConfig: {
              x: 30,
              y: 0,
              width: 180,
              height: 180,
              radius: 90,
            },
          },
        ]
      case 3:
        return [
          {
            x: 705,
            y: 58.5,
            width: 160,
            height: 120,
            clipTheme: 'rect',
            borderWidth: 12,
            borderColor: '#8B008B',
            studioUserClipConfig: {
              x: 20,
              y: 0,
              width: 120,
              height: 120,
              radius: 60,
            },
          },
          {
            x: 705,
            y: 198.5,
            width: 160,
            height: 120,
            clipTheme: 'rect',
            borderWidth: 12,
            borderColor: '#8B008B',
            studioUserClipConfig: {
              x: 20,
              y: 0,
              width: 120,
              height: 120,
              radius: 60,
            },
          },
          {
            x: 705,
            y: 338.5,
            width: 160,
            height: 120,
            clipTheme: 'rect',
            borderWidth: 12,
            borderColor: '#8B008B',
            studioUserClipConfig: {
              x: 20,
              y: 0,
              width: 120,
              height: 120,
              radius: 60,
            },
          },
        ]
      default:
        return [
          {
            x: 660,
            y: 140.5,
            width: 320,
            height: 240,
            clipTheme: 'rect',
            borderWidth: 16,
            borderColor: '#8B008B',
            studioUserClipConfig: {
              x: 60,
              y: 0,
              width: 200,
              height: 200,
              radius: 100,
            },
          },
        ]
    }
  })()

  const layerChildren = [
    <Rect
      strokeWidth={1}
      x={0}
      y={0}
      fill="#F5F6F7"
      width={CONFIG.width}
      height={CONFIG.height}
      stroke="#111111"
    />,
    <Image
      image={pytorchBg}
      x={1}
      y={1}
      fill="#F5F6F7"
      width={CONFIG.width - 2}
      height={CONFIG.height - 2}
    />,
    <Rect
      x={37}
      y={56}
      width={704}
      height={396}
      fill="#202026"
      cornerRadius={8}
    />,
    <Group x={52} y={73} key="circleGroup">
      <Circle key="redCircle" x={0} y={0} fill="#FF605C" radius={5} />
      <Circle key="yellowCircle" x={14} y={0} fill="#FFBD44" radius={5} />
      <Circle key="greenCircle" x={28} y={0} fill="#00CA4E" radius={5} />
    </Group>,
    payload?.status === Fragment_Status_Enum_Enum.Live && (
      <Group x={57} y={88} key="group">
        {getRenderedTokens(computedTokens.current, position)}
        {computedTokens.current.length > 0 && (
          <RenderTokens
            key={position.prevIndex}
            tokens={computedTokens.current}
            startIndex={position.prevIndex}
            endIndex={position.currentIndex}
          />
        )}
      </Group>
    ),
    focusCode && (
      <RenderFocus
        tokens={computedTokens.current}
        lineNumber={computedTokens.current[position.prevIndex]?.lineNumber}
        currentIndex={position.currentIndex}
        groupCoordinates={{ x: 47, y: 88 }}
        bgRectInfo={{
          x: 37,
          y: 58,
          width: 704,
          height: 396,
          radius: 8,
        }}
      />
    ),
    <Image image={pytorchLogo} x={30} y={CONFIG.height - 70} />,
    <Image image={incredibleLogo} x={810} y={CONFIG.height - 70} />,
  ]

  return (
    <Concourse
      layerChildren={layerChildren}
      controls={controls(setFocusCode, position, computedTokens.current)}
      titleSpalshData={titleSpalshData}
      studioUserConfig={studioCoordinates}
    />
  )
}

export default CodeJamEleven