import React, { HTMLProps } from 'react'
import { cx } from '@emotion/css'
import { BiUser } from 'react-icons/bi'
import { Fragment_Type_Enum_Enum } from '../../../generated/graphql'
import { Heading } from '../../../components'
import { fragmentIcons } from '../../../constants'

const BaseFragmentCard = ({
  label,
  image,
  description,
  className,
  accessory,
  ...rest
}: HTMLProps<HTMLDivElement> & {
  label: string
  image: string
  description: string
  accessory: string
}) => {
  return (
    <div
      className={cx(
        'flex cursor-pointer flex-col p-6 rounded-xl bg-white shadow-lg transition-all transform hover:-translate-y-2 hover:shadow-xl',
        className
      )}
      {...rest}
    >
      <div className="flex items-center justify-between">
        <img className="w-min h-10" src={image} alt={label} />

        <Heading
          className="uppercase font-bold flex items-center py-1 px-2 rounded-md text-brand bg-brand-10"
          fontSize="extra-small"
        >
          <BiUser className="mr-1" />
          {accessory}
        </Heading>
      </div>
      <Heading className="my-2" fontSize="medium">
        {label}
      </Heading>
      <Heading fontSize="base">{description}</Heading>
    </div>
  )
}

const BaseFragment = ({
  className,
  handleNext,
  ...rest
}: HTMLProps<HTMLDivElement> & {
  handleNext: (type: Fragment_Type_Enum_Enum) => void
}) => {
  return (
    <div
      className={cx('grid grid-cols-2 grid-flow-row gap-8', className)}
      {...rest}
    >
      <BaseFragmentCard
        label="CodeJam"
        image={fragmentIcons.codeJam}
        description="Talk about a code snippet with your friends."
        onClick={() => handleNext(Fragment_Type_Enum_Enum.CodeJam)}
        accessory="1-4 people"
      />
      <BaseFragmentCard
        label="Splash"
        image={fragmentIcons.splash}
        description="Create classy intros for your Flicks."
        onClick={() => handleNext(Fragment_Type_Enum_Enum.Splash)}
        accessory="1 person"
      />
      <BaseFragmentCard
        label="Trivia"
        image={fragmentIcons.trivia}
        description="A simple quiz to test your knowledge of the topic."
        onClick={() => handleNext(Fragment_Type_Enum_Enum.Trivia)}
        accessory="1 person"
      />
      <BaseFragmentCard
        label="Slides"
        image={fragmentIcons.slides}
        description="Talk about your slides just like Ross and Rachel"
        onClick={() => handleNext(Fragment_Type_Enum_Enum.Slides)}
        accessory="1 person"
      />
      <BaseFragmentCard
        label="VideoJam"
        image={fragmentIcons.videoJam}
        description="Talk about a video with your friends."
        onClick={() => handleNext(Fragment_Type_Enum_Enum.Videoshow)}
        accessory="1-4 people"
      />
      <BaseFragmentCard
        label="Solo"
        image={fragmentIcons.solo}
        description="Introduce your story."
        onClick={() => handleNext(Fragment_Type_Enum_Enum.Solo)}
        accessory="1 person"
      />
      <BaseFragmentCard
        label="Points"
        image={fragmentIcons.points}
        description="Talk about the Points of your Topic."
        onClick={() => handleNext(Fragment_Type_Enum_Enum.Points)}
        accessory="1 person"
      />
      <BaseFragmentCard
        label="Discussion"
        image={fragmentIcons.discussion}
        description="Have fantabulous discussion with your friend."
        onClick={() => handleNext(Fragment_Type_Enum_Enum.Discussion)}
        accessory="2 person"
      />
      <BaseFragmentCard
        label="Outro"
        image={fragmentIcons.outro}
        description="Lets end the video gracefully"
        onClick={() => handleNext(Fragment_Type_Enum_Enum.Outro)}
        accessory="1 person"
      />
    </div>
  )
}

export default BaseFragment