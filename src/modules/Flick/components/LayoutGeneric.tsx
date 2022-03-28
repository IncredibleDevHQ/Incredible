/* eslint-disable react/no-unknown-property */
import { cx } from '@emotion/css'
import React, { HTMLAttributes } from 'react'
import {
  IoCodeSlashOutline,
  IoImageOutline,
  IoListOutline,
  IoPlayOutline,
} from 'react-icons/io5'
import { CgFormatHeading } from 'react-icons/cg'
import { Text } from '../../../components'
import { Layout, ViewConfig } from '../../../utils/configTypes'
import { Block } from '../editor/utils/utils'

export const FragmentTypeIcon = ({
  type,
  shouldDisplayIcon = true,
}: {
  type: Block['type']
  shouldDisplayIcon?: boolean
}) => {
  if (!shouldDisplayIcon) return null

  return (
    <>
      {(() => {
        switch (type) {
          case 'imageBlock':
            return <IoImageOutline className="w-full h-full text-gray-400" />
          case 'videoBlock':
            return <IoPlayOutline className="w-full h-full text-gray-400" />
          case 'listBlock':
            return <IoListOutline className="w-full h-full text-gray-400" />
          case 'codeBlock':
            return (
              <IoCodeSlashOutline className="w-full h-full text-gray-400" />
            )
          case 'headingBlock':
            return <CgFormatHeading className="w-full h-full text-gray-400" />
          case 'introBlock':
            return (
              <Text className="flex items-center justify-center w-full h-full text-xs text-center text-gray-400 font-main">
                Title
              </Text>
            )
          case 'outroBlock':
            return (
              <Text className="flex items-center justify-center w-full h-full text-xs text-gray-400 font-main ">
                Outro
              </Text>
            )
          default:
            return <></>
        }
      })()}
    </>
  )
}

const LayoutGeneric = ({
  type,
  layout,
  mode = 'Landscape',
  isSelected,
  shouldDisplayIcon = true,
  ...rest
}: {
  isSelected?: boolean
  mode?: ViewConfig['mode']
  layout: Layout
  type: Block['type']
  shouldDisplayIcon?: boolean
} & HTMLAttributes<HTMLDivElement>) => {
  return (
    <>
      {(() => {
        switch (layout) {
          case 'classic':
            return (
              <div
                className={cx(
                  'border border-gray-200 rounded-md cursor-pointer bg-white',
                  {
                    'border-brand': isSelected,
                    'p-1 w-16 h-28': mode === 'Portrait',
                    'p-2 w-28 h-16': mode === 'Landscape',
                  }
                )}
                {...rest}
              >
                <div className="w-full h-full p-2 bg-gray-200 rounded-sm">
                  {type && (
                    <FragmentTypeIcon
                      shouldDisplayIcon={shouldDisplayIcon}
                      type={type}
                    />
                  )}
                </div>
              </div>
            )
          case 'float-full-right':
            return (
              <div
                className={cx(
                  'border border-gray-200 rounded-md cursor-pointer flex gap-x-2',
                  {
                    'border-brand': isSelected,
                    'p-1 w-16 h-28': mode === 'Portrait',
                    'p-2 w-28 h-16': mode === 'Landscape',
                  }
                )}
                {...rest}
              >
                <div className="h-full w-5/6 bg-gray-200 rounded-sm p-2.5">
                  {type && (
                    <FragmentTypeIcon
                      shouldDisplayIcon={shouldDisplayIcon}
                      type={type}
                    />
                  )}
                </div>
                <div className="w-1/6 h-full p-2 bg-gray-500 rounded-sm" />
              </div>
            )
          case 'float-full-left':
            return (
              <div
                className={cx(
                  'p-2 border border-gray-200 rounded-md cursor-pointer flex gap-x-2',
                  {
                    'border-brand': isSelected,
                    'w-16 h-28': mode === 'Portrait',
                    'w-28 h-16': mode === 'Landscape',
                  }
                )}
                {...rest}
              >
                <div className="w-1/6 h-full p-2 bg-gray-500 rounded-sm" />
                <div className="h-full w-5/6 bg-gray-200 rounded-sm p-2.5">
                  {type && (
                    <FragmentTypeIcon
                      shouldDisplayIcon={shouldDisplayIcon}
                      type={type}
                    />
                  )}
                </div>
              </div>
            )
          case 'float-half-right':
            return (
              <div
                className={cx(
                  'p-2 border border-gray-200 rounded-md cursor-pointer flex justify-end items-center relative',
                  {
                    'border-brand': isSelected,
                    'w-16 h-28': mode === 'Portrait',
                    'w-28 h-16': mode === 'Landscape',
                  }
                )}
                {...rest}
              >
                <div className="w-full h-full p-2 mr-2 bg-gray-200 rounded-sm">
                  {type && (
                    <FragmentTypeIcon
                      shouldDisplayIcon={shouldDisplayIcon}
                      type={type}
                    />
                  )}
                </div>
                <div className="absolute w-1/6 p-2 bg-gray-500 rounded-sm h-7" />
              </div>
            )
          case 'padded-bottom-right-tile':
            return (
              <div
                className={cx(
                  'p-2 border border-gray-200 rounded-md cursor-pointer flex justify-end items-end relative',
                  {
                    'border-brand': isSelected,
                    'w-16 h-28': mode === 'Portrait',
                    'w-28 h-16': mode === 'Landscape',
                  }
                )}
                {...rest}
              >
                <div className="w-full h-full p-2 bg-gray-200 rounded-sm">
                  {type && (
                    <FragmentTypeIcon
                      shouldDisplayIcon={shouldDisplayIcon}
                      type={type}
                    />
                  )}
                </div>
                <div className="absolute w-4 h-4 p-2 -m-1 bg-gray-500 rounded-sm" />
              </div>
            )
          case 'padded-bottom-right-circle':
            return (
              <div
                className={cx(
                  'p-2 border border-gray-200 rounded-md cursor-pointer flex justify-end items-end relative',
                  {
                    'border-brand': isSelected,
                    'w-16 h-28': mode === 'Portrait',
                    'w-28 h-16': mode === 'Landscape',
                  }
                )}
                {...rest}
              >
                <div className="w-full h-full p-2 bg-gray-200 rounded-sm">
                  {type && (
                    <FragmentTypeIcon
                      shouldDisplayIcon={shouldDisplayIcon}
                      type={type}
                    />
                  )}
                </div>
                <div className="absolute w-4 h-4 p-2 -m-1 bg-gray-500 rounded-full" />
              </div>
            )
          case 'bottom-right-tile':
            return (
              <div
                className={cx(
                  'border border-gray-200 rounded-md cursor-pointer flex justify-end items-end relative',
                  {
                    'border-brand': isSelected,
                    'w-16 h-28': mode === 'Portrait',
                    'w-28 h-16': mode === 'Landscape',
                  }
                )}
                {...rest}
              >
                <div className="h-full w-full bg-gray-200 rounded-md p-3.5">
                  {type && (
                    <FragmentTypeIcon
                      shouldDisplayIcon={shouldDisplayIcon}
                      type={type}
                    />
                  )}
                </div>
                <div className="absolute w-4 h-4 p-2 m-1 bg-gray-500 rounded-sm" />
              </div>
            )
          case 'bottom-right-circle':
            return (
              <div
                className={cx(
                  'border border-gray-200 rounded-md cursor-pointer flex justify-end items-end relative',
                  {
                    'border-brand': isSelected,
                    'w-16 h-28': mode === 'Portrait',
                    'w-28 h-16': mode === 'Landscape',
                  }
                )}
                {...rest}
              >
                <div className="h-full w-full bg-gray-200 rounded-md p-3.5">
                  {type && (
                    <FragmentTypeIcon
                      shouldDisplayIcon={shouldDisplayIcon}
                      type={type}
                    />
                  )}
                </div>
                <div className="absolute w-4 h-4 p-2 m-1 bg-gray-500 rounded-full" />
              </div>
            )
          case 'padded-split':
            return (
              <div
                className={cx(
                  'border border-gray-200 rounded-md cursor-pointer flex items-center gap-x-2',
                  {
                    'border-brand': isSelected,
                    'w-16 h-28': mode === 'Portrait',
                    'w-28 h-16': mode === 'Landscape',
                  }
                )}
                {...rest}
              >
                <div className="h-7 w-5/6 bg-gray-200 rounded-sm p-1.5 ml-2">
                  {type && (
                    <FragmentTypeIcon
                      shouldDisplayIcon={shouldDisplayIcon}
                      type={type}
                    />
                  )}
                </div>
                <div className="w-3/6 h-full p-2 bg-gray-500 rounded-tr-sm rounded-br-sm" />
              </div>
            )
          case 'split':
            return (
              <div
                className={cx(
                  'border border-gray-200 rounded-md cursor-pointer flex items-center',
                  {
                    'border-brand': isSelected,
                    'flex-col w-16 h-28 p-1.5 gap-y-1': mode === 'Portrait',
                    'w-28 h-16': mode === 'Landscape',
                  }
                )}
                {...rest}
              >
                <div
                  className={cx(' bg-gray-200', {
                    'w-full h-1/2 rounded-sm p-2': mode === 'Portrait',
                    'w-3/6 h-8 p-1.5': mode === 'Landscape',
                  })}
                >
                  {type && (
                    <FragmentTypeIcon
                      shouldDisplayIcon={shouldDisplayIcon}
                      type={type}
                    />
                  )}
                </div>
                <div
                  className={cx('bg-gray-500 items-self-end', {
                    'w-full h-1/2 rounded-sm': mode === 'Portrait',
                    'h-full w-3/6 rounded-tr-sm rounded-br-sm':
                      mode === 'Landscape',
                  })}
                />
              </div>
            )
          case 'full-left':
            return (
              <div
                className={cx(
                  'border border-gray-200 rounded-md cursor-pointer flex items-center relative',
                  {
                    'border-brand': isSelected,
                    'w-16 h-28 justify-center': mode === 'Portrait',
                    'w-28 h-16': mode === 'Landscape',
                  }
                )}
                {...rest}
              >
                <div className="w-full h-full bg-gray-500 rounded-sm items-self-end" />
                <div
                  className={cx('bg-gray-200 p-1.5 absolute rounded-sm', {
                    'w-4/5 h-2/5 top-2': mode === 'Portrait',
                    'h-8 w-2/5 left-1': mode === 'Landscape',
                  })}
                >
                  {type && (
                    <FragmentTypeIcon
                      shouldDisplayIcon={shouldDisplayIcon}
                      type={type}
                    />
                  )}
                </div>
              </div>
            )
          case 'full-right':
            return (
              <div
                className={cx(
                  'border border-gray-200 rounded-md cursor-pointer flex items-center relative',
                  {
                    'border-brand': isSelected,
                    'w-16 h-28 justify-center': mode === 'Portrait',
                    'w-28 h-16': mode === 'Landscape',
                  }
                )}
                {...rest}
              >
                <div className="w-full h-full bg-gray-500 rounded-sm items-self-end" />
                <div
                  className={cx('bg-gray-200 p-1.5 absolute rounded-sm', {
                    'w-4/5 h-2/5 top-2': mode === 'Portrait',
                    'h-8 w-2/5 right-1': mode === 'Landscape',
                  })}
                >
                  {type && (
                    <FragmentTypeIcon
                      shouldDisplayIcon={shouldDisplayIcon}
                      type={type}
                    />
                  )}
                </div>
              </div>
            )
          case 'split-without-media':
            return (
              <div
                className={cx(
                  'border border-gray-200 rounded-md cursor-pointer flex items-center relative',
                  {
                    'border-brand': isSelected,
                    'w-16 h-28 justify-center': mode === 'Portrait',
                    'w-28 h-16': mode === 'Landscape',
                  }
                )}
                {...rest}
              >
                <div className="w-full h-full rounded-sm items-self-end" />
                <div
                  className={cx('bg-gray-200 p-1.5 absolute rounded-sm', {
                    'w-4/5 h-2/5 top-2': mode === 'Portrait',
                    'h-10 w-1/2 left-1': mode === 'Landscape',
                  })}
                >
                  {type && (
                    <FragmentTypeIcon
                      shouldDisplayIcon={shouldDisplayIcon}
                      type={type}
                    />
                  )}
                </div>
              </div>
            )
          default:
            return <></>
        }
      })()}
    </>
  )
}

export default LayoutGeneric
