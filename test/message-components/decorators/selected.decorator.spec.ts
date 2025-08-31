import {
	NecordExecutionContext,
	SelectedStrings,
	SelectedChannels,
	SelectedUsers,
	SelectedMembers,
	SelectedRoles
} from '../../../src';
import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';
import { Collection } from 'discord.js';

type MetaInfo = {
	meta: any;
	key: string;
	factory: (data: unknown, ctx: any) => unknown;
};

function getMeta<T>(Cls: new () => T): MetaInfo {
	const meta = Reflect.getMetadata(ROUTE_ARGS_METADATA, Cls, 'test');
	const key = Object.keys(meta)[0];
	return { meta, key, factory: meta[key].factory };
}

const createMockCtx = (interaction: any, discovery: any = {}): any =>
	NecordExecutionContext.create({
		getClass: () => ({}),
		getHandler: () => 'test',
		getArgs: () => [[interaction], discovery],
		getType: () => 'custom'
	} as any);

describe('@Selected* decorators', () => {
	describe.each([
		{
			name: 'SelectedStrings',
			decorator: SelectedStrings
		},
		{
			name: 'SelectedChannels',
			decorator: SelectedChannels
		},
		{
			name: 'SelectedUsers',
			decorator: SelectedUsers
		},
		{
			name: 'SelectedMembers',
			decorator: SelectedMembers
		},
		{
			name: 'SelectedRoles',
			decorator: SelectedRoles
		}
	])('@$name', ({ decorator }) => {
		class Cls {
			public test(@decorator() _arg: any) {}
		}

		it('should enhance parameter with factory and defaults', () => {
			const { meta, key } = getMeta(Cls as any);
			expect(meta[key]).toEqual(
				expect.objectContaining({
					index: 0,
					factory: expect.any(Function),
					pipes: [],
					data: undefined
				})
			);
		});
	});

	describe('@SelectedStrings', () => {
		class Host {
			public test(@SelectedStrings() _values: string[]) {}
		}
		const { factory } = getMeta(Host);

		it('returns [] when interaction is not StringSelectMenu', () => {
			const interaction = { isStringSelectMenu: () => false };
			const ctx = createMockCtx(interaction);
			expect(factory(undefined, ctx)).toEqual([]);
		});

		it('returns interaction.values for StringSelectMenu', () => {
			const values = ['a', 'b', 'c'];
			const interaction = { isStringSelectMenu: () => true, values };
			const ctx = createMockCtx(interaction);
			expect(factory(undefined, ctx)).toEqual(values);
		});
	});

	describe('@SelectedChannels', () => {
		class Host {
			public test(@SelectedChannels() _channels: Collection<string, any>) {}
		}
		const { factory } = getMeta(Host);

		it('returns empty Collection when not ChannelSelectMenu', () => {
			const interaction = { isChannelSelectMenu: () => false };
			const ctx = createMockCtx(interaction);
			const result = factory(undefined, ctx) as Collection<string, any>;
			expect(result).toBeInstanceOf(Collection);
			expect(result.size).toBe(0);
		});

		it('returns interaction.channels for ChannelSelectMenu', () => {
			const channels = new Collection<string, any>([
				['1', { id: '1' }],
				['2', { id: '2' }]
			]);
			const interaction = { isChannelSelectMenu: () => true, channels };
			const ctx = createMockCtx(interaction);
			expect(factory(undefined, ctx)).toBe(channels);
		});
	});

	// ---------- Поведение SelectedUsers ----------
	describe('@SelectedUsers', () => {
		class Host {
			public test(@SelectedUsers() _users: Collection<string, any>) {}
		}
		const { factory } = getMeta(Host);

		it('returns users for UserSelectMenu', () => {
			const users = new Collection<string, any>([['42', { id: '42' }]]);
			const interaction = {
				isUserSelectMenu: () => true,
				isMentionableSelectMenu: () => false,
				users
			};
			const ctx = createMockCtx(interaction);
			expect(factory(undefined, ctx)).toBe(users);
		});

		it('returns users for MentionableSelectMenu', () => {
			const users = new Collection<string, any>([['7', { id: '7' }]]);
			const interaction = {
				isUserSelectMenu: () => false,
				isMentionableSelectMenu: () => true,
				users
			};
			const ctx = createMockCtx(interaction);
			expect(factory(undefined, ctx)).toBe(users);
		});

		it('returns empty Collection when neither user/mentionable', () => {
			const interaction = {
				isUserSelectMenu: () => false,
				isMentionableSelectMenu: () => false
			};
			const ctx = createMockCtx(interaction);
			const result = factory(undefined, ctx) as Collection<string, any>;
			expect(result).toBeInstanceOf(Collection);
			expect(result.size).toBe(0);
		});
	});

	describe('@SelectedMembers', () => {
		class Host {
			public test(@SelectedMembers() _members: Collection<string, any>) {}
		}
		const { factory } = getMeta(Host);

		it.each([
			['UserSelectMenu', true, false],
			['MentionableSelectMenu', false, true]
		])('returns members for %s', (_name, isUser, isMentionable) => {
			const members = new Collection<string, any>([['99', { id: '99' }]]);
			const interaction = {
				isUserSelectMenu: () => isUser,
				isMentionableSelectMenu: () => isMentionable,
				members
			};
			const ctx = createMockCtx(interaction);
			expect(factory(undefined, ctx)).toBe(members);
		});

		it('returns empty Collection when neither user/mentionable', () => {
			const interaction = {
				isUserSelectMenu: () => false,
				isMentionableSelectMenu: () => false
			};
			const ctx = createMockCtx(interaction);
			const result = factory(undefined, ctx) as Collection<string, any>;
			expect(result).toBeInstanceOf(Collection);
			expect(result.size).toBe(0);
		});
	});

	describe('@SelectedRoles', () => {
		class Host {
			public test(@SelectedRoles() _roles: Collection<string, any>) {}
		}
		const { factory } = getMeta(Host);

		it.each([
			['RoleSelectMenu', true, false],
			['MentionableSelectMenu', false, true]
		])('returns roles for %s', (_name, isRole, isMentionable) => {
			const roles = new Collection<string, any>([['1', { id: '1' }]]);
			const interaction = {
				isRoleSelectMenu: () => isRole,
				isMentionableSelectMenu: () => isMentionable,
				roles
			};
			const ctx = createMockCtx(interaction);
			expect(factory(undefined, ctx)).toBe(roles);
		});

		it('returns empty Collection when neither role/mentionable', () => {
			const interaction = {
				isRoleSelectMenu: () => false,
				isMentionableSelectMenu: () => false
			};
			const ctx = createMockCtx(interaction);
			const result = factory(undefined, ctx) as Collection<string, any>;
			expect(result).toBeInstanceOf(Collection);
			expect(result.size).toBe(0);
		});
	});
});
