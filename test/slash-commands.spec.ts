import { createApplication } from './utils.spec';
import { Ctx, Opts, SlashCommand, SlashGroup, UserPermissions } from '../src';
import { CommandInteraction } from 'discord.js';
import { LengthDto, TestDto } from './dto/length.dto';

@UserPermissions({
	id: '235413185639874561',
	permission: false
})
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
	public onPing(@Ctx() [interaction]: [CommandInteraction], @Opts() x: TestDto) {
		return interaction.reply({
			content: 'Pong!'
		});
	}
}

const bootstrap = async () => {
	const app = await createApplication(SlashCommandsSpec);
};

bootstrap();
