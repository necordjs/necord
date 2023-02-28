import { ClientOptions as DiscordClientOptions, Snowflake } from 'discord.js';

export interface NecordModuleOptions extends DiscordClientOptions {
	token: string;
	prefix?: string | Function;
	development?: Snowflake[] | false;
	skipRegistration?: boolean;
}
