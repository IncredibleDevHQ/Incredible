import { inferQueryOutput } from 'server/trpc'
import { Text } from 'ui/src'

const NotificationMessage = ({
	notification,
}: {
	notification: inferQueryOutput<'user.notifications'>[number]
}) => {
	const { message } = notification
	const regex = /%(.*?)%/g
	return (
		<Text
			textStyle='body'
			className='text-gray-400'
			dangerouslySetInnerHTML={{
				__html: message.replace(
					regex,
					'<span class="text-gray-100 font-main">$1</span>'
				),
			}}
		/>
	)
}

export default NotificationMessage
