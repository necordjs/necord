import {
	GuildMemberUpdateHandler,
	ThreadUpdateHandler,
	UserUpdateHandler
} from '../../../src/listeners/handlers/index.js';

const createHandler = <T extends object>(Handler: new () => T) => {
	const emit = vi.fn<(...args: any[]) => any>();
	const handler = new Handler();

	Object.defineProperty(handler, 'client', { value: { emit } });

	return { emit, handler };
};

describe('nullable custom-listener transitions', () => {
	it('emits nickname additions and removals', () => {
		const { emit, handler } = createHandler(GuildMemberUpdateHandler);

		handler.handleGuildMemberNicknameUpdate([
			{ partial: false, nickname: null },
			{ nickname: 'new-name' }
		] as any);
		handler.handleGuildMemberNicknameUpdate([
			{ partial: false, nickname: 'old-name' },
			{ nickname: null }
		] as any);

		expect(emit).toHaveBeenNthCalledWith(
			1,
			'guildMemberNicknameUpdate',
			{ nickname: 'new-name' },
			null,
			'new-name'
		);
		expect(emit).toHaveBeenNthCalledWith(
			2,
			'guildMemberNicknameUpdate',
			{ nickname: null },
			'old-name',
			null
		);
	});

	it('emits nullable thread setting transitions', () => {
		const { emit, handler } = createHandler(ThreadUpdateHandler);
		const oldThread = { rateLimitPerUser: null, autoArchiveDuration: null };
		const newThread = { rateLimitPerUser: 5, autoArchiveDuration: 60 };

		handler.handleThreadRateLimitPerUserUpdate([oldThread, newThread] as any);
		handler.handleThreadAutoArchiveDurationUpdate([oldThread, newThread] as any);

		expect(emit).toHaveBeenNthCalledWith(1, 'threadRateLimitPerUserUpdate', newThread, null, 5);
		expect(emit).toHaveBeenNthCalledWith(
			2,
			'threadAutoArchiveDurationUpdate',
			newThread,
			null,
			60
		);
	});

	it('emits nullable user metadata transitions', () => {
		const { emit, handler } = createHandler(UserUpdateHandler);
		const flags = { bitfield: 1n };
		const primaryGuild = { identityGuildId: 'guild' };
		const oldUser = { partial: false, flags: null, primaryGuild: null };
		const newUser = { flags, primaryGuild };

		handler.handleUserFlagsUpdate([oldUser, newUser] as any);
		handler.handleUserPrimaryGuildUpdate([oldUser, newUser] as any);

		expect(emit).toHaveBeenNthCalledWith(1, 'userFlagsUpdate', newUser, null, flags);
		expect(emit).toHaveBeenNthCalledWith(
			2,
			'userPrimaryGuildUpdate',
			newUser,
			null,
			primaryGuild
		);
	});
});
