import { CanActivate, ExecutionContext } from '@nestjs/common';
import { NecordExecutionContext } from '../../context';
import { Interaction } from 'discord.js';
import { Observable } from 'rxjs';
import { NecordException } from '../exceptions';
import { CommandException } from '../enums/command-exception.enum';

export abstract class BaseGuard implements CanActivate {
	protected constructor(private readonly isGuildOnly: boolean = false) {}

	public canActivate(
		context: ExecutionContext
	): boolean | Promise<boolean> | Observable<boolean> {
		const necordContext = NecordExecutionContext.create(context);
		const [interaction] = necordContext.getContext<'interactionCreate'>();

		if (necordContext.getDiscovery().isListener()) return true;

		if (!interaction.inGuild() && this.isGuildOnly)
			throw new NecordException(CommandException.GUILD_ONLY);

		return this.checkPermissions(necordContext, interaction);
	}

	public abstract checkPermissions(
		context: NecordExecutionContext,
		interaction: Interaction
	): boolean | Promise<boolean> | Observable<boolean>;
}
