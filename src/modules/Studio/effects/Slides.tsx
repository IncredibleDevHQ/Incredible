/* eslint-disable @typescript-eslint/no-unused-vars */
import Konva from 'konva'
import React, { useEffect, useRef, useState } from 'react'
import { Group, Image, Rect } from 'react-konva'
import { useRecoilValue } from 'recoil'
import useImage from 'use-image'
import { NextTokenIcon } from '../../../components'
import { Concourse } from '../components'
import { CONFIG } from '../components/Concourse'
import { ControlButton } from '../components/MissionControl'
import { canvasStore, StudioProviderProps, studioStore } from '../stores'
import { getDimensions } from './effects'
// eslint-disable-next-line import/no-unresolved
import Gif from '../components/Gif'

const Slides = () => {
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0)
  const [slides, setSlides] = useState<string[]>([])
  const { fragment, state, stream, picture, payload, constraints } =
    (useRecoilValue(studioStore) as StudioProviderProps) || {}
  const [titleSpalshData, settitleSpalshData] = useState<{
    enable: boolean
    title?: string
  }>({ enable: false })

  const imageConfig = { width: 640, height: 480 }
  const imageRef = useRef<Konva.Image | null>(null)
  const [image] = useImage(picture as string, 'anonymous')
  const [slide] = useImage(slides[activeSlideIndex] || '', 'anonymous')
  const [isGif, setIsGif] = useState(false)
  const [gifUrl, setGifUrl] = useState('')

  const [slideDim, setSlideDim] = useState<{
    width: number
    height: number
    x: number
    y: number
  }>({ width: 0, height: 0, x: 0, y: 0 })

  useEffect(() => {
    if (slide?.src.split('.').pop() === 'gif') {
      setIsGif(true)
      setGifUrl(slide.src)
    } else {
      setIsGif(false)
    }
    getDimensions(
      {
        w: (slide && slide.width) || 0,
        h: (slide && slide.height) || 0,
      },
      480,
      600,
      0,
      0,
      setSlideDim
    )
  }, [slide])

  const videoElement = React.useMemo(() => {
    if (!stream) return undefined
    const element = document.createElement('video')
    element.srcObject = stream
    element.muted = true
    return element
  }, [stream])

  useEffect(() => {
    return () => {
      stream?.getTracks().forEach((track) => track.stop())
    }
  }, [])

  useEffect(() => {
    if (!fragment?.configuration.properties) return
    setSlides(
      fragment.configuration.properties.find(
        (property: any) => property.type === 'file[]'
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
    if (!videoElement || !imageRef.current) return undefined
    videoElement.play()
    const layer = imageRef.current.getLayer()
    const anim = new Konva.Animation(() => {}, layer)
    anim.start()
    return () => {
      anim.stop()
    }
  }, [videoElement, imageRef.current])

  const ref = useRef<HTMLVideoElement | null>(null)
  const isDisableCamera = true

  useEffect(() => {
    if (!ref.current) return
    ref.current.srcObject = stream
  }, [ref.current])

  useEffect(() => {
    if (state === 'recording') {
      setActiveSlideIndex(0)
    }
  }, [state])

  const controls = [
    <ControlButton
      key="nextQuestion"
      icon={NextTokenIcon}
      className="my-2"
      appearance="primary"
      disabled={activeSlideIndex === slides.length - 1}
      onClick={() => setActiveSlideIndex(activeSlideIndex + 1)}
    />,
  ]

  const layerChildren = [
    // To get the white background color
    <Group x={0} y={0} fill="#E5E5E5" key="group0">
      <Rect
        x={0}
        y={0}
        width={CONFIG.width}
        height={CONFIG.height}
        fill="#E5E5E5"
      />
    </Group>,
    <Group height={480} width={600} key="group1">
      {slides.length > 0 && (
        <>
          <Group
            x={30}
            y={30}
            fill="#E5E5E5"
            width={600}
            height={480}
            clipFunc={(ctx: any) => {
              const { x, y } = slideDim
              const w = slideDim.width
              const h = slideDim.height
              const r = 8
              ctx.beginPath()
              ctx.moveTo(x + r, y)
              ctx.arcTo(x + w, y, x + w, y + h, r)
              ctx.arcTo(x + w, y + h, x, y + h, r)
              ctx.arcTo(x, y + h, x, y, r)
              ctx.arcTo(x, y, x + w, y, r)
              ctx.closePath()
            }}
          >
            {!isGif && (
              <Image
                image={slide}
                fill="#E5E5E5"
                width={slideDim.width}
                y={slideDim.y}
                x={slideDim.x}
                height={slideDim.height}
                shadowOpacity={0.3}
                shadowOffset={{ x: 0, y: 1 }}
                shadowBlur={2}
              />
            )}
          </Group>
          {isGif && (
            <Gif
              src={gifUrl}
              maxWidth={600}
              maxHeight={480}
              availableWidth={640}
              availableHeight={540}
              x={0}
              y={0}
            />
          )}
        </>
      )}
    </Group>,
    <Group
      y={30}
      x={650}
      offsetX={280}
      scaleX={-1}
      clipFunc={(ctx: any) => {
        const x = 0
        const y = 0
        const w = 280
        const h = 480
        const r = 8
        ctx.beginPath()
        ctx.moveTo(x + r, y)
        ctx.arcTo(x + w, y, x + w, y + h, r)
        ctx.arcTo(x + w, y + h, x, y + h, r)
        ctx.arcTo(x, y + h, x, y, r)
        ctx.arcTo(x, y, x + w, y, r)
        ctx.closePath()
      }}
    >
      {constraints?.video ? (
        <Image
          ref={imageRef}
          x={-imageConfig.width / 3}
          image={videoElement}
          width={imageConfig.width}
          height={imageConfig.height}
        />
      ) : (
        <Image
          image={image}
          width={imageConfig.width}
          height={imageConfig.height}
        />
      )}
    </Group>,
  ]

  return (
    <Concourse
      controls={controls}
      layerChildren={layerChildren}
      disableUserMedia={isDisableCamera}
      titleSpalshData={titleSpalshData}
    />
  )
}

export default Slides