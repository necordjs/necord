import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { AutocompleteContext, NecordExecutionContext } from '../../../context';
import { AutocompleteInteraction, InteractionType } from 'discord.js';

@Injectable()
export abstract class AutocompleteInterceptor implements NestInterceptor {
	public abstract transformOptions(interaction: AutocompleteInteraction): void | Promise<void>;

	public async intercept(
		context: ExecutionContext,
		next: CallHandler<any>
	): Promise<Observable<any>> {
		const necordContext = NecordExecutionContext.create(context);
		const [interaction] = necordContext.getContext<AutocompleteContext>();
		const discovery = necordContext.getDiscovery();

		if (
			interaction.type !== InteractionType.ApplicationCommandAutocomplete ||
			!discovery.isSlashCommand()
		)
			return next.handle();

		return of(this.transformOptions(interaction));
	}
}
