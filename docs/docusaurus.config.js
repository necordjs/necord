// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

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
	titleDelimiter: '-',
	presets: [
		[
			'classic',
			/** @type {import("@docusaurus/preset-classic").Options} */
			{
				docs: {
					sidebarPath: require.resolve('./sidebars.js'),
					editUrl: 'https://github.com/SocketSomeone/necord/tree/master/docs',
					path: 'content',
					routeBasePath: '/',
					showLastUpdateAuthor: true,
					showLastUpdateTime: true,
					remarkPlugins: [
						[require('@docusaurus/remark-plugin-npm2yarn'), {sync: true}],
					]
				},
				blog: false,
				pages: false,
				theme: {
					customCss: require.resolve('./styles/custom.css')
				}
			}
		]
	],

	themeConfig:
	/** @type {import("@docusaurus/preset-classic").ThemeConfig} */
		{
			announcementBar: {
				content:
					'⭐️ If you like Necord, give it a star on <a target="_blank" rel="noopener noreferrer" href="https://github.com/SocketSomeone/necord">GitHub</a>! ⭐️',
			},
			navbar: {
				title: 'NECORD',
				logo: {
					alt: 'Nest.JS Logo',
					src: 'https://nestjs.com/img/logo-small.svg'
				},
				items: [
					{
						href: 'https://www.npmjs.com/package/necord',
						position: 'right',
						className: 'header-npm-link',
						'aria-label': 'NPM',
					},
					{
						href: 'https://github.com/SocketSomeone/necord',
						position: 'right',
						className: 'header-github-link',
						'aria-label': 'GitHub repository',
					}
				]
			},
			colorMode: {
				defaultMode: 'light',
				disableSwitch: false,
				respectPrefersColorScheme: true,
			},
			hideableSidebar: true,
			footer: {},
			prism: {
				theme: lightCodeTheme,
				darkTheme: darkCodeTheme
			}
		}
};

module.exports = config;
