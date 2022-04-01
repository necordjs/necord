import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Interaction } from 'discord.js';
import { NecordExecutionContext } from '../context';

@Injectable()
export class GuildOnlyGuard implements CanActivate {
	public canActivate(context: ExecutionContext): boolean {
		const necordContext = NecordExecutionContext.create(context);
		const [interaction] = necordContext.getContext<'interactionCreate'>();

		if (!(interaction instanceof Interaction)) return true;

		return interaction.inGuild();
	}
}
