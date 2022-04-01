import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { NecordExecutionContext } from '../context';
import { Interaction, PermissionResolvable } from 'discord.js';

@Injectable()
export class MemberPermissionsGuard implements CanActivate {
	public constructor(private readonly permissions: PermissionResolvable) {}

	public canActivate(context: ExecutionContext): boolean {
		const necordContext = NecordExecutionContext.create(context);
		const [interaction] = necordContext.getContext<'interactionCreate'>();

		if (!(interaction instanceof Interaction)) return true;

		return interaction.memberPermissions.has(this.permissions);
	}
}
