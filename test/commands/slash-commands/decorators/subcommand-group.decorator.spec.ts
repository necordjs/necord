import {
	SubcommandGroup,
	createCommandGroupDecorator,
	SlashCommandDiscovery,
	Subcommand,
	SlashCommand
} from '../../../../src';

describe('@Subcommand', () => {
	const TestCommands = createCommandGroupDecorator({
		name: 'test-group',
		description: 'Test command group'
	});

	@TestCommands()
	class TestGroup {}

	@TestCommands({ name: 'subgroup', description: 'A subcommand group' })
	class TestSubcommandGroup {}

	it('should add metadata to the class for command group', () => {
		const rootMetadata: SlashCommandDiscovery = Reflect.getMetadata(
			SlashCommand.KEY,
			TestGroup
		);
		expect(rootMetadata).toBeDefined();
		expect(rootMetadata.getName()).toBe('test-group');
		expect(rootMetadata.getDescription()).toBe('Test command group');

		const subGroupMetadata: SlashCommandDiscovery = Reflect.getMetadata(
			SubcommandGroup.KEY,
			TestGroup
		);
		expect(subGroupMetadata).toBeUndefined();
	});

	it('should add metadata to the class for subcommand group', () => {
		const metadata: SlashCommandDiscovery = Reflect.getMetadata(
			SubcommandGroup.KEY,
			TestSubcommandGroup
		);
		expect(metadata).toBeDefined();
		expect(metadata.getName()).toBe('subgroup');
		expect(metadata.getDescription()).toBe('A subcommand group');
	});
});
