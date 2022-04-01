import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Interaction, Snowflake } from 'discord.js';
import { NecordExecutionContext } from '../context';

@Injectable()
export class IsUserGuard implements CanActivate {
	public constructor(private readonly users: Snowflake[]) {}

	public canActivate(context: ExecutionContext): boolean | Promise<boolean> {
		const necordContext = NecordExecutionContext.create(context);
		const [interaction] = necordContext.getContext<'interactionCreate'>();

		if (!(interaction instanceof Interaction)) return true;

		return this.users.includes(interaction.member.user.id);
	}
}
