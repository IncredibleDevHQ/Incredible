import React, { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import Konva from 'konva'
import { Image } from 'react-konva'
import { FiPlay, FiPause } from 'react-icons/fi'
import { Concourse } from '../components'
import { ControlButton } from '../components/MissionControl'
import { CONFIG } from '../components/Concourse'
import { StudioProviderProps, studioStore } from '../stores'

// @ts-ignore
const Video = ({ videoElement }: { videoElement: HTMLVideoElement }) => {
  const imageRef = React.useRef(null)
  const [size, setSize] = React.useState({ width: 50, height: 50 })

  // when video is loaded, we should read it size
  React.useEffect(() => {
    const onload = () => {
      setSize({
        width: CONFIG.width,
        height: (CONFIG.width * 9) / 16,
      })
    }
    videoElement.addEventListener('loadedmetadata', onload)
    return () => {
      videoElement.removeEventListener('loadedmetadata', onload)
    }
  }, [videoElement])

  // use Konva.Animation to redraw a layer
  useEffect(() => {
    // @ts-ignore
    const layer = imageRef.current?.getLayer()

    const anim = new Konva.Animation(() => {}, layer)
    anim.start()

    return () => {
      anim.stop()
    }
  }, [videoElement])

  return (
    <Image
      ref={imageRef}
      image={videoElement}
      width={size.width}
      height={size.height}
    />
  )
}

const VideoJam = () => {
  const { state, fragment } =
    (useRecoilValue(studioStore) as StudioProviderProps) || {}
  const videoElement = React.useMemo(() => {
    if (!fragment?.configuration) return
    const element = document.createElement('video')
    element.autoplay = false
    element.crossOrigin = 'anonymous'
    element.src = JSON.parse(fragment?.configuration || {}).videoURL
    // eslint-disable-next-line consistent-return
    return element
  }, [fragment?.configuration])

  useEffect(() => {
    if (!videoElement) return
    switch (state) {
      case 'preview':
        videoElement.pause()
        break
      case 'ready':
        videoElement.currentTime = 0
        break
      default:
        videoElement.currentTime = 0
    }
  }, [state])

  const [playing, setPlaying] = useState(false)

  const controls = [
    <ControlButton
      key="control"
      icon={playing ? FiPause : FiPlay}
      className="my-2"
      appearance={playing ? 'danger' : 'primary'}
      onClick={() => {
        const next = !playing
        setPlaying(next)
        if (next) {
          videoElement?.play()
        } else {
          videoElement?.pause()
        }
      }}
    />,
  ]

  return videoElement ? (
    <Concourse
      layerChildren={[<Video videoElement={videoElement} />]}
      controls={controls}
    />
  ) : null
}

export default VideoJam
