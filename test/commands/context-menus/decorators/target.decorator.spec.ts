import { TargetMember, TargetMessage, TargetUser } from '../../../../src';
import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';

describe('Target Decorators', () => {
	class Test {
		public targetUser(@TargetUser() user: any) {
			return user;
		}

		public targetMember(@TargetMember() member: any) {
			return member;
		}

		public targetMessage(@TargetMessage() message: any) {
			return message;
		}
	}

	const targetUserMetadata = Reflect.getMetadata(ROUTE_ARGS_METADATA, Test, 'targetUser');
	const targetMemberMetadata = Reflect.getMetadata(ROUTE_ARGS_METADATA, Test, 'targetMember');
	const targetMessageMetadata = Reflect.getMetadata(ROUTE_ARGS_METADATA, Test, 'targetMessage');

	const getFactory = (metadata: any) => metadata[Object.keys(metadata)[0]].factory;

	const createMockContext = (interaction: any, discovery: any): any => ({
		getClass: () => Test,
		getHandler: () => 'test',
		getArgs: () => [[interaction], discovery],
		getType: () => 'custom'
	});

	it.each(
		[targetUserMetadata, targetMemberMetadata, targetMessageMetadata].map(metadata => ({
			metadata,
			key: Object.keys(metadata)[0]
		}))
	)('should enhance parameter metadata', ({ metadata, key }) => {
		expect(metadata[key]).toEqual(
			expect.objectContaining({
				index: 0,
				factory: expect.any(Function),
				pipes: [],
				data: undefined
			})
		);
	});

	it.each([targetUserMetadata, targetMemberMetadata])(
		'should return null if interaction is not a user context menu command',
		metadata => {
			const interaction = {
				isUserContextMenuCommand: () => false
			};
			const discovery = { isInteractionCreate: () => true };
			const ctx = createMockContext(interaction, discovery);
			const factory = getFactory(metadata);
			expect(factory(undefined, ctx)).toBeNull();
		}
	);

	it('should return null if interaction is not a message context menu command', () => {
		const interaction = {
			isMessageContextMenuCommand: () => false
		};
		const discovery = { isInteractionCreate: () => true };
		const ctx = createMockContext(interaction, discovery);
		const factory = getFactory(targetMessageMetadata);
		expect(factory(undefined, ctx)).toBeNull();
	});

	it.each([targetUserMetadata, targetMemberMetadata, targetMessageMetadata])(
		'should return the correct target from the interaction',
		metadata => {
			const mockTarget = { id: '123' };
			const interaction = {
				isUserContextMenuCommand: () => true,
				isMessageContextMenuCommand: () => true,
				targetUser: mockTarget,
				targetMember: mockTarget,
				targetMessage: mockTarget
			};
			const discovery = { isInteractionCreate: () => true };
			const ctx = createMockContext(interaction, discovery);
			const factory = getFactory(metadata);
			expect(factory(undefined, ctx)).toBe(mockTarget);
		}
	);
});
