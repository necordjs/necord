import { Injectable, UseGuards } from '@nestjs/common';
import { Client, Interaction } from 'discord.js';
import { Observable } from 'rxjs';
import { BaseGuard, CommandException, CommandExceptionType } from './base.guard';
import { NecordExecutionContext } from '../context';

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

export const BotOwner = () => UseGuards(BotOwnerGuard);

export const GuildOwner = () => UseGuards(GuildOwnerGuard);
