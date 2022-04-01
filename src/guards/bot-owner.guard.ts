import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Client, Interaction } from 'discord.js';
import { NecordExecutionContext } from '../context';

@Injectable()
export class BotOwnerGuard implements CanActivate {
	public constructor(private readonly client: Client) {}

	public canActivate(context: ExecutionContext): boolean | Promise<boolean> {
		const necordContext = NecordExecutionContext.create(context);
		const [interaction] = necordContext.getContext<'interactionCreate'>();

		if (!(interaction instanceof Interaction)) return true;

		return this.client.application.owner.id === interaction.user.id;
	}
}
