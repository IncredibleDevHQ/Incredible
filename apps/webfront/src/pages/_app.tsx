/* eslint-disable react/jsx-props-no-spreading */
import { AppProps } from 'next/app'
import { RecoilRoot } from 'recoil'
import { withTRPC } from '@trpc/next'
import superjson from 'superjson'
import UserProvider from 'src/utils/providers/auth'
import AuthorizedApolloProvider from 'src/utils/providers/authorized-apollo-provider'
import { ToastContainer } from 'ui/src'
import '../styles/globals.css'
import { AppRouter } from 'src/server/routes/route'

const MyApp = ({ Component, pageProps }: AppProps) => (
	<RecoilRoot>
		<UserProvider>
			<ToastContainer limit={2} />
			<AuthorizedApolloProvider>
				<Component {...pageProps} />
			</AuthorizedApolloProvider>
		</UserProvider>
	</RecoilRoot>
)

export default withTRPC<AppRouter>({
	config() {
		/**
		 * If you want to use SSR, you need to use the server's full URL
		 * @link https://trpc.io/docs/ssr
		 */
		const url = process.env.VERCEL_URL
			? `https://${process.env.VERCEL_URL}/api/trpc`
			: 'http://localhost:3000/api/trpc'

		return {
			url,
			transformer: superjson,
			// eslint-disable-next-line consistent-return
			headers: () => ({
				Authorization:
					typeof window !== 'undefined'
						? localStorage?.getItem('token')?.toString()
						: '',
			}),
			/**
			 * @link https://react-query.tanstack.com/reference/QueryClient
			 */
			// queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
		}
	},
	/**
	 * @link https://trpc.io/docs/ssr
	 */
	ssr: false, // NOTE: SSR enabled may cause certain problems like this https://github.com/trpc/trpc/issues/596
})(MyApp)
