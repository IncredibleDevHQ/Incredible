/* eslint-disable react-hooks/exhaustive-deps */
import { css, cx } from '@emotion/css'
import { useEffect, useRef, useState } from 'react'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import { useUser } from 'src/utils/providers/auth'
import { Button, Heading, Text } from 'ui/src'
import {
	DashboardFlicksFragment,
	useGetDashboardUserFlicksLazyQuery,
} from 'utils/src/graphql/generated'
import Filter, { CollectionFilter } from './Filter'
import FlickTile from './FlickTile'
import Header from './Header'

const customScroll = css`
	::-webkit-scrollbar {
		width: 18px;
	}
	::-webkit-scrollbar-track {
		background-color: transparent;
	}
	::-webkit-scrollbar-thumb {
		background-color: #383b40;
		border-radius: 20px;
		border: 6px solid transparent;
		background-clip: content-box;
	}
	::-webkit-scrollbar-thumb:hover {
		background-color: #a8bbbf;
	}
`

const FlickTab = () => {
	const { user } = useUser()
	const verticalHeaderRef = useRef<HTMLDivElement>(null)

	const [fetchFlickData, { data, error, loading, fetchMore, refetch }] =
		useGetDashboardUserFlicksLazyQuery()

	const [offset, setOffset] = useState(0)
	const [allData, setAllData] = useState<DashboardFlicksFragment[]>()

	const [collectionFilter, setCollectionFilter] = useState<CollectionFilter>(
		CollectionFilter.all
	)

	useEffect(() => {
		fetchFlickData({
			variables: {
				sub: user?.uid || '',
			},
		})
	}, [user?.uid])

	useEffect(() => {
		if (data?.Flick) {
			setAllData(data.Flick)
		}
	}, [data])

	const removeFlick = (id: string) => {
		setAllData(allData?.filter(flick => flick.id !== id))
		refetch({
			limit: offset === 0 ? 25 : offset,
			sub: user?.uid || '',
		})
	}

	const copyFlick = (id: string, newId: string) => {
		if (!allData) return
		const newFlick = allData.find(flick => flick.id === id)
		if (!newFlick) return
		setAllData([
			{ ...newFlick, id: newId, name: `${newFlick.name} (Copy)` },
			...allData,
		])
	}

	return (
		<div
			className={cx(
				'flex flex-col items-center overflow-y-scroll flex-1 pr-5 h-full text-white ',
				customScroll
			)}
			onScroll={e => {
				if (
					e.currentTarget.scrollHeight - e.currentTarget.scrollTop >
						e.currentTarget.clientHeight - 2 &&
					e.currentTarget.scrollHeight - e.currentTarget.scrollTop <
						e.currentTarget.clientHeight + 2
				) {
					if (loading) return
					fetchMore({
						variables: {
							offset: offset + 25,
						},
						updateQuery: (prev, { fetchMoreResult }) => {
							if (!fetchMoreResult) return prev
							return {
								...prev,
								Flick: [...prev.Flick, ...fetchMoreResult.Flick],
							}
						},
					})
					setOffset(offset + 25)
				}
			}}
		>
			{allData && allData.length === 0 && (
				<div
					className='flex-1 flex flex-col items-center justify-center gap-y-12 -ml-32'
					ref={verticalHeaderRef}
				>
					<Heading textStyle='title'>Start by creating a story</Heading>
					<Header vertical />
				</div>
			)}

			{((loading && user) ||
				error ||
				(data && allData && allData.length > 0)) && (
				<div className='flex flex-col flex-1 py-8 container'>
					{!verticalHeaderRef.current && (
						<>
							<Header />
							<div className='my-8'>
								<Filter
									collectionFilter={collectionFilter}
									setCollectionFilter={setCollectionFilter}
								/>
							</div>
						</>
					)}

					{loading && !data && (
						<SkeletonTheme color='#202020' highlightColor='#444'>
							<div className='flex-1 grid grid-cols-4 gap-10'>
								{[...Array(10).keys()].map(() => (
									<Skeleton height={210} />
								))}
							</div>
						</SkeletonTheme>
					)}
					{error && (
						<div className='flex flex-col flex-1 justify-center items-center gap-y-3'>
							<Text className='text-lg'>
								Something went wrong. Please try again.
							</Text>
							<Button onClick={() => refetch()}>Retry</Button>
						</div>
					)}

					<div className='grid grid-cols-4 gap-10'>
						{allData
							?.filter(flick => {
								if (collectionFilter === CollectionFilter.all) return true
								if (collectionFilter === CollectionFilter.owner)
									return flick.owner?.userSub === user?.uid
								if (collectionFilter === CollectionFilter.collaborator)
									return flick.owner?.userSub !== user?.uid
								return true
							})
							.map(flick => (
								<FlickTile
									key={flick.id}
									// eslint-disable-next-line react/jsx-props-no-spreading
									{...flick}
									handleDelete={id => {
										removeFlick(id)
									}}
									handleCopy={(id, newId) => {
										copyFlick(id, newId)
									}}
								/>
							))}
					</div>
				</div>
			)}
		</div>
	)
}

export default FlickTab