import { createApplication } from './utils.spec';
import { createCommandGroup, Ctx, Opts, SlashCommand } from '../src';
import { CommandInteraction } from 'discord.js';
import { LengthDto } from './dto/length.dto';

const UtilsCommands = createCommandGroup({ name: 'utils', description: 'Test group' });

@UtilsCommands()
export class SlashCommandsSpec {
	@SlashCommand({ name: 'length', description: 'Get length of your text' })
	public onLength(@Ctx() [interaction]: [CommandInteraction], @Opts() { text }: LengthDto) {
		return interaction.reply({
			content: 'Your message length - ' + text.length
		});
	}

	@SlashCommand({ name: 'ping', description: 'Ping-pong command' })
	public onPing(@Ctx() [interaction]: [CommandInteraction]) {
		return interaction.reply({
			content: 'Pong!'
		});
	}
}

createApplication(SlashCommandsSpec);
