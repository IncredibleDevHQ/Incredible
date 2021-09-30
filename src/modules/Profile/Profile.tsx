import React, { useState } from 'react'
import { useRecoilValue } from 'recoil'
import { Auth, authState } from '../../stores/auth.store'
import { User, userState } from '../../stores/user.store'
import { Navbar, Text } from '../../components'
import {
  ProfileDetails,
  UserFlicks,
  EditProfileModal,
} from './components/index'
import { UserSeries } from '../Series'

const Profile = () => {
  const { signOut } = (useRecoilValue(authState) as Auth) || {}
  const userData = (useRecoilValue(userState) as User) || {}
  const [editProfileModal, setEditProfileModal] = useState<boolean>(false)

  return (
    <div className="  flex flex-col  relative min-h-screen">
      <Navbar />
      <div className="  flex flex-row w-full justify-end">
        <button
          className="mr-5 p-2 flex justify-end text-white bg-blue-300 rounded-md"
          type="button"
          onClick={async () => {
            setEditProfileModal(true)
          }}
        >
          Edit Profile
        </button>
        <button
          className="p-2 mr-2 flex justify-end text-white bg-blue-300 rounded-md"
          type="button"
          onClick={async () => {
            await signOut?.()
          }}
        >
          Sign Out
        </button>
      </div>

      <div className="grid-cols-1 divide-y divide-blue-400 divide-opacity-25 ">
        <EditProfileModal
          userData={userData}
          open={editProfileModal}
          handleClose={() => {
            setEditProfileModal(false)
          }}
        />
        <ProfileDetails userData={userData} />
        <UserSeries userData={userData} />
        <UserFlicks />
      </div>
    </div>
  )
}

export default Profile