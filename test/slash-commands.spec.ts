import * as assert from 'node:assert';
import { createApplication, DevGuild } from './utils.spec';
import { Ctx, NecordRegistry, Opts, SlashCommand, SlashCommandMetadata, SlashGroup } from '../src';
import { CommandInteraction } from 'discord.js';
import { LengthDto } from './dto/length.dto';

@DevGuild
@SlashGroup('utils', 'Test group')
export class SlashCommandsSpec {
	@SlashGroup('string', 'Test Sub Group')
	@SlashCommand('length', 'Get length of your text')
	public onLength(@Ctx() [interaction]: [CommandInteraction], @Opts() { text }: LengthDto) {
		return interaction.reply({
			content: 'Your message length - ' + text.length
		});
	}

	@SlashCommand('ping', 'Ping-pong command')
	public onPing(@Ctx() [interaction]: [CommandInteraction]) {
		return interaction.reply({
			content: 'Pong!'
		});
	}
}

const bootstrap = async () => {
	const app = await createApplication(SlashCommandsSpec);
	const registry = app.get(NecordRegistry);

	const group: SlashCommandMetadata = registry.getApplicationCommands()[0] as any;

	assert.strictEqual(registry.getApplicationCommands().length, 1);
	assert.strictEqual(group.type, 1);
	assert.strictEqual(group.name, 'utils');
	assert.strictEqual(group.description, 'Test group');
	assert.strictEqual(group.options.length, 2);

	const [subGroup, subCommand] = group.options;

	if (subGroup.type === 2) {
		assert.strictEqual(subGroup.type, 2);
		assert.strictEqual(subGroup.name, 'string');
		assert.strictEqual(subGroup.description, 'Test Sub Group');
		assert.strictEqual(subGroup.options.length, 1);
		assert.notStrictEqual(
			registry.getSlashCommand(group.name, subGroup.name, subGroup.options[0].name),
			undefined
		);
	}

	if (subCommand.type === 1) {
		assert.strictEqual(subCommand.type, 1);
		assert.strictEqual(subCommand.name, 'ping');
		assert.strictEqual(subCommand.description, 'Ping-pong command');
		assert.notStrictEqual(registry.getSlashCommand(group.name, subCommand.name), undefined);
	}
};

bootstrap();
