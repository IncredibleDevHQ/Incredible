/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react'
import { extension } from 'mime-types'
import { saveAs } from 'file-saver'

const types = [
  'video/webm',
  'video/webm,codecs=vp9',
  'video/vp8',
  'video/webm;codecs=vp8',
  'video/webm;codecs=daala',
  'video/webm;codecs=h264',
  'video/mpeg',
]

type ElementType<T extends ReadonlyArray<unknown>> = T extends ReadonlyArray<
  infer ElementType
>
  ? ElementType
  : never

interface CanvasElement extends HTMLCanvasElement {
  captureStream(frameRate?: number): MediaStream
}

const useCanvasRecorder = ({
  options: { videoBitsPerSecond = 2500000 },
}: {
  options: {
    videoBitsPerSecond?: number
  }
}) => {
  const [recordedBlobs, setRecordedBlobs] = useState<Blob[]>([])
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)

  const [type, setType] = useState<ElementType<typeof types>>()

  const handleDataAvailable = (event: BlobEvent): any => {
    if (event.data && event.data.size > 0) {
      setRecordedBlobs((recordedBlobs) => [...recordedBlobs, event.data])
    }
  }

  /**
   * Starts recording...
   */
  const startRecording = (
    canvas: HTMLCanvasElement,
    ...tracks: MediaStreamTrack[]
  ) => {
    if (!canvas) return

    const stream = (canvas as CanvasElement).captureStream(30)

    if (!stream) {
      throw Error('No stream found')
    }

    const type = types.find((type) => MediaRecorder.isTypeSupported(type))
    if (!type) {
      throw Error('No supported type found for MediaRecorder')
    }

    setType(type)

    try {
      tracks.forEach((track) => {
        stream.addTrack(track)
      })

      const mediaRecorder = new MediaRecorder(stream, {
        videoBitsPerSecond,
        mimeType: type,
      })
      mediaRecorder.ondataavailable = handleDataAvailable
      mediaRecorder.start(1000) // collect 100ms of data blobs

      setMediaRecorder(mediaRecorder)
    } catch (e) {
      console.error(e)
    }
  }

  const stopRecording = (fileName?: string) => {
    if (mediaRecorder?.state === 'recording') mediaRecorder?.stop()
    else console.log('Cannot stop canvas recorder', mediaRecorder?.state)
  }

  const download = (fileName?: string) => {
    const blob = getBlob()
    // eslint-disable-next-line no-param-reassign
    fileName = fileName || `${'recording.'}${extension(type as string)}`
    saveAs(blob, fileName)
  }

  const getBlob = () => {
    const superblob = new Blob(recordedBlobs, { type })
    return superblob
  }

  const reset = () => {
    setRecordedBlobs([])
  }

  return { startRecording, stopRecording, download, getBlob, reset }
}

export default useCanvasRecorder
