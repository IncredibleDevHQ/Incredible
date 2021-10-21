import { cx } from '@emotion/css'
import { formatDistance } from 'date-fns'
import Skeleton from 'react-loading-skeleton'
import { nanoid } from 'nanoid'
import qs from 'qs'
import React, { useEffect, useState } from 'react'
import { BiCheck } from 'react-icons/bi'
import config from '../../config'
import { Navbar, Text } from '../../components'
import {
  IntegrationEnum,
  useDeleteIntegrationMutation,
  useMyIntegrationsQuery,
} from '../../generated/graphql'

function popupWindow(
  url: string,
  title: string,
  window: Window,
  width = 800,
  height = 600
) {
  if (!window.top) return
  const y = window.top.outerHeight / 2 + window.top.screenY - height / 2
  const x = window.top.outerWidth / 2 + window.top.screenX - width / 2
  window.open(
    url,
    title,
    `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${width}, height=${height}, top=${y}, left=${x}`
  )
}

const INTEGRATIONS = [
  {
    title: 'GitHub',
    logo: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
  },
]

export interface IIntegrations {
  github?: GitHubResponse
}

export interface GitHubResponse {
  exists?: boolean
  integrationId?: string
  updatedAt?: Date
  id?: number
  avatarUrl?: string
  login?: string
}

interface IntegrationCardProps {
  title?: string
  logo?: string
  updatedAt?: Date
  exists?: boolean
  username?: string
  handleClick?: () => void
  handleDelete?: () => void
}

const IntegrationCard = ({
  title,
  logo,
  updatedAt,
  exists,
  username,
  handleClick,
  handleDelete,
}: IntegrationCardProps) => {
  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
      onClick={handleClick}
      className={cx(
        'shadow-md p-4 drop-shadow-md hover:shadow-xl transition-shadow rounded-md',
        { 'cursor-pointer': !exists }
      )}
    >
      <div className="flex items-center justify-between">
        <img src={logo} className="h-8" alt={title} />
        {exists && (
          <button
            type="button"
            className="text-red-600 font-bold uppercase tracking-wide text-sm"
            onClick={handleDelete}
          >
            Disconnect
          </button>
        )}
      </div>
      <Text className="mt-2 text-xl font-bold">{title}</Text>
      {exists && (
        <div className="flex items-center justify-between">
          <div className="flex items-center flex-shrink-0">
            <BiCheck className="mr-1 text-brand" />
            <Text className="text-sm">{username}</Text>
          </div>
          {updatedAt && (
            <Text className="text-xs">
              <span className="text-gray-700">
                {formatDistance(new Date(updatedAt), new Date(), {
                  addSuffix: true,
                })}
              </span>
            </Text>
          )}
        </div>
      )}
    </div>
  )
}

const Integrations = () => {
  const { data, loading, refetch } = useMyIntegrationsQuery()
  const [deleteIntegration] = useDeleteIntegrationMutation()
  const [integrations, setIntegrations] = useState<IntegrationCardProps[]>()

  useEffect(() => {
    if (!data) return

    // eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle
    const _data = data.MyIntegrations?.integrations as IIntegrations

    const integrations: IntegrationCardProps[] = INTEGRATIONS.map(
      (integration) => {
        switch (integration.title) {
          case 'GitHub':
            return {
              ...integration,
              ..._data.github,
              username: _data.github?.login,
              handleClick: () => {
                if (!_data.github?.exists) {
                  const state = nanoid()

                  popupWindow(
                    // eslint-disable-next-line prefer-template
                    'https://github.com/login/oauth/authorize?' +
                      qs.stringify({
                        client_id: config.integrations.github.clientId,
                        scope: config.integrations.github.scope,
                        state,
                      }),
                    'GitHub x Incredible',
                    window
                  )

                  localStorage.setItem('github-oauth-state', state)
                }
              },
              handleDelete: async () => {
                await deleteIntegration({
                  variables: {
                    id: _data.github?.integrationId,
                    integration: IntegrationEnum.GitHub,
                  },
                })
                refetch()
              },
            } as IntegrationCardProps

          default:
            return undefined
        }
      }
    ).filter(
      (integration) => integration !== undefined
    ) as IntegrationCardProps[]

    setIntegrations(integrations)
  }, [data])

  useEffect(() => {
    const cb = (source: any) => {
      if (source.data.type === 'github') {
        refetch()
      }
    }

    window.addEventListener('message', cb)

    return () => {
      window.removeEventListener('message', cb)
    }
  }, [])

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="my-4 mx-6">
        <Text className="font-semibold text-2xl mb-8">Integrations</Text>
        <div className="grid grid-cols-1 md:gap-8 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {!loading ? (
            integrations?.map((integration) => (
              <IntegrationCard {...integration} key={integration.title} />
            ))
          ) : (
            <>
              <Skeleton height={100} />
              <Skeleton height={100} />
              <Skeleton height={100} />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Integrations