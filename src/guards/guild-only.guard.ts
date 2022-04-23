import { Injectable, UseGuards } from '@nestjs/common';
import { Interaction } from 'discord.js';
import { BaseGuard } from './base.guard';
import { Observable } from 'rxjs';
import { NecordExecutionContext } from '../context';

@Injectable()
export class GuildOnlyGuard extends BaseGuard {
	public constructor() {
		super(true);
	}

	public checkPermissions(
		context: NecordExecutionContext,
		interaction: Interaction
	): boolean | Promise<boolean> | Observable<boolean> {
		return true;
	}
}

export const GuildOnly = () => UseGuards(GuildOnlyGuard);
