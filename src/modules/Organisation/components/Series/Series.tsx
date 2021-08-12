/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { User } from '@sentry/react'
import React, { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { Button, Loading } from '../../../../components'
import {
  OrganisationFragment,
  SeriesFragment,
  useGetSeriesLazyQuery,
} from '../../../../generated/graphql'
import { userState } from '../../../../stores/user.store'
import CreateSeriesModal from './CreateSeriesModal'

const Series = ({
  organisationSlug,
  selectedOrganisation,
}: {
  organisationSlug: string
  selectedOrganisation: OrganisationFragment
}) => {
  const { uid } = (useRecoilValue(userState) as User) || {}
  const [series, setSeries] = useState<SeriesFragment[]>()
  const [seriesModal, setSeriesModal] = useState<boolean>(false)
  const [seriesCreated, setSeriesCreated] = useState<boolean>(false)

  const [GetSeries, { data, error: errorSeries, loading: loadingSeries }] =
    useGetSeriesLazyQuery()

  useEffect(() => {
    GetSeries({
      variables: {
        organisationSlug,
      },
    })

    setSeries(data?.Series)
  }, [data, seriesCreated])

  if (loadingSeries) {
    return <Loading>Loading...</Loading>
  }

  if (errorSeries) {
    return <div className="text-xl">Error Loading Series</div>
  }

  return (
    <div>
      {uid ===
        selectedOrganisation.members.find((member) => member.role === 'Owner')
          ?.user.sub && (
        <div className="w-1/3 flex m-1 mt-0 gap-2">
          <Button
            appearance="primary"
            type="button"
            size="small"
            onClick={() => setSeriesModal(true)}
          >
            Create Series
          </Button>
        </div>
      )}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 grid-cols-1">
        {series?.map((series: SeriesFragment) => (
          <div
            key={series.id}
            className="flex cursor-pointer hover:bg-blue-200 items-center justify-between bg-blue-100 p-3 rounded-md m-1"
          >
            <div className="flex gap-5">
              <img
                className="rounded-md max-h-20"
                src={series.picture!}
                alt={series.name!}
              />
              <div className="flex flex-col justify-around">
                <span>{series.name}</span>
                <span>{series.description}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <CreateSeriesModal
        seriesModal={seriesModal}
        setSeriesModal={setSeriesModal}
        organisationSlug={organisationSlug}
        seriesCreated={seriesCreated}
        setSeriesCreated={setSeriesCreated}
      />
    </div>
  )
}

export default Series
