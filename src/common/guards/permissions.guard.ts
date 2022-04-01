import { Injectable } from '@nestjs/common';
import { Interaction, PermissionResolvable } from 'discord.js';
import { BaseGuard } from './base.guard';
import { NecordExecutionContext } from '../../context';
import { Observable } from 'rxjs';
import { CommandException, CommandExceptionType } from '../exceptions';

@Injectable()
export class BotPermissionsGuard extends BaseGuard {
	public constructor(private readonly permissions: PermissionResolvable) {
		super(true);
	}

	public checkPermissions(
		context: NecordExecutionContext,
		interaction: Interaction
	): boolean | Promise<boolean> | Observable<boolean> {
		if (interaction.guild.me.permissions.has(this.permissions)) return true;

		throw new CommandException(CommandExceptionType.BOT_PERMISSIONS, {
			missing: interaction.guild.me.permissions.missing(this.permissions)
		});
	}
}

@Injectable()
export class MemberPermissionsGuard extends BaseGuard {
	public constructor(private readonly permissions: PermissionResolvable) {
		super(true);
	}

	public checkPermissions(
		context: NecordExecutionContext,
		interaction: Interaction
	): boolean | Promise<boolean> | Observable<boolean> {
		if (interaction.memberPermissions.has(this.permissions)) return true;

		throw new CommandException(CommandExceptionType.MEMBER_PERMISSIONS, {
			missing: interaction.memberPermissions.missing(this.permissions)
		});
	}
}
