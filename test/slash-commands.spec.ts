import { createApplication } from './utils.spec';
import { Cooldown, Ctx, Opts, SlashCommand, SlashGroup, UserPermissions } from '../src';
import { CommandInteraction } from 'discord.js';
import { LengthDto } from './dto/length.dto';

@UserPermissions({
	id: '235413185639874561',
	permission: false
})
@Cooldown(15)
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
};

bootstrap();
