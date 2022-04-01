import { Injectable } from '@nestjs/common';
import { Client, Interaction } from 'discord.js';
import { NecordExecutionContext } from '../../context';
import { BaseGuard } from './base.guard';
import { Observable } from 'rxjs';
import { CommandException, CommandExceptionType } from '../exceptions';

@Injectable()
export class BotOwnerGuard extends BaseGuard {
	public constructor(private readonly client: Client) {
		super(false);
	}

	public checkPermissions(
		context: NecordExecutionContext,
		interaction: Interaction
	): boolean | Promise<boolean> | Observable<boolean> {
		if (this.client.application.owner.id === interaction.user.id) return true;

		throw new CommandException(CommandExceptionType.BOT_OWNER);
	}
}

@Injectable()
export class GuildOwnerGuard extends BaseGuard {
	public constructor() {
		super(true);
	}

	public checkPermissions(
		context: NecordExecutionContext,
		interaction: Interaction
	): boolean | Promise<boolean> | Observable<boolean> {
		if (interaction.guild.ownerId === interaction.user.id) return true;

		throw new CommandException(CommandExceptionType.GUILD_OWNER);
	}
}
