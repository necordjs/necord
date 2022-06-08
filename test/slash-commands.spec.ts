import { createApplication } from './utils.spec';
import { AdminOnly, Ctx, GuildOnly, Opts, SlashCommand, SlashGroup } from '../src';
import { CommandInteraction } from 'discord.js';
import { LengthDto } from './dto/length.dto';

@AdminOnly
@GuildOnly
@SlashGroup({ name: 'utils', description: 'Test group' })
export class SlashCommandsSpec {
	@SlashGroup({ name: 'string', description: 'Test Sub Group' })
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
