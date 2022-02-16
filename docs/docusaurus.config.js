// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/oceanicNext');

/** @type {import("@docusaurus/types").Config} */
const config = {
	title: 'Necord',
	tagline: 'A module for creating Discord bots using NestJS, based on Discord.js',
	url: 'https://necord.org',
	baseUrl: '/',
	onBrokenLinks: 'throw',
	onBrokenMarkdownLinks: 'warn',
	favicon: 'img/favicon.ico',
	organizationName: 'SocketSomeone', // Usually your GitHub org/user name.
	projectName: 'necord', // Usually your repo name.
	presets: [
		[
			'classic',
			/** @type {import("@docusaurus/preset-classic").Options} */
			{
				debug: process.env.NODE_ENV !== 'production',
				docs: {
					sidebarPath: require.resolve('./sidebars.js'),
					editUrl: 'https://github.com/SocketSomeone/necord/tree/master/docs',
					path: 'content',
					routeBasePath: '/',
					showLastUpdateAuthor: true,
					showLastUpdateTime: true,
					remarkPlugins: [[require('@docusaurus/remark-plugin-npm2yarn'), {sync: true}]]
				},
				blog: false,
				pages: false,
				theme: {
					customCss: require.resolve('./styles/custom.scss')
				},
				sitemap: {
					changefreq: 'weekly',
					priority: 0.5,
				},
				gtag: {
					trackingID: 'G-46VBZHXG63',
					anonymizeIP: false
				}
			}
		]
	],

	themeConfig:
	/** @type {import("@docusaurus/preset-classic").ThemeConfig} */
		{
			algolia: {
				appId: 'U7YH0EPYI9',
				apiKey: 'c41976c1ed280e75acc3e9efd4aaaf00',
				indexName: 'necord'
			},
			announcementBar: {
				content:
					'⭐️ If you like Necord, give it a star on <a target="_blank" rel="noopener noreferrer" href="https://github.com/SocketSomeone/necord">GitHub</a>! ⭐️'
			},
			metadata: [{
				name: 'keywords',
				content: 'discord, discord-bot, framework, necord, github, open-source'
			}],
			navbar: {
				logo: {
					alt: 'Necord Logo',
					src: 'img/logo.svg'
				},
				items: [
					{
						href: 'https://www.npmjs.com/package/necord',
						position: 'right',
						className: 'header-npm-link',
						'aria-label': 'NPM'
					},
					{
						href: 'https://github.com/SocketSomeone/necord',
						position: 'right',
						className: 'header-github-link',
						'aria-label': 'GitHub repository'
					}
				]
			},
			colorMode: {
				defaultMode: 'light',
				disableSwitch: false,
				respectPrefersColorScheme: true
			},
			footer: {
				copyright: `Copyright © 2021 - ${new Date().getFullYear()} • Built by <a target="_blank" href="https://github.com/SocketSomeone">Alexey Filippov</a> and <a target="_blank" href="https://github.com/SocketSomeone/necord/graphs/contributors">Others</a> with 💖`
			},
			prism: {
				theme: lightCodeTheme,
				darkTheme: darkCodeTheme
			}
		},
	plugins: ['docusaurus-plugin-sass']
};

module.exports = config;
