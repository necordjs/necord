import { CommandInteraction } from 'discord.js';

import { createCommandGroupDecorator, Ctx, Opts, Subcommand } from '../../src/index.js';
import { createApplication } from './utils.local-spec.js';
import { LengthDto } from './dto/length.dto.js';

const testGuild = process.env.DISCORD_TEST_GUILD;

if (!testGuild) {
	throw new Error('DISCORD_TEST_GUILD is required to run the local E2E application.');
}

const UtilsCommands = createCommandGroupDecorator({
	name: 'utils',
	description: 'Test group',
	guilds: [testGuild]
});

@UtilsCommands()
export class SlashCommandsLocalSpec {
	@Subcommand({ name: 'length', description: 'Get length of your text' })
	public onLength(@Ctx() [interaction]: [CommandInteraction], @Opts() { text }: LengthDto) {
		return interaction.reply({
			content: 'Your message length - ' + text.length
		});
	}

	@Subcommand({ name: 'ping', description: 'Ping-pong command' })
	public onPing(@Ctx() [interaction]: [CommandInteraction]) {
		return interaction.reply({
			content: 'Pong!'
		});
	}
}

createApplication(SlashCommandsLocalSpec);
