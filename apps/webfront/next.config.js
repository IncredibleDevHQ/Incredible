const withTM = require('next-transpile-modules')([
	'ui',
	'editor',
	'icanvas',
	'utils',
	'server',
	'prisma-orm',
	'@vime/core',
	'@vime/react',
])

module.exports = withTM({
	reactStrictMode: true,
	images: {
		domains: [
			'lh3.googleusercontent.com',
			'cdn-staging.incredible.dev',
			'cdn.incredible.dev',
		],
	},
	webpack(config) {
		config.module.rules.push({
			test: /\.svg$/,
			use: ['@svgr/webpack'],
		})

		return config
	},

	env: {
		NEXT_PUBLIC_DEPLOY_ENV: process.env.NEXT_PUBLIC_DEPLOY_ENV,
		NEXT_PUBLIC_API_ENDPOINT: process.env.NEXT_PUBLIC_API_ENDPOINT,
		NEXT_PUBLIC_PUBLIC_URL: process.env.NEXT_PUBLIC_PUBLIC_URL,
		NEXT_PUBLIC_CDN_URL: process.env.NEXT_PUBLIC_CDN_URL,
		NEXT_PUBLIC_EMBED_PLAYER_BASE_URL:
			process.env.NEXT_PUBLIC_EMBED_PLAYER_BASE_URL,
		NEXT_PUBLIC_HOCUSPOCUS_SERVER: process.env.NEXT_PUBLIC_HOCUSPOCUS_SERVER,
		NEXT_PUBLIC_GIPHY_API_KEY: process.env.NEXT_PUBLIC_GIPHY_API_KEY,
		NEXT_PUBLIC_GOOGLE_FONTS_API_KEY:
			process.env.NEXT_PUBLIC_GOOGLE_FONTS_API_KEY,
		NEXT_PUBLIC_AGORA_APP_ID: process.env.NEXT_PUBLIC_AGORA_APP_ID,
		NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY:
			process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY,
		NEXT_PUBLIC_LOGROCKET_APP_ID: process.env.NEXT_PUBLIC_LOGROCKET_APP_ID,
		NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
		NEXT_PUBLIC_GA_TRACKING_CODE: process.env.NEXT_PUBLIC_GA_TRACKING_CODE,
		NEXT_PUBLIC_SEGMENT_WATCH_ID: process.env.NEXT_PUBLIC_SEGMENT_WATCH_ID,
		TIPTAP_PRO_TOKEN: process.env.TIPTAP_PRO_TOKEN,
		NEXT_PUBLIC_FIREBASE_CONFIG: process.env.NEXT_PUBLIC_FIREBASE_CONFIG,
		FIREBASE_SERVICE_CONFIG: process.env.FIREBASE_SERVICE_CONFIG,
		COOKIE_DOMAIN: process.env.COOKIE_DOMAIN,
	},
})
