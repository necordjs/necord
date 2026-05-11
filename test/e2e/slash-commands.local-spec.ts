import { CommandInteraction } from 'discord.js';

import { createCommandGroupDecorator, Ctx, Opts, Subcommand } from '../../src';
import { createApplication } from './utils.local-spec';
import { LengthDto } from './dto/length.dto';

const UtilsCommands = createCommandGroupDecorator({
	name: 'utils',
	description: 'Test group',
	guilds: [process.env.DISCORD_TEST_GUILD]
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
