import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Interaction, Snowflake } from 'discord.js';
import { NecordExecutionContext } from '../context';

@Injectable()
export class HasRoleGuard implements CanActivate {
	public constructor(private readonly roles: Snowflake[]) {}

	public async canActivate(context: ExecutionContext): Promise<boolean> {
		const necordContext = NecordExecutionContext.create(context);
		const [interaction] = necordContext.getContext<'interactionCreate'>();

		if (!(interaction instanceof Interaction)) return true;

		if (!interaction.inGuild()) return true;

		const member = await interaction.guild.members.fetch(interaction.user.id);

		return member.roles.cache.hasAny(...this.roles);
	}
}
