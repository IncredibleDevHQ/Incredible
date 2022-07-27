/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/require-default-props */
/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { css, cx } from '@emotion/css'
import { Fragment, useCallback, useEffect, useState } from 'react'
import Dropzone from 'react-dropzone'
import { BsRecordCircleFill } from 'react-icons/bs'
import {
	FiCheck,
	FiMicOff,
	FiMonitor,
	FiUploadCloud,
	FiVideoOff,
	FiX,
} from 'react-icons/fi'
import { IoChevronBack } from 'react-icons/io5'
import { Dialog, Transition } from '@headlessui/react'
import { emitToast, Heading, Loader, Text } from 'ui/src'
import useScreenRecorder from 'use-screen-recorder'
import {
	AllowedFileExtensions,
	getSeekableWebM,
	useTimekeeper,
	useUploadFile,
} from 'utils/src'
import { UploadType } from 'utils/src/enums'
import VideoEditor, { Transformations } from './VideoEditor'
import recordScreen from '../../assets/record-screen.jpeg'

const formatTime = (timer: number) => {
	const getSeconds = `0${timer % 60}`.slice(-2)
	const minutes = `${Math.floor(timer / 60)}`
	const getMinutes = `0${+minutes % 60}`.slice(-2)

	return `${getMinutes}:${getSeconds}`
}

const AddVideo = ({
	open,
	handleClose,
	initialValue,
	handleUpdateVideo,
	shouldResetWhenOpened = false,
	recordScreenMode = false,
}: {
	open: boolean
	shouldResetWhenOpened?: boolean
	initialValue?: {
		url: string
		transformations?: Transformations
	}
	handleClose: (shouldRefetch?: boolean) => void
	handleUpdateVideo?: (url: string, transformations?: Transformations) => void
	recordScreenMode?: boolean
}) => {
	const [currentView, setCurrentView] = useState<
		'select' | 'record-or-upload' | 'preview' | 'upload-s3' | 'transform'
	>('select')
	const [video, setVideo] = useState<Blob | File>()
	const [videoType, setVideoType] = useState<'blob' | 'file'>()
	const [progress, setProgress] = useState(0)
	const [videoURL, setVideoURL] = useState<string>('')

	const { startRecording, stopRecording, status, resetRecording, blob, error } =
		useScreenRecorder({
			audio: true,
		})

	const [uploadVideo] = useUploadFile()

	const { timer, handleStart, handleReset } = useTimekeeper(0)

	useEffect(() => {
		if (recordScreenMode) {
			setCurrentView('record-or-upload')
			setVideoType('blob')
			setProgress(0)
			setVideoURL('')
		}
	}, [recordScreenMode])

	useEffect(() => {
		if (shouldResetWhenOpened) {
			setCurrentView('select')
			setVideo(undefined)
			setVideoType(undefined)
			setProgress(0)
			setVideoURL('')
		}
	}, [shouldResetWhenOpened])

	useEffect(() => {
		if (!initialValue || shouldResetWhenOpened) return
		setVideoURL(initialValue.url)
		setCurrentView('transform')
	}, [initialValue, shouldResetWhenOpened])

	useEffect(() => {
		if (status === 'recording') {
			handleStart()
		}
		if (status === 'stopped') {
			handleReset()
		}
	}, [status])

	useEffect(() => {
		;(async () => {
			if (status !== 'stopped' || !blob) return
			try {
				const arrayBuff = await blob.arrayBuffer()
				if (!arrayBuff) setVideo(blob)
				else setVideo(getSeekableWebM(arrayBuff))
				// setVideo(blob)
			} catch (e: any) {
				emitToast(`Something went wrong ${e?.message}`, {
					type: 'error',
				})
			}
		})()
	}, [status, blob])

	useEffect(() => {
		if (!video) return
		setCurrentView('preview')
	}, [video])

	const handleDrop = useCallback(async ([file]: File[]) => {
		setVideo(file)
	}, [])

	const handleUpload = async () => {
		if (!video || !videoType) return
		try {
			let extension: AllowedFileExtensions

			if (videoType === 'file') {
				extension = (video as File)?.name
					.split('.')
					.pop() as AllowedFileExtensions
			} else {
				extension = 'webm'
			}

			if (!extension) throw Error('Failed to get extension')

			// ['alpha.incredible.dev', 'story', '<FLICK_ID>', '<FRAGMENT_ID>']
			const href = window.location.href.replace('https://', '').split('/')
			const fragmentId = href.pop()
			const flickId = href.pop()

			const { url } = await uploadVideo({
				// @ts-ignore
				extension,
				file: video,
				tag: UploadType.Asset,
				meta: {
					flickId,
					fragmentId,
				},
				handleProgress: ({ percentage }) => {
					setProgress(percentage)
				},
			})

			if (url) {
				setVideoURL(url)
				setCurrentView('transform')
			}
		} catch (e: any) {
			setCurrentView('select')
			emitToast(`Something went wrong ${e?.message}`, {
				type: 'error',
			})
		}
	}

	return (
		<Transition appear show={open} as={Fragment}>
			<Dialog
				onClose={() => {
					if (status === 'recording') stopRecording()
					handleReset()
					handleClose()
				}}
				className='relative z-50'
			>
				<Transition.Child
					as={Fragment}
					enter='ease-out duration-300'
					enterFrom='opacity-0'
					enterTo='opacity-100'
					leave='ease-in duration-200'
					leaveFrom='opacity-100'
					leaveTo='opacity-0'
				>
					<div className='fixed inset-0 bg-black/60' aria-hidden='true' />
				</Transition.Child>
				<div className='fixed inset-0 flex items-center justify-center p-4'>
					{/* The actual dialog panel  */}
					<Transition.Child
						as={Fragment}
						enter='ease-out duration-300'
						enterFrom='opacity-0 scale-95'
						enterTo='opacity-100 scale-100'
						leave='ease-in duration-200'
						leaveFrom='opacity-100 scale-100'
						leaveTo='opacity-0 scale-95'
					>
						<Dialog.Panel className='mx-auto max-h-[85vh] h-full w-4/5 rounded-md bg-gray-800 text-gray-100 inline-flex flex-col justify-between items-stretch p-0 m-0 relative'>
							{(() => {
								switch (currentView) {
									case 'select':
										return (
											<div className='my-auto pb-12 text-center'>
												<Heading textStyle='mediumTitle' className='mb-16'>
													Select a file{' '}
													<span
														className='mx-1 border-b-2 border-dotted cursor-pointer text-brand-75 hover:text-brand border-brand-75 hover:border-brand'
														onClick={() => {
															setVideoType('file')
															setCurrentView('record-or-upload')
														}}
													>
														locally
													</span>{' '}
													or{' '}
													<span
														className='mx-1 border-b-2 border-dotted cursor-pointer text-brand-75 hover:text-brand border-brand-75 hover:border-brand'
														onClick={() => {
															setVideoType('blob')
															setCurrentView('record-or-upload')
														}}
													>
														record
													</span>{' '}
													screen
												</Heading>
												<div className='flex items-center justify-center'>
													<div
														className='flex flex-col items-center justify-center w-40 h-32 p-2 mx-4 text-gray-400 border-2 border-gray-400 rounded-md cursor-pointer hover:border-gray-50 hover:text-gray-50'
														onClick={() => {
															setVideoType('file')
															setCurrentView('record-or-upload')
														}}
													>
														<FiUploadCloud size={32} />
														<Text className='mt-4' textStyle='bodySmall'>
															Upload a local Video
														</Text>
													</div>
													<div
														className='flex flex-col items-center justify-center w-40 h-32 p-2 mx-4 text-gray-400 border-2 border-gray-400 rounded-md cursor-pointer hover:border-gray-50 hover:text-gray-50'
														onClick={() => {
															setVideoType('blob')
															setCurrentView('record-or-upload')
														}}
													>
														<FiMonitor size={32} />
														<Text className='mt-4' textStyle='bodySmall'>
															Record a screen
														</Text>
													</div>
												</div>
											</div>
										)
									case 'record-or-upload':
										return videoType === 'file' ? (
											<>
												<Dropzone
													onDrop={handleDrop}
													accept={{
														'video/*': [],
													}}
													maxFiles={1}
												>
													{({ getRootProps, getInputProps }) => (
														<div
															className='flex flex-col items-center justify-center px-2 py-8 my-auto border border-gray-200 border-dashed rounded-md cursor-pointer h-1/3 w-1/2 mx-auto'
															{...getRootProps()}
														>
															<input {...getInputProps()} />
															<FiUploadCloud size={32} className='my-2' />
															<div className='text-center'>
																<Text>Drag and drop or</Text>
																<Text className='font-semibold'>browse</Text>
															</div>
														</div>
													)}
												</Dropzone>
												<div
													className='absolute flex items-center justify-start cursor-pointer top-4 left-4'
													onClick={() => setCurrentView('select')}
												>
													<IoChevronBack />
													<Text>Back</Text>
												</div>
											</>
										) : (
											<>
												<div className='relative flex flex-col items-center justify-center w-full h-full text-gray-100 rounded-md'>
													<img
														src={recordScreen.src}
														alt='unsplash-img'
														className='w-1/3 h-auto rounded-md'
													/>
													<Heading textStyle='mediumTitle' className='my-1'>
														Screen Only
													</Heading>
													<div className='flex flex-col items-center justify-center text-gray-400 my-4'>
														<div className='flex items-center justify-center my-2'>
															<FiMicOff size={20} className='mx-2' />
															<FiVideoOff size={20} className='mx-2' />
														</div>
														<Text
															textStyle='bodySmall'
															className='text-center w-2/3'
														>
															The screengrab doesn’t record camera or mic. You
															can talk over the screengrab during video
															recording.{' '}
														</Text>
													</div>
													<Text className='my-1'>
														{(() => {
															switch (status) {
																case 'permission-requested':
																	return 'Please allow to access your screen. Press the record button below to continue.'
																case 'idle':
																	return 'Press the record button below to start.'
																case 'recording':
																	return 'Recording...'
																case 'error':
																	return `Error. ${error?.message}.`
																case 'stopped':
																	return 'Recording stopped.'
																default:
																	return 'initializing recorder...'
															}
														})()}
													</Text>
													<div
														className='absolute flex items-center justify-start cursor-pointer top-4 left-4'
														onClick={() => setCurrentView('select')}
													>
														<IoChevronBack />
														<Text>Back</Text>
													</div>
												</div>
												<div className='flex items-center justify-center w-full p-4 bg-gray-600 text-gray-50'>
													<button
														type='button'
														onClick={() => {
															if (status === 'recording') {
																stopRecording()
															} else {
																startRecording()
															}
														}}
													>
														<div className='bg-gray-700 p-1.5 rounded-sm flex justify-start items-center'>
															<BsRecordCircleFill
																size={24}
																fill='#fff'
																className={cx('rounded-full', {
																	'bg-gray-300': status !== 'recording',
																	'bg-red-600': status === 'recording',
																})}
															/>
															{status === 'permission-requested' && (
																<p className='ml-2 text-gray-300'>Record</p>
															)}
															{timer && timer > 0 ? (
																<p className='ml-2 text-gray-300'>
																	{formatTime(timer)}
																</p>
															) : null}
														</div>
													</button>
												</div>
											</>
										)
									case 'preview':
										if (!video || !videoType) {
											setCurrentView('record-or-upload')
											return null
										}
										return videoType === 'file' ? (
											<>
												<video
													controls
													src={URL.createObjectURL(video as File)}
													className='my-auto w-full h-3/4 rounded-md'
												/>
												<div className='flex items-center justify-center w-full p-4 bg-gray-600 text-gray-50 absolute z-10 bottom-0 left-0'>
													<button
														type='button'
														className='flex px-1.5 py-1 text-sm rounded-sm items-center bg-gray-700 mx-1'
														onClick={() => {
															handleUpload()
															setCurrentView('upload-s3')
														}}
													>
														<FiCheck size={20} className='mr-1' />
														Looks Good
													</button>
													<button
														type='button'
														className='flex px-1.5 py-1 text-sm rounded-sm items-center bg-gray-700 mx-1'
														onClick={() => {
															setCurrentView('record-or-upload')
															setVideo(undefined)
														}}
													>
														<FiX size={20} className='mr-1' />
														Reset
													</button>
												</div>
											</>
										) : (
											<>
												<video
													src={URL.createObjectURL(video as Blob)}
													className='my-auto w-full h-3/4 rounded-md'
													controls
												/>
												<div className='flex items-center justify-center w-full p-4 bg-gray-600 text-gray-50 absolute z-10 bottom-0 left-0'>
													<button
														type='button'
														className='flex px-1.5 py-1 text-sm rounded-sm items-center bg-gray-700 mx-1'
														onClick={() => {
															setCurrentView('upload-s3')
															handleUpload()
														}}
													>
														<FiCheck size={20} className='mr-1' />
														Looks Good
													</button>
													<button
														type='button'
														className='flex px-1.5 py-1 text-sm rounded-sm items-center bg-gray-700 mx-1'
														onClick={() => {
															setCurrentView('record-or-upload')
															setVideo(undefined)
															resetRecording()
														}}
													>
														<FiX size={20} className='mr-1' />
														Reset
													</button>
												</div>
											</>
										)
									case 'upload-s3':
										return (
											<div className='flex flex-col items-center justify-center w-full h-full py-40 text-gray-50'>
												<Loader
													className={cx(
														'w-14 h-14 my-4',
														css`
															filter: grayscale(1);
														`
													)}
												/>
												<div className='relative w-1/2 h-2 my-2 overflow-hidden bg-gray-700 rounded-md'>
													<div
														className={cx(
															'bg-gray-50 absolute top-0 left-0 bottom-0',
															css`
																width: ${progress}%;
															`
														)}
													/>
												</div>
												<p className='my-2 text-base text-center'>
													Hold there! We are getting your video ready for
													configuration. <br /> This might take some time.
												</p>
											</div>
										)
									case 'transform':
										if (!videoURL) {
											setCurrentView('record-or-upload')
											return null
										}

										return (
											<div className='flex-1 my-auto flex items-center justify-center w-full h-full'>
												<VideoEditor
													handleAction={transformations => {
														handleUpdateVideo?.(videoURL, transformations)
														handleClose(true)
													}}
													url={videoURL}
													width={720}
													action='Save'
													transformations={{
														clip: initialValue?.transformations?.clip || {},
														crop: initialValue?.transformations?.crop,
													}}
												/>
											</div>
										)
									default:
										return null
								}
							})()}
						</Dialog.Panel>
					</Transition.Child>
				</div>
			</Dialog>
		</Transition>
	)
}

export default AddVideo
