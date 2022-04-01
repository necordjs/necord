import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Interaction } from 'discord.js';
import { NecordExecutionContext } from '../context';

@Injectable()
export class GuildOwnerGuard implements CanActivate {
	public canActivate(context: ExecutionContext): boolean {
		const necordContext = NecordExecutionContext.create(context);
		const [interaction] = necordContext.getContext<'interactionCreate'>();

		if (!(interaction instanceof Interaction)) return true;

		if (interaction.inGuild()) return true;

		return interaction.guild.ownerId === interaction.user.id;
	}
}
