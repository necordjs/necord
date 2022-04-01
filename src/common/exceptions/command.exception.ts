export enum CommandExceptionType {
	GUILD_ONLY,
	BOT_OWNER,
	GUILD_OWNER,
	MEMBER_PERMISSIONS,
	BOT_PERMISSIONS,
	COOLDOWN
}

export class CommandException {
	public constructor(
		public readonly exception: CommandExceptionType,
		public readonly payload: Record<string, any> = {}
	) {}
}
