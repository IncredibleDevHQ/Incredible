import Konva from 'konva'
import React, { createRef, useEffect, useState } from 'react'
import { Group, Rect } from 'react-konva'
import { useRecoilState, useRecoilValue } from 'recoil'
import { Fragment_Status_Enum_Enum } from '../../../generated/graphql'
import { User, userState } from '../../../stores/user.store'
import {
  BlockProperties,
  GradientConfig,
  TopLayerChildren,
} from '../../../utils/configTypes'
import { Block } from '../../Flick/editor/utils/utils'
import { ShortsOutro } from '../effects/fragments/OutroFragment'
import GlassySplash from '../effects/Splashes/GlassySplash'
import ShortsPopSplash from '../effects/Splashes/ShortsPopSplash'
import useEdit, { ClipConfig } from '../hooks/use-edit'
import { canvasStore, StudioProviderProps, studioStore } from '../stores'
import { FragmentLayoutConfig } from '../utils/FragmentLayoutConfig'
import { ThemeUserMediaConfig } from '../utils/ThemeConfig'
import LowerThridProvider from './LowerThirdProvider'
import PreviewUser from './PreviewUser'
import StudioUser from './StudioUser'
import TransitionProvider from './TransitionProvider'
import VideoBackground from './VideoBackground'

export interface StudioUserConfig {
  x: number
  y: number
  width: number
  height: number
  clipTheme?: string
  borderColor?: string
  borderWidth?: number
  studioUserClipConfig?: ClipConfig
}

export interface TitleSplashProps {
  enable: boolean
  title?: string
  titleSplashConfig?: GradientConfig
}

interface ConcourseProps {
  layerChildren: any[]
  viewConfig?: BlockProperties
  stageRef?: React.RefObject<Konva.Stage>
  titleSplashData?: TitleSplashProps
  studioUserConfig?: StudioUserConfig[]
  disableUserMedia?: boolean
  topLayerChildren?: {
    id: string
    state: TopLayerChildren
  }
  isShorts?: boolean
  blockType: Block['type']
}

export const CONFIG = {
  width: 960,
  height: 540,
}

export const SHORTS_CONFIG = {
  width: 396,
  height: 704,
}

const GetTopLayerChildren = ({
  topLayerChildrenState,
  isShorts,
  status,
}: {
  topLayerChildrenState: TopLayerChildren
  isShorts: boolean
  status: Fragment_Status_Enum_Enum
}) => {
  if (status === Fragment_Status_Enum_Enum.Ended) return <></>
  switch (topLayerChildrenState) {
    case 'lowerThird': {
      return <LowerThridProvider theme="glassy" isShorts={isShorts || false} />
    }
    case 'transition left': {
      return (
        <TransitionProvider
          theme="glassy"
          isShorts={isShorts || false}
          direction="left"
        />
      )
    }
    case 'transition right': {
      return (
        <TransitionProvider
          theme="glassy"
          isShorts={isShorts || false}
          direction="right"
        />
      )
    }
    case '':
      return <></>
    default:
      return <></>
  }
}

const Concourse = ({
  layerChildren,
  viewConfig,
  stageRef,
  titleSplashData,
  studioUserConfig,
  disableUserMedia,
  topLayerChildren,
  isShorts,
  blockType,
}: ConcourseProps) => {
  const {
    fragment,
    state,
    stream,
    participants,
    payload,
    users,
    stopRecording,
  } = (useRecoilValue(studioStore) as StudioProviderProps) || {}
  const [canvas, setCanvas] = useRecoilState(canvasStore)
  const [isTitleSplash, setIsTitleSplash] = useState<boolean>(false)
  const [isZooming, setZooming] = useState(false)

  const { sub, picture } = (useRecoilValue(userState) as User) || {}

  const groupRef = createRef<Konva.Group>()
  const { clipRect } = useEdit()

  const [stageConfig, setStageConfig] = useState<{
    width: number
    height: number
  }>({ width: 0, height: 0 })

  useEffect(() => {
    if (!isShorts) setStageConfig(CONFIG)
    else setStageConfig(SHORTS_CONFIG)
  }, [isShorts])

  const defaultStudioUserConfig: StudioUserConfig = {
    x: 780,
    y: 400,
    width: 160,
    height: 120,
  }

  const userStudioImageGap = 170
  const zoomLevel = 2
  Konva.pixelRatio = 2

  useEffect(() => {
    if (!canvas) return
    if (!canvas.zoomed) onMouseLeave()
  }, [canvas?.zoomed])

  // const handleZoom = (e: KonvaEventObject<WheelEvent>) => {
  //   e.evt.preventDefault()
  //   if (!stageRef.current) return
  //   const oldScale = stageRef.current.scaleX()
  //   const pointer = stageRef.current.getPointerPosition()

  //   if (!pointer || !oldScale) return

  //   const mousePointTo = {
  //     x: (pointer.x - stageRef.current.x()) / oldScale,
  //     y: (pointer.y - stageRef.current.y()) / oldScale,
  //   }

  //   const scaleBy = 1.01
  //   let newScale = 1
  //   if (e.evt.deltaY > 0) {
  //     newScale = oldScale / scaleBy > 1 ? oldScale / scaleBy : 1
  //   } else {
  //     newScale = oldScale * scaleBy > 4 ? 4 : oldScale * scaleBy
  //   }

  //   stageRef.current.scale({ x: newScale, y: newScale })

  //   const newPos = {
  //     x: pointer.x - mousePointTo.x * newScale,
  //     y: pointer.y - mousePointTo.y * newScale,
  //   }

  //   stageRef.current.position(newPos)
  // }

  const onLayerClick = () => {
    if (!groupRef.current || !canvas?.zoomed) return
    const tZooming = isZooming
    if (tZooming) {
      groupRef.current.to({
        x: 0,
        y: 0,
        scaleX: 1,
        scaleY: 1,
        duration: 0.5,
      })
    } else {
      const pointer = stageRef?.current?.getPointerPosition()
      if (pointer) {
        groupRef.current.to({
          x: -pointer.x,
          y: -pointer.y,
          scaleX: zoomLevel,
          scaleY: zoomLevel,
          duration: 0.5,
        })
      }
    }
    setZooming(!isZooming)
  }

  // const onMouseMove = () => {
  //   if (!groupRef.current || !canvas?.zoomed) return
  //   const tZooming = isZooming
  //   if (tZooming) {
  //     const pointer = stageRef?.current?.getPointerPosition()
  //     if (pointer)
  //       groupRef.current.to({
  //         x: -pointer.x,
  //         y: -pointer.y,
  //         // scaleX: 1,
  //         // scaleY: 1,
  //         duration: 0.1,
  //       })
  //   }
  // }

  const onMouseLeave = () => {
    if (!groupRef.current) return
    groupRef.current.x(0)
    groupRef.current.y(0)
    groupRef.current.scale({ x: 1, y: 1 })
    setZooming(false)
  }

  const resetCanvas = () => {
    if (!stageRef?.current) return
    stageRef.current.position({ x: 0, y: 0 })
    stageRef.current.scale({ x: 1, y: 1 })
    onMouseLeave()
  }

  const performFinishAction = () => {
    if (state === 'recording') {
      stopRecording()
    }
  }

  useEffect(() => {
    setCanvas({ zoomed: false, resetCanvas })
  }, [])

  useEffect(() => {
    if (titleSplashData?.enable) {
      if (payload?.status === Fragment_Status_Enum_Enum.Live) {
        setIsTitleSplash(true)
      } else {
        setIsTitleSplash(false)
      }
    } else {
      setIsTitleSplash(false)
    }
  }, [titleSplashData, state, payload?.status])

  return (
    <>
      <VideoBackground theme="glassy" stageConfig={stageConfig} />
      {viewConfig?.layout === 'full' &&
      !disableUserMedia &&
      !isTitleSplash &&
      payload?.status !== Fragment_Status_Enum_Enum.CountDown &&
      payload?.status !== Fragment_Status_Enum_Enum.Ended &&
      users ? (
        <>
          <StudioUser
            stream={stream}
            studioUserConfig={
              (studioUserConfig && studioUserConfig[0]) ||
              defaultStudioUserConfig
            }
            studioUserThemeConfig={ThemeUserMediaConfig({
              theme: 'glassy',
              studioUserConfig:
                (studioUserConfig && studioUserConfig[0]) ||
                defaultStudioUserConfig,
            })}
            picture={picture as string}
            type="local"
            uid={sub as string}
          />
          {users.map((user, index) => (
            <StudioUser
              key={user.uid as string}
              uid={user.uid as string}
              type="remote"
              stream={user.mediaStream as MediaStream}
              picture={participants?.[user.uid]?.picture || ''}
              studioUserConfig={
                (studioUserConfig && studioUserConfig[index + 1]) || {
                  x:
                    defaultStudioUserConfig.x -
                    (index + 1) * userStudioImageGap,
                  y: defaultStudioUserConfig.y,
                  width: defaultStudioUserConfig.width,
                  height: defaultStudioUserConfig.height,
                }
              }
              studioUserThemeConfig={ThemeUserMediaConfig({
                theme: 'glassy',
                studioUserConfig: (studioUserConfig &&
                  studioUserConfig[index + 1]) || {
                  x:
                    defaultStudioUserConfig.x -
                    (index + 1) * userStudioImageGap,
                  y: defaultStudioUserConfig.y,
                  width: defaultStudioUserConfig.width,
                  height: defaultStudioUserConfig.height,
                },
              })}
            />
          ))}
        </>
      ) : (
        viewConfig?.layout === 'full' &&
        !disableUserMedia &&
        !isTitleSplash &&
        payload?.status !== Fragment_Status_Enum_Enum.CountDown &&
        payload?.status !== Fragment_Status_Enum_Enum.Ended &&
        fragment &&
        [...(fragment.configuration?.speakers || fragment.participants)]?.map(
          (_: any, index: number) => {
            return (
              <PreviewUser
                studioUserConfig={
                  (studioUserConfig && studioUserConfig[index]) || {
                    x:
                      defaultStudioUserConfig.x -
                      (index + 1) * userStudioImageGap,
                    y: defaultStudioUserConfig.y,
                    width: defaultStudioUserConfig.width,
                    height: defaultStudioUserConfig.height,
                  }
                }
                studioUserThemeConfig={ThemeUserMediaConfig({
                  theme: 'glassy',
                  studioUserConfig: (studioUserConfig &&
                    studioUserConfig[index]) || {
                    x:
                      defaultStudioUserConfig.x -
                      (index + 1) * userStudioImageGap,
                    y: defaultStudioUserConfig.y,
                    width: defaultStudioUserConfig.width,
                    height: defaultStudioUserConfig.height,
                  },
                })}
              />
            )
          }
        )
      )}
      <Group>
        {(() => {
          if (payload?.status === Fragment_Status_Enum_Enum.CountDown) {
            return (
              <Rect
                x={0}
                y={0}
                width={stageConfig.width}
                height={stageConfig.height}
                fill="#000000"
                cornerRadius={8}
              />
            )
          }
          if (payload?.status === Fragment_Status_Enum_Enum.Live) {
            // layerRef?.current?.destroyChildren()
            if (titleSplashData?.enable && isTitleSplash) {
              return !isShorts ? (
                <>
                  <GlassySplash
                    isShorts={isShorts || false}
                    setIsTitleSplash={setIsTitleSplash}
                    stageConfig={stageConfig}
                  />
                </>
              ) : (
                <>
                  <ShortsPopSplash
                    setIsTitleSplash={setIsTitleSplash}
                    stageConfig={stageConfig}
                    renderMode="static"
                  />
                </>
              )
            }
          }
          if (payload?.status === Fragment_Status_Enum_Enum.Ended) {
            if (fragment?.configuration?.mode === 'Portrait') {
              return <ShortsOutro performFinishAction={performFinishAction} />
            }
            performFinishAction()
          }
          return (
            <Group
              clipFunc={
                blockType === 'introBlock' || blockType === 'outroBlock'
                  ? undefined
                  : (ctx: any) => {
                      clipRect(
                        ctx,
                        FragmentLayoutConfig({
                          layout: viewConfig?.layout || 'classic',
                          isShorts: isShorts || false,
                        })
                      )
                    }
              }
            >
              <Group
                ref={groupRef}
                onClick={onLayerClick}
                onMouseLeave={onMouseLeave}
                // onMouseMove={onMouseMove}
              >
                {layerChildren}
              </Group>
            </Group>
          )
        })()}
      </Group>
      {viewConfig?.layout !== 'full' &&
      !disableUserMedia &&
      !isTitleSplash &&
      payload?.status !== Fragment_Status_Enum_Enum.CountDown &&
      payload?.status !== Fragment_Status_Enum_Enum.Ended &&
      users ? (
        <>
          <StudioUser
            stream={stream}
            studioUserConfig={
              (studioUserConfig && studioUserConfig[0]) ||
              defaultStudioUserConfig
            }
            studioUserThemeConfig={ThemeUserMediaConfig({
              theme: 'glassy',
              studioUserConfig:
                (studioUserConfig && studioUserConfig[0]) ||
                defaultStudioUserConfig,
            })}
            picture={picture as string}
            type="local"
            uid={sub as string}
          />
          {users.map((user, index) => (
            <StudioUser
              key={user.uid as string}
              uid={user.uid as string}
              type="remote"
              stream={user.mediaStream as MediaStream}
              picture={participants?.[user.uid]?.picture || ''}
              studioUserConfig={
                (studioUserConfig && studioUserConfig[index + 1]) || {
                  x:
                    defaultStudioUserConfig.x -
                    (index + 1) * userStudioImageGap,
                  y: defaultStudioUserConfig.y,
                  width: defaultStudioUserConfig.width,
                  height: defaultStudioUserConfig.height,
                }
              }
              studioUserThemeConfig={ThemeUserMediaConfig({
                theme: 'glassy',
                studioUserConfig: (studioUserConfig &&
                  studioUserConfig[index + 1]) || {
                  x:
                    defaultStudioUserConfig.x -
                    (index + 1) * userStudioImageGap,
                  y: defaultStudioUserConfig.y,
                  width: defaultStudioUserConfig.width,
                  height: defaultStudioUserConfig.height,
                },
              })}
            />
          ))}
        </>
      ) : (
        viewConfig?.layout !== 'full' &&
        !disableUserMedia &&
        !isTitleSplash &&
        payload?.status !== Fragment_Status_Enum_Enum.CountDown &&
        payload?.status !== Fragment_Status_Enum_Enum.Ended &&
        fragment &&
        [...(fragment.configuration?.speakers || fragment.participants)]?.map(
          (_: any, index: number) => {
            return (
              <PreviewUser
                studioUserConfig={
                  (studioUserConfig && studioUserConfig[index]) || {
                    x:
                      defaultStudioUserConfig.x -
                      (index + 1) * userStudioImageGap,
                    y: defaultStudioUserConfig.y,
                    width: defaultStudioUserConfig.width,
                    height: defaultStudioUserConfig.height,
                  }
                }
                studioUserThemeConfig={ThemeUserMediaConfig({
                  theme: 'glassy',
                  studioUserConfig: (studioUserConfig &&
                    studioUserConfig[index]) || {
                    x:
                      defaultStudioUserConfig.x -
                      (index + 1) * userStudioImageGap,
                    y: defaultStudioUserConfig.y,
                    width: defaultStudioUserConfig.width,
                    height: defaultStudioUserConfig.height,
                  },
                })}
              />
            )
          }
        )
      )}
      <Group>
        <GetTopLayerChildren
          key={topLayerChildren?.id}
          topLayerChildrenState={topLayerChildren?.state || ''}
          isShorts={isShorts || false}
          status={payload?.status}
        />
      </Group>
    </>
  )
}

export default Concourse
