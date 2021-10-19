import Konva from 'konva'
import React, { useEffect, useRef, useState } from 'react'
import { Group, Text, Image, Rect } from 'react-konva'
import FontFaceObserver from 'fontfaceobserver'
import { useRecoilValue } from 'recoil'
import { useImage } from 'react-konva-utils'
import { NextTokenIcon } from '../../../components'
import { User, userState } from '../../../stores/user.store'
import { Concourse } from '../components'
import { CONFIG, StudioUserConfig } from '../components/Concourse'
import { ControlButton } from '../components/MissionControl'
import { StudioProviderProps, studioStore } from '../stores'
import config from '../../../config'
import useEdit from '../hooks/use-edit'

const TriviaEleven = () => {
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number>(0)
  const [questions, setQuestions] = useState<{ text: string; image: string }[]>(
    []
  )
  const [titleSpalshData, settitleSpalshData] = useState<{
    enable: boolean
    title?: string
  }>({ enable: false })

  const { fragment, state, updatePayload, payload } =
    (useRecoilValue(studioStore) as StudioProviderProps) || {}

  const { getImageDimensions } = useEdit()

  const [qnaImage] = useImage(
    questions && questions[activeQuestionIndex]
      ? questions[activeQuestionIndex].image
      : '',
    'anonymous'
  )

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

  const [imgDim, setImgDim] = useState<{
    width: number
    height: number
    x: number
    y: number
  }>({ width: 0, height: 0, x: 0, y: 0 })
  useEffect(() => {
    const font = new FontFaceObserver('Poppins')
    font.load()
  }, [])

  useEffect(() => {
    setImgDim(
      getImageDimensions(
        {
          w: (qnaImage && qnaImage.width) || 0,
          h: (qnaImage && qnaImage.height) || 0,
        },
        610,
        250,
        640,
        280,
        37,
        90
      )
    )
  }, [qnaImage])

  useEffect(() => {
    if (!fragment?.configuration.properties) return
    setQuestions(
      fragment.configuration.properties.find(
        (property: any) => property.type === 'json'
      )?.value
    )
    // setConfig of titleSpalsh
    settitleSpalshData({
      enable: fragment.configuration.properties.find(
        (property: any) => property.key === 'showTitleSplash'
      )?.value,
      title: fragment.name as string,
    })
  }, [fragment?.configuration.properties])

  useEffect(() => {
    if (state === 'ready') {
      updatePayload?.({ activeQuestion: 0 })
    }
    if (state === 'recording') {
      setActiveQuestionIndex(0)
    }
  }, [state])

  useEffect(() => {
    setActiveQuestionIndex(payload?.activeQuestion)
  }, [payload])

  const controls = [
    <ControlButton
      key="nextQuestion"
      icon={NextTokenIcon}
      className="my-2"
      appearance="primary"
      disabled={activeQuestionIndex === questions.length - 1}
      onClick={() => {
        setActiveQuestionIndex(activeQuestionIndex + 1)
        updatePayload?.({ activeQuestion: activeQuestionIndex + 1 })
      }}
    />,
  ]

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
      fill="white"
      cornerRadius={8}
    />,
    <Group x={37} y={58} key="group1">
      {questions?.length > 0 && questions[activeQuestionIndex]?.image ? (
        <Text
          x={10}
          y={20}
          align="center"
          fontSize={32}
          fill="#374151"
          width={620}
          lineHeight={1.2}
          text={questions[activeQuestionIndex]?.text}
          fontStyle="bold"
          fontFamily="Poppins"
          textTransform="capitalize"
        />
      ) : (
        <></>
      )}
      {questions.length > 0 && !questions[activeQuestionIndex]?.image ? (
        <Text
          x={10}
          verticalAlign="middle"
          fontSize={32}
          fill="#374151"
          width={620}
          height={390}
          text={questions[activeQuestionIndex]?.text}
          fontStyle="bold"
          fontFamily="Poppins"
          align="center"
          textTransform="capitalize"
        />
      ) : (
        <>
          <Image
            image={qnaImage}
            y={imgDim.y}
            x={imgDim.x}
            width={imgDim.width}
            height={imgDim.height}
            shadowOpacity={0.3}
            shadowOffset={{ x: 0, y: 1 }}
            shadowBlur={2}
          />
        </>
      )}
    </Group>,
    <Image image={pytorchLogo} x={30} y={CONFIG.height - 70} />,
    <Image image={incredibleLogo} x={810} y={CONFIG.height - 70} />,
  ]

  return (
    <Concourse
      controls={controls}
      layerChildren={layerChildren}
      titleSpalshData={titleSpalshData}
      studioUserConfig={studioCoordinates}
    />
  )
}

export default TriviaEleven