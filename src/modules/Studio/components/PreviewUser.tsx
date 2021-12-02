/* eslint-disable consistent-return */
import React, { useEffect, useState } from 'react'
import { Group, Rect, Image } from 'react-konva'
import useImage from 'use-image'
import useEdit, { ClipConfig } from '../hooks/use-edit'
import { StudioUserConfig } from './Concourse'
import configs from '../../../config'

const PreviewUser = ({
  studioUserConfig,
}: {
  studioUserConfig: StudioUserConfig
}) => {
  const {
    x,
    y,
    width,
    height,
    clipTheme,
    borderColor,
    borderWidth,
    studioUserClipConfig,
    backgroundRectColor,
    backgroundRectX,
    backgroundRectY,
    backgroundRectBorderWidth,
    backgroundRectBorderColor,
  } = studioUserConfig
  const imageConfig = { width: width || 160, height: height || 120 }

  const { clipCircle, clipRect, getImageDimensions } = useEdit()
  const defaultStudioUserClipConfig: ClipConfig = {
    x: 0,
    y: 0,
    width: 160,
    height: 120,
    radius: 8,
  }

  const [image] = useImage(
    `${configs.storage.baseUrl}StudioUser.png`,
    'anonymous'
  )

  const [imgDim, setImgDim] = useState<{
    width: number
    height: number
    x: number
    y: number
  }>({ width: 0, height: 0, x: 0, y: 0 })

  const getClipFunc = ({
    clipTheme,
    ctx,
    clipConfig,
  }: {
    clipTheme?: string
    ctx: any
    clipConfig: ClipConfig
  }) => {
    if (clipTheme === 'circle') return clipCircle(ctx, clipConfig)
    return clipRect(ctx, clipConfig)
  }

  useEffect(() => {
    let maxWidth = studioUserClipConfig?.width
      ? studioUserClipConfig.width / 1.5
      : 0
    let maxHeight = studioUserClipConfig?.height
      ? studioUserClipConfig.height / 1.5
      : 0
    if (maxWidth >= 320) {
      maxWidth /= 1.5
      maxHeight /= 1.5
    }
    setImgDim(
      getImageDimensions(
        {
          w: (image && image.width) || 0,
          h: (image && image.height) || 0,
        },
        maxWidth,
        maxHeight,
        studioUserClipConfig?.width || 0,
        studioUserClipConfig?.height || 0,
        (studioUserClipConfig && studioUserClipConfig.x + x) || 775,
        (studioUserClipConfig && studioUserClipConfig.y + y + 3) || y
      )
    )
  }, [image, studioUserConfig])

  return (
    <>
      <Rect
        x={backgroundRectX || 775}
        y={backgroundRectY || y}
        width={studioUserClipConfig?.width || defaultStudioUserClipConfig.width}
        height={
          studioUserClipConfig?.height || defaultStudioUserClipConfig.height
        }
        fill={backgroundRectColor}
        stroke={backgroundRectBorderColor}
        strokeWidth={backgroundRectBorderWidth || 0}
        cornerRadius={studioUserClipConfig?.radius || 0}
      />
      <Rect
        x={(studioUserClipConfig && studioUserClipConfig.x + x) || 775}
        y={(studioUserClipConfig && studioUserClipConfig.y + y) || y}
        width={studioUserClipConfig?.width || 0}
        height={studioUserClipConfig?.height || 0}
        stroke="#000000"
        strokeWidth={0}
        cornerRadius={studioUserClipConfig?.radius || 0}
      />

      <Group
        x={x}
        y={y}
        clipFunc={(ctx: any) => {
          getClipFunc({
            clipTheme,
            ctx,
            clipConfig: studioUserClipConfig || defaultStudioUserClipConfig,
          })
        }}
      >
        <Rect
          width={imageConfig.width}
          height={imageConfig.height}
          fill="#374151"
        />
      </Group>
      <Image
        image={image}
        y={imgDim.y}
        x={imgDim.x}
        width={imgDim.width}
        height={imgDim.height}
      />
    </>
  )
}

export default PreviewUser