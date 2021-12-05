// eslint-disable-next-line
import * as Sentry from '@sentry/react'
import axios from 'axios'
import { onAuthStateChanged, signInWithCustomToken } from 'firebase/auth'
import { useEffect } from 'react'
import { useRecoilState, useSetRecoilState } from 'recoil'
import config from '../config'
import { useGetUserLazyQuery } from '../generated/graphql'
import firebaseState from '../stores/firebase.store'
import {
  databaseUserState,
  firebaseUserState,
  userVerificationStatus,
} from '../stores/user.store'

const AuthProvider = ({ children }: { children: JSX.Element }): JSX.Element => {
  const [auth, setAuth] = useRecoilState(firebaseState)
  const setFbUser = useSetRecoilState(firebaseUserState)
  const [dbUser, setDbUser] = useRecoilState(databaseUserState)
  const setVerificationStatus = useSetRecoilState(userVerificationStatus)

  const [getUserQuery, { data: me }] = useGetUserLazyQuery()

  const login = async () => {
    try {
      setAuth({ ...auth, loading: true })
      const statusResponse = await axios.get(
        `${config.auth.endpoint}/api/status`,
        {
          withCredentials: true,
        }
      )
      const signedInUser = await signInWithCustomToken(
        auth.auth,
        statusResponse.data as string
      )
      setFbUser(signedInUser.user)
      if (!dbUser) {
        const res = await getUserQuery()
        if (res.error) throw res.error
        if (!res.data?.Me) throw new Error('Response returned null')
        setDbUser(res.data.Me)
        setVerificationStatus(res.data.Me.verificationStatus || null)
      }

      // repeat call to /login endpoint to update auth token in session cookie
      const idToken = await signedInUser.user.getIdToken()

      await axios.post(
        `${config.auth.endpoint}/api/login`,
        {
          idToken,
        },
        {
          headers: {
            'Content-Type': 'application/json', // 'text/plain',
            'Access-Control-Allow-Origin': `${config.client.studioUrl}`,
          },
          withCredentials: true,
        }
      )
    } catch (e) {
      setAuth({ ...auth, loading: false })
    } finally {
      setAuth({ ...auth, loading: false })
    }
  }

  useEffect(() => {
    onAuthStateChanged(auth.auth, async (user) => {
      if (user) {
        const token = await user.getIdToken(true)
        setAuth({
          ...auth,
          token,
        })
      } else {
        setAuth((auth) => ({
          ...auth,
          token: null,
        }))
      }
    })
  }, [])

  useEffect(() => {
    login()
  }, [])

  return children
}

export default AuthProvider
