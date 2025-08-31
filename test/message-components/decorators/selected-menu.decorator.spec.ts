import {
	ChannelSelect,
	MentionableSelect,
	MessageComponent,
	MessageComponentDiscovery,
	ModalDiscovery,
	RoleSelect,
	StringSelect,
	UserSelect
} from '../../../src';
import { ComponentType } from 'discord-api-types/v10';

describe('Selected Menu Decorators', () => {
	describe.each([
		['@StringSelect', StringSelect],
		['@ChannelSelect', ChannelSelect],
		['@UserSelect', UserSelect],
		['@MentionableSelect', MentionableSelect],
		['@RoleSelect', RoleSelect]
	])('%s', (decoratorName, decorator) => {
		class Test {
			@decorator('test')
			public execute() {
				return 'Executed';
			}
		}

		it('should be defined', () => {
			expect(decorator).toBeDefined();
		});

		it('should create a select menu with the correct properties', () => {
			const metadata: MessageComponentDiscovery = Reflect.getMetadata(
				MessageComponent.KEY,
				Test.prototype['execute']
			);

			expect(metadata).toBeInstanceOf(MessageComponentDiscovery);
			expect(metadata.getCustomId()).toBe('test');
			expect(metadata.getType()).toBe(ComponentType[decorator.name]);
		});
	});
});
