import { useState } from 'react'

export const useLazyUserStream = () => {
  const [stream, setStream] = useState<MediaStream>()

  const [constraints, setConstraints] = useState<MediaStreamConstraints>({
    video: true,
    audio: true,
  })
  const stopUserStream = () => {
    if (!stream) return

    stream.getTracks().forEach((track) => {
      track.stop()
    })
  }

  const initiateUserStream = (mediaConstraints?: MediaStreamConstraints) => {
    navigator.mediaDevices
      .getUserMedia(mediaConstraints || constraints)
      .then((stream) => {
        setStream(stream)
      })
      .catch((error) => {
        throw error
      })

    if (mediaConstraints) setConstraints(mediaConstraints)
  }

  const toggleAudio = (to: boolean) => {
    const [track] = stream?.getAudioTracks() || []

    if (!track) return

    track.enabled = to
    setConstraints((constraints) => ({ ...constraints, audio: to }))
  }

  const toggleVideo = (to: boolean) => {
    const [track] = stream?.getVideoTracks() || []

    if (!track) throw Error('No Video Track.')

    track.enabled = to

    setConstraints((constraints) => ({ ...constraints, video: to }))
  }

  return {
    initiateUserStream,
    stream,
    stopUserStream,
    constraints,
    toggleAudio,
    toggleVideo,
  }
}

export const useLazyDisplayStream = () => {
  const [stream, setStream] = useState<MediaStream>()

  const stopDisplayStream = () => {
    if (!stream) return

    stream.getTracks().forEach((track) => {
      track.stop()
    })
  }

  const initiateDisplayStream = () => {
    // Ignoring the below line since it breaks on build. Here's why: https://stackoverflow.com/questions/65123841/getting-property-getdisplaymedia-does-not-exist-on-type-mediadevices-in-an
    navigator.mediaDevices
      // @ts-ignore
      .getDisplayMedia()
      .then((mediaStream: MediaStream) => {
        setStream(mediaStream)
      })
  }

  return { initiateDisplayStream, stream, stopDisplayStream }
}
