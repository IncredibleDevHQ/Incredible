import { createClient, LiveMap, LiveObject } from '@liveblocks/client'
import { createRoomContext } from '@liveblocks/react'
import { getEnv, LiveViewConfig } from 'utils/src'

const client = createClient({
	publicApiKey: getEnv().liveblocks.publicKey,
})

// Presence represents the properties that will exist on every User in the Room
// and that will automatically be kept in sync. Accessible through the
// `user.presence` property. Must be JSON-serializable.
export enum PresencePage {
	Notebook = 'notebook',
	Preview = 'preview',
	Backstage = 'backstage',
	Recording = 'recording',
}
export type Presence = {
	user: {
		id: string
		name: string
		picture: string
	}
	page: PresencePage
	formatId?: string
	cursor: {
		x: number
		y: number
	}
	inHuddle: boolean
}

// Storage represents the shared document that persists in the
// Room, even after all Users leave. Fields under Storage typically are
// LiveList, LiveMap, LiveObject instances, for which updates are
// automatically persisted and synced to all connected clients.
type Storage = {
	viewConfig: LiveMap<string, LiveObject<LiveViewConfig>>
}

// Blank user meta for now
type UserMeta = {}

// TODO: The type of custom events broadcasted and listened for in this
// room. Must be JSON-serializable.
export enum RoomEventTypes {
	ThemeChanged = 'themeChanged',
	BrandingChanged = 'brandingChanged',
	TransitionChanged = 'transitionChanged',
	FlickNameChanged = 'flickNameChanged',
}
type RoomEvent =
	| {
			type: RoomEventTypes.ThemeChanged
			payload: any
	  }
	| {
			type: RoomEventTypes.BrandingChanged
			payload: any
	  }
	| {
			type: RoomEventTypes.TransitionChanged
			payload: any
	  }
	| {
			type: RoomEventTypes.FlickNameChanged
			payload: any
	  }

export const {
	RoomProvider,
	useMyPresence,
	useObject,
	useMap,
	useOthers,
	useUpdateMyPresence,
	useSelf,
	useStorage,
	useRoom,
	useBroadcastEvent,
	useEventListener,
} = createRoomContext<Presence, Storage, UserMeta, RoomEvent>(client)