import { createApplication } from './utils.spec';
import { Cooldown, Ctx, Guilds, Locals, Opts, SlashCommand, SlashGroup } from '../src';
import { CommandInteraction } from 'discord.js';
import { LengthDto } from './dto/length.dto';

@Guilds('742715858157043793')
@Cooldown(15)
@SlashGroup('utils', 'Test group')
export class SlashCommandsSpec {
	@SlashGroup('string', 'Test Sub Group')
	@SlashCommand('length', 'Get length of your text')
	public onLength(
		@Ctx() [interaction]: [CommandInteraction],
		@Opts() { text }: LengthDto,
		@Locals() locals
	) {
		console.log(locals);
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
	const app = await createApplication(SlashCommandsSpec, SlashCommandsSpec);
};

bootstrap();
