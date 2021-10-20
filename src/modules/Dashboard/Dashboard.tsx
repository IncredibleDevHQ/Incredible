import React, { useState } from 'react'
import { cx } from '@emotion/css'
import { IconType } from 'react-icons'
import { IoAlbumsOutline } from 'react-icons/io5'
import { useRecoilValue } from 'recoil'
import {
  Button,
  Loading,
  Navbar,
  ScreenState,
  Tab,
  TabBar,
  Text,
} from '../../components'
import { Drafts, NewFlickBanner, Published } from './components/index'
import DashboardSeriesFlicks from '../DashboardSeries/DashboardSeriesFlicks'
import { CreateSeriesModal } from '../DashboardSeries/components'
import { User, userState } from '../../stores/user.store'
import {
  useGetUserFlicksQuery,
  useGetUserSeriesQuery,
} from '../../generated/graphql'
import { Icons } from '../../constants'
import { useHistory } from 'react-router-dom'
import { AiOutlinePlus } from 'react-icons/ai'

const ViewBarButton = ({
  icon: I,
  active,
  onClick,
}: {
  icon: IconType
  active?: boolean
  onClick: () => void
}) => {
  return (
    <div
      className={cx('p-1.5 rounded-md transition-colors cursor-pointer', {
        'bg-brand text-white': active,
        'text-brand': !active,
      })}
      onClick={onClick}
      onKeyDown={onClick}
      role="button"
      tabIndex={0}
    >
      <I />
    </div>
  )
}

const Dashboard = () => {
  const { sub } = (useRecoilValue(userState) as User) || {}
  const { data: userSeriesData } = useGetUserSeriesQuery({
    variables: {
      limit: 60,
    },
  })
  const history = useHistory()

  const {
    data: userFlicksData,
    refetch: userFlicksRefetch,
    loading: userFlicksLoading,
  } = useGetUserFlicksQuery({
    variables: { sub: sub as string },
  })

  const tabs: Tab[] = [
    {
      name: 'Drafts',
      value: 'Drafts',
    },
    {
      name: 'Published',
      value: 'Published',
    },
  ]

  const [currentTab, setCurrentTab] = useState<Tab>(tabs[0])
  const [isOpenNewSeriesCreateModal, setIsOpenNewSeriesCreateModal] =
    useState(false)

  if (userFlicksLoading) return <ScreenState title="Just a jiffy" loading />

  if (
    userSeriesData &&
    userSeriesData?.Series.length < 1 &&
    userFlicksData &&
    userFlicksData?.Flick.length < 1
  )
    return (
      <div>
        <Navbar />
        <div className="flex flex-col justify-center items-center ml-19">
          <img src={Icons.EmptyState} alt="I" className="mt-20 w-60 h-60" />
          <Text className="text-black mt-5 font-semibold text-2xl pt-0">
            Start by creating a flick or series.
          </Text>
          <Text className="text-black font-light text-sm pt-0 mt-2">
            Choose flick if you want to just hop on to the studio
          </Text>
          <Text className="text-black font-light text-sm pt-0">
            and create one flick. Choose series if you want to
          </Text>
          <Text className="text-black font-light text-sm pt-0">
            create a series of flicks
          </Text>
        </div>
        <div className="flex flex-row gap-3 justify-center">
          <NewFlickBanner />
          <div>
            <Button
              type="button"
              appearance="primary"
              size="extraSmall"
              className="my-5 py-2 p-2 mx-2 flex justify-end text-white rounded-md"
              icon={IoAlbumsOutline}
              onClick={() => setIsOpenNewSeriesCreateModal(true)}
            >
              Create series
            </Button>
          </div>
        </div>
        <CreateSeriesModal
          open={isOpenNewSeriesCreateModal}
          handleClose={() => {
            setIsOpenNewSeriesCreateModal(false)
          }}
        />
      </div>
    )

  return (
    <div>
      <Navbar />
      <Text className="text-black mx-28 mt-5 font-bold text-2xl pt-0">
        {" Let's create a flick"}
      </Text>
      <Text className="text-black mx-28 font-light text-sm pt-0 mt-2">
        {' Choose flick if you want to just hop on to the studio '}
      </Text>
      <Text className="text-black mx-28 font-light text-sm pt-0">
        {' and create one flick. Choose series if you want to '}
      </Text>
      <Text className="text-black mx-28 font-light text-sm pt-0">
        {' create a series of flicks '}
      </Text>
      <div className="flex flex-row gap-3 mt-4 mx-28">
        <Button
          type="button"
          size="small"
          appearance="primary"
          className="py-2"
          onClick={() => history.push(`/new-flick`)}
          icon={AiOutlinePlus}
        >
          Create flick
        </Button>
        <Button
          type="button"
          appearance="secondary"
          size="small"
          className="py-2"
          icon={IoAlbumsOutline}
          onClick={() => setIsOpenNewSeriesCreateModal(true)}
        >
          Create series
        </Button>
      </div>
      <DashboardSeriesFlicks data={userSeriesData} />
      {userFlicksData && userFlicksData?.Flick.length > 0 && (
        <div className="px-0">
          <div className="flex flex-row m-0 p-0 ml-28 items-center">
            <Text className="font-black text-xl">Your flicks</Text>
            <TabBar
              tabs={tabs}
              current={currentTab}
              onTabChange={setCurrentTab}
              className="text-black gap-2 w-auto ml-10"
            />
          </div>
          <div className="mb-10">
            {currentTab.value === 'Drafts' && (
              <Drafts
                flicks={userFlicksData?.Flick}
                handleRefetch={(refresh) => {
                  if (refresh) userFlicksRefetch()
                }}
              />
            )}
            {currentTab.value === 'Published' && (
              <Published
                flicks={userFlicksData?.Flick}
                handleRefetch={(refresh) => {
                  if (refresh) userFlicksRefetch()
                }}
              />
            )}
          </div>
        </div>
      )}
      <CreateSeriesModal
        open={isOpenNewSeriesCreateModal}
        handleClose={() => {
          setIsOpenNewSeriesCreateModal(false)
        }}
      />
    </div>
  )
}

ViewBarButton.defaultProps = {
  active: undefined,
}

export default Dashboard
