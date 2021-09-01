import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import {
  FragmentActivity,
  FragmentConfiguration,
  FragmentParticipants,
  FragmentsSidebar,
  Participants,
} from './components'
import { currentFlickStore } from '../../stores/flick.store'
import { EmptyState, Heading, ScreenState, Tab, TabBar } from '../../components'
import { useGetFlickByIdQuery } from '../../generated/graphql'

const tabs: Tab[] = [
  {
    name: 'Activity',
    value: 'Activity',
  },
  {
    name: 'Configuration',
    value: 'Configuration',
  },
  {
    name: 'Participants',
    value: 'Participants',
  },
]

const Flick = () => {
  const { id, fragmentId } = useParams<{ id: string; fragmentId?: string }>()
  const { data, error, loading, refetch } = useGetFlickByIdQuery({
    variables: { id },
  })
  const [flick, setFlick] = useRecoilState(currentFlickStore)
  const [currentTab, setCurrentTab] = useState<Tab>(tabs[0])
  const [isParticipants, setParticipants] = useState(true)

  const [activeFragmentId, setActiveFragmentId] = useState<string>()

  useEffect(() => {
    if (!data?.Flick_by_pk) return
    setFlick(data.Flick_by_pk)
    if (fragmentId) {
      setActiveFragmentId(fragmentId)
    } else {
      setActiveFragmentId(
        data.Flick_by_pk.fragments.length > 0
          ? data.Flick_by_pk.fragments[0].id
          : undefined
      )
    }
  }, [data])

  if (loading) return <ScreenState title="Just a jiffy" loading />

  if (error)
    return (
      <ScreenState title="Something went wrong!!" subtitle={error.message} />
    )

  if (!flick)
    return (
      <ScreenState
        title="Something went wrong!!"
        subtitle="We couldn't find the details of this flick"
      />
    )

  return (
    <section className="flex flex-row relative">
      <FragmentsSidebar
        flickId={flick.id}
        fragments={flick.fragments}
        activeFragmentId={activeFragmentId}
        setActiveFragmentId={setActiveFragmentId}
        handleRefetch={(refresh) => {
          if (refresh) refetch()
        }}
        participants={flick.participants}
      />
      <div className="flex-1 p-4">
        <Heading className=" flex font-black text-2xl capitalize justify-center mb-2">
          {flick.name}
        </Heading>
        {activeFragmentId ? (
          <div>
            <TabBar
              tabs={tabs}
              current={currentTab}
              onTabChange={setCurrentTab}
            />
            {currentTab.value === 'Configuration' && (
              <FragmentConfiguration
                fragment={flick.fragments.find(
                  (fragment) => fragment.id === activeFragmentId
                )}
                handleRefetch={(refresh) => {
                  if (refresh) refetch()
                }}
              />
            )}
            {currentTab.value === 'Activity' && (
              <FragmentActivity
                fragment={flick.fragments.find(
                  (fragment) => fragment.id === activeFragmentId
                )}
              />
            )}
            {currentTab.value === 'Participants' && (
              <FragmentParticipants
                participants={flick.participants}
                fragmentId={
                  flick.fragments.find(
                    (fragment) => fragment.id === activeFragmentId
                  )?.id
                }
                fragmentType={
                  flick.fragments.find(
                    (fragment) => fragment.id === activeFragmentId
                  )?.type
                }
              />
            )}
          </div>
        ) : (
          <>
            <EmptyState text="No Fragment is selected" width={400} />
          </>
        )}
      </div>
      <Participants
        isParticipants={isParticipants}
        setParticipants={setParticipants}
        participants={flick.participants}
        flickId={flick.id}
        handleRefetch={(refresh) => {
          if (refresh) refetch()
        }}
      />
    </section>
  )
}

export default Flick
