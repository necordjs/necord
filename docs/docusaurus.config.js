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
					path: 'content',
					routeBasePath: '/',
					sidebarPath: require.resolve('./sidebars.js'),
					editUrl: 'https://github.com/SocketSomeone/necord/tree/master/docs'
				},
				blog: false,
				theme: {
					customCss: require.resolve('./styles/custom.css')
				}
			}
		]
	],

	themeConfig:
		/** @type {import("@docusaurus/preset-classic").ThemeConfig} */
		{
			navbar: {
				title: 'Necord Documentation',
				logo: {
					alt: 'Nest.JS Logo',
					src: 'https://nestjs.com/img/logo-small.svg'
				},
				items: [
					{
						href: 'https://github.com/SocketSomeone/necord',
						label: 'GitHub',
						position: 'right'
					},
					{
						href: 'https://www.npmjs.com/package/necord',
						label: 'NPM',
						position: 'right'
					}
				]
			},
			hideableSidebar: true,
			prism: {
				theme: lightCodeTheme,
				darkTheme: darkCodeTheme
			}
		}
};

module.exports = config;
