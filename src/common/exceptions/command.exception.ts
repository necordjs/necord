export enum CommandExceptionType {
	GUILD_ONLY,
	BOT_OWNER,
	GUILD_OWNER,
	MEMBER_PERMISSIONS,
	BOT_PERMISSIONS,
	COOLDOWN
}

export class CommandException extends Error {
	public constructor(
		public readonly exception: CommandExceptionType,
		public readonly payload: Record<string, any> = {}
	) {
		super(`Command Exception with code: ${exception}`);
	}
}
