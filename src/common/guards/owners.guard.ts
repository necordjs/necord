import { Injectable } from '@nestjs/common';
import { Client, Interaction } from 'discord.js';
import { NecordExecutionContext } from '../../context';
import { NecordException } from '../exceptions';
import { BaseGuard } from './base.guard';
import { Observable } from 'rxjs';
import { CommandException } from '../enums/command-exception.enum';

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

		throw new NecordException(CommandException.BOT_OWNER);
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

		throw new NecordException(CommandException.GUILD_OWNER);
	}
}
