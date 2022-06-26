import Konva from 'konva'
import { nanoid } from 'nanoid'
import React, { useEffect, useRef, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import {
  Fragment_Status_Enum_Enum,
  ThemeFragment,
} from '../../../../generated/graphql'
import {
  BlockProperties,
  IntroBlockView,
  OutroBlockView,
  TopLayerChildren,
  ViewConfig,
} from '../../../../utils/configTypes'
import { BrandingJSON } from '../../../Branding/BrandingPage'
import {
  Block,
  CodeBlockProps,
  HeadingBlockProps,
  ImageBlockProps,
  ListBlockProps,
  VideoBlockProps,
} from '../../../Flick/editor/utils/utils'
import { CONFIG, SHORTS_CONFIG } from '../../components/Concourse'
import { FragmentState } from '../../components/RenderTokens'
import VideoBackground from '../../components/VideoBackground'
import { StudioProviderProps, studioStore } from '../../stores'
import CodeFragment from './CodeFragment'
import HeadingFragment from './HeadingFragment'
import ImageFragment from './ImageFragment'
import IntroFragment from './IntroFragment'
import OutroFragment from './OutroFragment'
import PointsFragment from './PointsFragment'
import VideoFragment from './VideoFragment'

const UnifiedFragment = ({
  stageRef,
  setTopLayerChildren,
  config,
  layoutConfig,
  branding,
  theme,
}: {
  stageRef: React.RefObject<Konva.Stage>
  setTopLayerChildren?: React.Dispatch<
    React.SetStateAction<{
      id: string
      state: TopLayerChildren
    }>
  >
  config?: Block[]
  layoutConfig?: ViewConfig
  branding?: BrandingJSON
  theme?: ThemeFragment | null
}) => {
  const {
    fragment,
    payload,
    updatePayload,
    state,
    theme: flickTheme,
  } = (useRecoilValue(studioStore) as StudioProviderProps) || {}

  const [studio, setStudio] = useRecoilState(studioStore)

  // data config holds all the info abt the object
  const [dataConfig, setDataConfig] = useState<Block[]>()
  // view config holds all the info abt the view of the canvas
  const [viewConfig, setViewConfig] = useState<ViewConfig>()
  // holds the index of the present object
  const [activeObjectIndex, setActiveObjectIndex] = useState(-1)

  // state of the fragment
  const [fragmentState, setFragmentState] =
    useState<FragmentState>('customLayout')

  const [isPreview, setIsPreview] = useState(false)

  const timer = useRef<any>(null)

  // const dipToBlackRef = useRef<Konva.Rect>(null)

  useEffect(() => {
    clearTimeout(timer.current)
    return () => {
      clearTimeout(timer.current)
    }
  }, [])

  useEffect(() => {
    if (!config) return
    setDataConfig(config)
    if (!layoutConfig) return
    setViewConfig(layoutConfig)
  }, [config, layoutConfig])

  useEffect(() => {
    if (!config) return
    if (branding !== studio.branding) {
      setStudio((prev) => ({
        ...prev,
        branding,
      }))
    }
  }, [branding, studio])

  useEffect(() => {
    if (!config) return
    if (!theme) return
    if (theme.name !== studio.theme.name) {
      setStudio((prev) => ({
        ...prev,
        theme,
      }))
    }
  }, [theme, studio.theme])

  useEffect(() => {
    if (!config) {
      if (!fragment) return
      setIsPreview(false)
      if (fragment.configuration && fragment.editorState) {
        if (fragment.configuration.continuousRecording) {
          const localData = fragment.editorState?.blocks.filter(
            (item: any) =>
              !!fragment.configuration.selectedBlocks.find(
                (blk: any) => blk.blockId === item.id
              )
          )
          setDataConfig(localData)
        } else {
          setDataConfig(
            fragment.editorState?.blocks.filter(
              (b: any) => b.type !== 'interactionBlock'
            )
          )
        }
        setViewConfig(fragment.configuration)
      }
    } else {
      setIsPreview(true)
      setDataConfig(config)
      setViewConfig(layoutConfig)
      if (!theme) return
      setStudio({
        ...studio,
        branding,
        theme,
      })
    }
  }, [fragment])

  useEffect(() => {
    if (
      payload?.activeObjectIndex === undefined ||
      payload?.activeObjectIndex === -1 ||
      !viewConfig
    )
      return
    // having a condition on state because on retake initially the active object index will be 3
    // and it goes to the else case, and at the same time upload payload triggers
    // and makes the active object index 0 which goes inside the if block,
    // as the else block contains set timeout it executes after the if block, so active object index becomes 3
    // so put the condition on state to be recording so that on recording it deosnt take time to make the active object index 0,
    // so that the old active object index's object doesnt get rendered on the canvas initially
    // if (state === 'start-recording' && payload?.activeObjectIndex === 0) {
    //   setActiveObjectIndex(payload?.activeObjectIndex)
    // } else if (viewConfig?.mode !== 'Portrait') {
    //   setTimeout(() => {
    //     setActiveObjectIndex(payload?.activeObjectIndex)
    //   }, 400)
    // } else if (
    //   payload?.activeObjectIndex === 1 ||
    //   payload?.activeObjectIndex === (dataConfig?.length || 2) - 1
    // ) {
    //   dipToBlackRef.current?.to({
    //     opacity: 1,
    //     duration: 0.2,
    //     onFinish: () => {
    //       dipToBlackRef.current?.to({
    //         opacity: 0,
    //         duration: 0.2,
    //       })
    //     },
    //   })
    //   if (payload?.activeObjectIndex === (dataConfig?.length || 2) - 1) {
    //     addMusic({ volume: 0.05, action: 'modifyVolume' })
    //   }
    //   setTimeout(() => {
    //     setActiveObjectIndex(payload?.activeObjectIndex)
    //   }, 200)
    // } else {
    //   setActiveObjectIndex(payload?.activeObjectIndex)
    // }
    if (
      fragment?.configuration?.continuousRecording
      // (state === 'start-recording' || state === 'recording')
    ) {
      setTopLayerChildren?.({
        id: nanoid(),
        state: 'transition continuousRight',
      })
      setTimeout(() => {
        setActiveObjectIndex(payload?.activeObjectIndex)
      }, 400)
    } else setActiveObjectIndex(payload?.activeObjectIndex)
  }, [payload?.activeObjectIndex, viewConfig])

  useEffect(() => {
    // if (!payload?.activeObjectIndex || payload?.activeObjectIndex === 0) return
    if (payload?.activeObjectIndex === undefined) return
    // if (viewConfig?.mode !== 'Portrait' && viewConfig?.continuousRecording)
    //   setTopLayerChildren?.({ id: nanoid(), state: 'transition right' })
    updatePayload?.({
      currentIndex: 0,
      prevIndex: -1,
      isFocus: false,
      focusBlockCode: false,
      activeBlockIndex: 0,
      activePointIndex: 0,
      // activeIntroIndex: 0,
      activeOutroIndex: 0,
    })
  }, [payload?.activeObjectIndex])

  // useEffect(() => {
  //   return () => {
  //     updatePayload?.({
  //       activeObjectIndex: 0,
  //       activeIntroIndex: 0,
  //       fragmentState: 'customLayout',
  //       currentIndex: 0,
  //       prevIndex: 0,
  //       isFocus: false,
  //       focusBlockCode: false,
  //       activeBlockIndex: 0,
  //       activePointIndex: 0,
  //       currentTime: 0,
  //       playing: false,
  //       // status: Fragment_Status_Enum_Enum.NotStarted,
  //     })
  //   }
  // }, [])

  useEffect(() => {
    if (state === 'ready') {
      updatePayload?.({
        // activeObjectIndex: 0,
        activeIntroIndex: 0,
        activeOutroIndex: 0,
        fragmentState: 'customLayout',
        currentIndex: 0,
        prevIndex: -1,
        isFocus: false,
        focusBlockCode: false,
        activeBlockIndex: 0,
        activePointIndex: 0,
        currentTime: 0,
        playing: false,
        status: Fragment_Status_Enum_Enum.NotStarted,
        actionTriggered: '',
      })
    }
    if (state === 'start-recording') {
      updatePayload?.({
        activeObjectIndex: 0,
        activeIntroIndex: 0,
        activeOutroIndex: 0,
        fragmentState: 'customLayout',
        currentIndex: 0,
        prevIndex: -1,
        isFocus: false,
        focusBlockCode: false,
        activeBlockIndex: 0,
        activePointIndex: 0,
        currentTime: 0,
        playing: false,
        actionTriggered: '',
      })
      // setTopLayerChildren?.({ id: '', state: '' })
    }
    if (state === 'recording') {
      // setTopLayerChildren?.({ id: '', state: '' })
      updatePayload?.({
        activeOutroIndex: 0,
        actionTriggered: '',
      })
    }
  }, [state])

  useEffect(() => {
    if (!payload?.activeObjectIndex || payload?.activeObjectIndex === 0) return
    if (payload?.fragmentState === fragmentState) return
    if (viewConfig?.mode !== 'Portrait') {
      // Checking if the current state is only fragment group and making the opacity of the only fragment group 1
      if (payload?.fragmentState === 'customLayout') {
        setTopLayerChildren?.({
          id: nanoid(),
          state:
            fragmentState === 'onlyUserMedia'
              ? 'transition right'
              : 'transition left',
        })
      }
      // Checking if the current state is only usermedia group and making the opacity of the only fragment group 0
      if (payload?.fragmentState === 'onlyUserMedia') {
        setTopLayerChildren?.({ id: nanoid(), state: 'transition left' })
      }
      if (payload?.fragmentState === 'onlyFragment') {
        setTopLayerChildren?.({ id: nanoid(), state: 'transition right' })
      }
    } else {
      setTopLayerChildren?.({ id: nanoid(), state: '' })
    }
  }, [payload?.fragmentState])

  const [stageConfig, setStageConfig] = useState<{
    width: number
    height: number
  }>({ width: 0, height: 0 })

  useEffect(() => {
    if (!viewConfig?.mode) return
    if (viewConfig?.mode === 'Landscape') setStageConfig(CONFIG)
    else setStageConfig(SHORTS_CONFIG)
  }, [viewConfig?.mode])

  if (!dataConfig || !viewConfig || dataConfig.length === 0) return <></>
  return (
    <>
      <VideoBackground
        theme={flickTheme}
        stageConfig={stageConfig}
        isShorts={viewConfig.mode === 'Portrait'}
      />
      {(() => {
        switch (dataConfig?.[activeObjectIndex]?.type) {
          case 'codeBlock': {
            return (
              <CodeFragment
                key={activeObjectIndex}
                dataConfig={dataConfig[activeObjectIndex] as CodeBlockProps}
                viewConfig={
                  viewConfig.blocks[
                    dataConfig[activeObjectIndex].id
                  ] as BlockProperties
                }
                fragmentState={fragmentState}
                setFragmentState={setFragmentState}
                stageRef={stageRef}
                shortsMode={viewConfig.mode === 'Portrait'}
                isPreview={isPreview}
              />
            )
          }
          case 'videoBlock': {
            return (
              <VideoFragment
                key={activeObjectIndex}
                dataConfig={dataConfig[activeObjectIndex] as VideoBlockProps}
                viewConfig={
                  viewConfig.blocks[
                    dataConfig[activeObjectIndex].id
                  ] as BlockProperties
                }
                fragmentState={fragmentState}
                setFragmentState={setFragmentState}
                stageRef={stageRef}
                shortsMode={viewConfig.mode === 'Portrait'}
                isPreview={isPreview}
              />
            )
          }
          case 'imageBlock': {
            return (
              <ImageFragment
                key={activeObjectIndex}
                dataConfig={dataConfig[activeObjectIndex] as ImageBlockProps}
                viewConfig={
                  viewConfig.blocks[
                    dataConfig[activeObjectIndex].id
                  ] as BlockProperties
                }
                fragmentState={fragmentState}
                setFragmentState={setFragmentState}
                stageRef={stageRef}
                shortsMode={viewConfig.mode === 'Portrait'}
                isPreview={isPreview}
              />
            )
          }
          case 'listBlock': {
            return (
              <PointsFragment
                key={activeObjectIndex}
                dataConfig={dataConfig[activeObjectIndex] as ListBlockProps}
                viewConfig={
                  viewConfig.blocks[
                    dataConfig[activeObjectIndex].id
                  ] as BlockProperties
                }
                fragmentState={fragmentState}
                setFragmentState={setFragmentState}
                stageRef={stageRef}
                shortsMode={viewConfig.mode === 'Portrait'}
                isPreview={isPreview}
              />
            )
          }
          case 'headingBlock': {
            return (
              <HeadingFragment
                key={activeObjectIndex}
                dataConfig={dataConfig[activeObjectIndex] as HeadingBlockProps}
                viewConfig={
                  viewConfig.blocks[
                    dataConfig[activeObjectIndex].id
                  ] as BlockProperties
                }
                fragmentState={fragmentState}
                setFragmentState={setFragmentState}
                stageRef={stageRef}
                shortsMode={viewConfig.mode === 'Portrait'}
                isPreview={isPreview}
              />
            )
          }
          case 'introBlock': {
            const introBlockViewProps = (
              viewConfig.blocks[
                dataConfig[activeObjectIndex].id
              ] as BlockProperties
            )?.view as IntroBlockView
            return (
              <IntroFragment
                shortsMode={viewConfig.mode === 'Portrait'}
                viewConfig={
                  viewConfig.blocks[
                    dataConfig[activeObjectIndex].id
                  ] as BlockProperties
                }
                isPreview={isPreview}
                setTopLayerChildren={setTopLayerChildren}
                introSequence={
                  introBlockViewProps?.intro?.order
                    ?.filter((o) => o.enabled)
                    .map((o) => o.state) || ['userMedia', 'titleSplash']
                }
              />
            )
          }
          case 'outroBlock': {
            const outroBlockViewProps = (
              viewConfig.blocks[
                dataConfig[activeObjectIndex].id
              ] as BlockProperties
            )?.view as OutroBlockView
            return (
              <OutroFragment
                isShorts={viewConfig.mode === 'Portrait'}
                viewConfig={
                  viewConfig.blocks[
                    dataConfig[activeObjectIndex].id
                  ] as BlockProperties
                }
                isPreview={isPreview}
                outroSequence={
                  outroBlockViewProps?.outro?.order
                    ?.filter((o) => o.enabled)
                    .map((o) => o.state) || ['titleSplash']
                }
              />
            )
          }
          default:
            return <></>
        }
      })()}
      {/* <Rect
        x={0}
        y={0}
        width={stageConfig.width}
        height={stageConfig.height}
        fill="#000000"
        opacity={0}
        ref={dipToBlackRef}
      /> */}
    </>
  )
}

export default UnifiedFragment
