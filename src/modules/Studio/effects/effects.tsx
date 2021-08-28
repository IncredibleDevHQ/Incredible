import { Rect, Text } from 'react-konva'
import React, { useEffect } from 'react'
import { Fragment_Type_Enum_Enum } from '../../../generated/graphql'
import CodeJam from './CodeJam'
import VideoJam from './VideoJam'
import Intro from './Splash'
import Trivia from './Trivia'
import { CONFIG } from '../components/Concourse'

export interface Effect {
  controls: JSX.Element[]
  layerChildren: any[]
}

export const titleSplash = (title: string): JSX.Element => {
  useEffect(() => {
    var font = new FontFaceObserver('Gilroy')

    font.load()
  }, [])

  const titleSplashChildern: JSX.Element = (
    <>
      <Rect fill="#5156EA" width={CONFIG.width} height={CONFIG.height} />
      <Rect fill="#7f82ef" y={513 / 2 - 40} width={CONFIG.width} height={80} />
      <Text
        x={0}
        y={513 / 2 - 30}
        width={912}
        height={80}
        text={title}
        fill="#ffffff"
        textTransform="capitalize"
        fontStyle="bold"
        fontFamily="Gilroy"
        fontSize={60}
        align="center"
      />
    </>
  )
  return titleSplashChildern
}
export const getEffect = (type: Fragment_Type_Enum_Enum) => {
  switch (type) {
    case Fragment_Type_Enum_Enum.Splash:
      return Intro
    case Fragment_Type_Enum_Enum.CodeJam:
      return CodeJam
    case Fragment_Type_Enum_Enum.Videoshow:
      return VideoJam
    case Fragment_Type_Enum_Enum.Trivia:
      return Trivia
    default:
      throw Error('No effect found')
  }
}
