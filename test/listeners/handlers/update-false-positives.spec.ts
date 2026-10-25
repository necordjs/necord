import { Collection } from 'discord.js';

import {
	ChannelUpdateHandler,
	GuildUpdateHandler,
	UserUpdateHandler
} from '../../../src/listeners/handlers/index.js';
import { ContextOf } from '../../../src/context/index.js';

const createHandler = <T extends object>(Handler: new () => T) => {
	const emit = vi.fn<(event: string, ...args: unknown[]) => boolean>();
	const handler = new Handler();

	Object.defineProperty(handler, 'client', { value: { emit } });

	return { emit, handler };
};

const context = <K extends 'channelUpdate' | 'guildUpdate' | 'userUpdate'>(
	oldValue: object,
	newValue: object
) => [oldValue, newValue] as ContextOf<K>;

const createOverwrites = (...overwrites: [id: string, allow: bigint, deny: bigint][]) => ({
	cache: new Collection(
		overwrites.map(([id, allow, deny]) => [
			id,
			{ id, allow: { bitfield: allow }, deny: { bitfield: deny } }
		])
	)
});

describe('update events without false positives', () => {
	describe('guildChannelPermissionsUpdate', () => {
		const emitPermissionsUpdate = (
			oldOverwrites: object | undefined,
			newOverwrites: object | undefined
		) => {
			const { emit, handler } = createHandler(ChannelUpdateHandler);
			const newChannel = { permissionOverwrites: newOverwrites };

			handler.handleGuildChannelPermissionsUpdate(
				context<'channelUpdate'>({ permissionOverwrites: oldOverwrites }, newChannel)
			);

			return { emit, newChannel };
		};

		it('ignores recreated managers with identical overwrites', () => {
			const { emit } = emitPermissionsUpdate(
				createOverwrites(['role', 1n, 2n]),
				createOverwrites(['role', 1n, 2n])
			);

			expect(emit).not.toHaveBeenCalled();
		});

		it('ignores channels without permission overwrites', () => {
			const { emit } = emitPermissionsUpdate(undefined, undefined);

			expect(emit).not.toHaveBeenCalled();
		});

		it.each([
			['an overwrite is added', [], [['role', 1n, 0n]]],
			['an overwrite is replaced', [['role', 1n, 0n]], [['member', 1n, 0n]]],
			['allow changes', [['role', 1n, 0n]], [['role', 3n, 0n]]],
			['deny changes', [['role', 1n, 0n]], [['role', 1n, 2n]]]
		] satisfies [string, [string, bigint, bigint][], [string, bigint, bigint][]][])(
			'emits when %s',
			(_, oldOverwrites, newOverwrites) => {
				const oldPermissions = createOverwrites(...oldOverwrites);
				const newPermissions = createOverwrites(...newOverwrites);
				const { emit, newChannel } = emitPermissionsUpdate(oldPermissions, newPermissions);

				expect(emit).toHaveBeenCalledExactlyOnceWith(
					'guildChannelPermissionsUpdate',
					newChannel,
					oldPermissions,
					newPermissions
				);
			}
		);
	});

	describe('guildFeaturesUpdate', () => {
		const createGuild = (features: string[]) => ({
			banner: null,
			afkChannel: null,
			features,
			nameAcronym: 'G',
			ownerId: 'owner'
		});

		it('ignores identical features', () => {
			const { emit, handler } = createHandler(GuildUpdateHandler);

			handler.handleGuildChanges(
				context<'guildUpdate'>(createGuild(['COMMUNITY']), createGuild(['COMMUNITY']))
			);

			expect(emit).not.toHaveBeenCalled();
		});

		it('emits when features are swapped', () => {
			const { emit, handler } = createHandler(GuildUpdateHandler);
			const newGuild = createGuild(['PARTNERED']);

			handler.handleGuildChanges(
				context<'guildUpdate'>(createGuild(['COMMUNITY']), newGuild)
			);

			expect(emit).toHaveBeenCalledExactlyOnceWith(
				'guildFeaturesUpdate',
				newGuild,
				['COMMUNITY'],
				['PARTNERED']
			);
		});
	});

	describe('userFlagsUpdate', () => {
		it('ignores recreated flags with the same bitfield', () => {
			const { emit, handler } = createHandler(UserUpdateHandler);

			handler.handleUserFlagsUpdate(
				context<'userUpdate'>(
					{ partial: false, flags: { bitfield: 1n } },
					{ flags: { bitfield: 1n } }
				)
			);

			expect(emit).not.toHaveBeenCalled();
		});

		it('emits when the bitfield changes', () => {
			const { emit, handler } = createHandler(UserUpdateHandler);
			const oldFlags = { bitfield: 1n };
			const newFlags = { bitfield: 3n };
			const newUser = { flags: newFlags };

			handler.handleUserFlagsUpdate(
				context<'userUpdate'>({ partial: false, flags: oldFlags }, newUser)
			);

			expect(emit).toHaveBeenCalledExactlyOnceWith(
				'userFlagsUpdate',
				newUser,
				oldFlags,
				newFlags
			);
		});
	});
});
