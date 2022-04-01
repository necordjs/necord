import { Injectable } from '@nestjs/common';
import { Interaction } from 'discord.js';
import { NecordExecutionContext } from '../../context';
import { BaseGuard } from './base.guard';
import { Observable } from 'rxjs';

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
