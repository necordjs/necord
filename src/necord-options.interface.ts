import { ClientOptions as DiscordClientOptions, Snowflake } from 'discord.js';

/**
 * The Necord module options.
 * @url https://necord.org/start/#module
 */
export interface NecordModuleOptions extends DiscordClientOptions {
	/**
	 * Discord token: it is used to authenticate as your bot.
	 */
	token: string;
	/**
	 * If you are using TextCommand, you can specify the prefix here. It can be a string for a static prefix, or a function which returns a string based off the message being sent. If using a function, it can be asynchronous.
	 */
	prefix?: string | Function;
	/**
	 * As discord caches application commands for up to an hour, it is recommended to specify a development guild when doing development.
	 *
	 * * If you do not specify a development guild, your commands and their arguments are likely to be outdated.
	 *
	 * * If you have commands using the guilds property, the global development argument will not overwrite it.
	 */
	development?: Snowflake[] | false;

	/**
	 * If skipRegistration is true, necord would not automatically register your application commands with Discord. You would have to register the application commands manually.
	 */
	skipRegistration?: boolean;
}
