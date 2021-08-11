import React, { useState } from 'react'
import { useRecoilValue } from 'recoil'
import { Auth, authState } from '../../stores/auth.store'
import { User, userState } from '../../stores/user.store'
import { Text } from '../../components'
import {
  ProfileDetails,
  UserSeries,
  UserFlicks,
  EditProfileModal,
} from './components/index'

const Profile = () => {
  const { signOut } = (useRecoilValue(authState) as Auth) || {}
  const userData = (useRecoilValue(userState) as User) || {}
  const [editProfileModal, setEditProfileModal] = useState<boolean>(false)

  return (
    <div className="  flex flex-col  relative min-h-screen">
      <div className="  flex flex-row w-full justify-end">
        <button
          className="mr-5 mt-5 p-2 flex justify-end text-white bg-blue-300 rounded-md"
          type="button"
          onClick={async () => {
            setEditProfileModal(true)
          }}
        >
          Edit Profile
        </button>
        <button
          className="mt-5 p-2 mr-2 flex justify-end text-white bg-blue-300 rounded-md"
          type="button"
          onClick={async () => {
            await signOut?.()
          }}
        >
          Sign Out
        </button>
      </div>
      <div className="m-1 p-1 rounded-lg border-blue-400 border-2 w-auto">
        <Text className="m-1 p-1  text-3xl text-black rounded-lg w-auto">
          Profile
        </Text>
      </div>
      <div className="grid-cols-1 divide-y divide-blue-400 divide-opacity-25 ">
        <EditProfileModal
          userData={userData}
          open={editProfileModal}
          handleClose={() => {
            setEditProfileModal(false)
          }}
        />
        <ProfileDetails userdata={userData} />
        <UserSeries userdata={userData} />
        <UserFlicks />
      </div>
    </div>
  )
}

export default Profile
