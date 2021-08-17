import { atom } from 'recoil'
import { StudioFragmentFragment } from '../../../generated/graphql'
import { RTCUser } from '../hooks/use-agora'

export type StudioState = 'ready' | 'recording' | 'preview' | 'upload'
export interface StudioProviderProps<T = {}, S = {}> {
  stream: MediaStream
  getBlobs: () => Blob

  reset: () => void
  upload: () => void

  startRecording: () => void
  stopRecording: () => void

  togglePresenterNotes?: (to: boolean) => void

  fragment?: StudioFragmentFragment

  picture?: string

  constraints?: MediaStreamConstraints
  state: StudioState

  users: RTCUser[]

  payload?: S
  participants: T[] | null
  updatePayload?: (value: S) => void
  updateParticipant?: (value: T) => void

  participantId?: string
}

const studioStore = atom<StudioProviderProps>({
  key: 'studio',
  default: {} as StudioProviderProps,
  dangerouslyAllowMutability: true,
})

export default studioStore
