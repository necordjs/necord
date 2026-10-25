import { UserUpdateHandler } from '../../../src/listeners/handlers/index.js';
import { ContextOf } from '../../../src/context/index.js';

const createPrimaryGuild = (
	identityGuildId: string | null,
	identityEnabled = true,
	tag = 'TAG'
) => ({
	identityGuildId,
	identityEnabled,
	tag,
	badge: null
});

const emitPrimaryGuild = (
	oldPrimaryGuild: object | null,
	newPrimaryGuild: object | null,
	partial = false
) => {
	const emit = vi.fn<(event: string, ...args: unknown[]) => boolean>();
	const handler = new UserUpdateHandler();
	const newUser = { primaryGuild: newPrimaryGuild };

	Object.defineProperty(handler, 'client', { value: { emit } });

	handler.handleUserPrimaryGuild([
		{ partial, primaryGuild: oldPrimaryGuild },
		newUser
	] as ContextOf<'userUpdate'>);

	return { emit, newUser };
};

describe('userPrimaryGuildAdd and userPrimaryGuildRemove', () => {
	it('emits add when a user starts displaying a guild tag', () => {
		const primaryGuild = createPrimaryGuild('guild');
		const { emit, newUser } = emitPrimaryGuild(null, primaryGuild);

		expect(emit).toHaveBeenCalledExactlyOnceWith('userPrimaryGuildAdd', newUser, primaryGuild);
	});

	it('emits add when a hidden guild tag is enabled', () => {
		const primaryGuild = createPrimaryGuild('guild');
		const { emit, newUser } = emitPrimaryGuild(
			createPrimaryGuild('guild', false),
			primaryGuild
		);

		expect(emit).toHaveBeenCalledExactlyOnceWith('userPrimaryGuildAdd', newUser, primaryGuild);
	});

	it('emits remove when a user stops displaying a guild tag', () => {
		const primaryGuild = createPrimaryGuild('guild');
		const { emit, newUser } = emitPrimaryGuild(primaryGuild, createPrimaryGuild(null));

		expect(emit).toHaveBeenCalledExactlyOnceWith(
			'userPrimaryGuildRemove',
			newUser,
			primaryGuild
		);
	});

	it('emits remove for the old guild, then add for the new one when switching guilds', () => {
		const oldPrimaryGuild = createPrimaryGuild('old-guild');
		const newPrimaryGuild = createPrimaryGuild('new-guild');
		const { emit, newUser } = emitPrimaryGuild(oldPrimaryGuild, newPrimaryGuild);

		expect(emit).toHaveBeenCalledTimes(2);
		expect(emit).toHaveBeenNthCalledWith(1, 'userPrimaryGuildRemove', newUser, oldPrimaryGuild);
		expect(emit).toHaveBeenNthCalledWith(2, 'userPrimaryGuildAdd', newUser, newPrimaryGuild);
	});

	it('ignores tag changes within the same guild', () => {
		const { emit } = emitPrimaryGuild(
			createPrimaryGuild('guild', true, 'OLD'),
			createPrimaryGuild('guild', true, 'NEW')
		);

		expect(emit).not.toHaveBeenCalled();
	});

	it('ignores partial users', () => {
		const { emit } = emitPrimaryGuild(null, createPrimaryGuild('guild'), true);

		expect(emit).not.toHaveBeenCalled();
	});
});
