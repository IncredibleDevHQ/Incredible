// Copyright 2022 Pixelbyte Studio Pvt Ltd
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import admin from 'firebase-admin'
import { NextApiRequest, NextApiResponse } from 'next'
import serverEnvs from 'server/utils/env'
import setCookie from 'src/utils/helpers/setCookie'

const login = async (req: NextApiRequest, res: NextApiResponse) => {
	res.setHeader(
		'Access-Control-Allow-Headers',
		'Access-Control-Allow-Origin,Content-Type,Access-Control-Allow-Credentials'
	)

	const requestMethod = req.method || 'GET'

	// Allow preflight to detect available http methods, and avoid CORS
	if (['OPTIONS'].includes(requestMethod)) {
		res.setHeader('Access-Control-Allow-Methods', 'POST')
		res.setHeader('Access-Control-Allow-Credentials', 'true')
		return res.status(200).send('success')
	}

	if (['POST', 'post'].includes(requestMethod)) {
		try {
			if (!admin.apps.length) {
				admin.initializeApp({
					credential: admin.credential.cert(
						JSON.parse(serverEnvs.FIREBASE_SERVICE_CONFIG as string)
					),
				})
			}

			// verify idToken
			const { idToken } = req.body
			const decodedIdToken = await admin.auth().verifyIdToken(idToken, true)

			// session expiry
			const expiresIn = 12 * 60 * 60 * 24 * 1000 // 12 days

			// if decoded set cookie
			if (decodedIdToken) {
				admin.app()

				const sessionCookie = await admin.auth().createSessionCookie(idToken, {
					expiresIn,
				})

				// Set cookie policy for session cookie.
				// The cookie should have httpOnly=true, secure=true and sameSite=strict set
				setCookie(res, '__session', sessionCookie, {
					maxAge: expiresIn,
					httpOnly: true,
					secure: true,
					path: '/',
					domain: serverEnvs.COOKIE_DOMAIN as string,
					sameSite: 'none',
				})

				res.setHeader('Access-Control-Allow-Credentials', 'true')
				return res.end(JSON.stringify({ sessionCookie }))
			}
			return res.status(500).send({})
		} catch (e) {
			const error = e as Error
			return res.status(501).json({ success: false, message: error.message })
		}
	} else {
		return res.status(501).end()
	}
}

export default login
