import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { AutocompleteInteraction } from 'discord.js';
import { Observable, of } from 'rxjs';

import { AutocompleteContext, NecordExecutionContext } from '../../../context';

/**
 * The autocomplete interceptor.
 * @see AutocompleteContext
 * @see AutocompleteInteraction
 * @url https://necord.org/interactions/slash-commands#autocomplete
 */
@Injectable()
export abstract class AutocompleteInterceptor implements NestInterceptor {
	public abstract transformOptions(interaction: AutocompleteInteraction): void | Promise<void>;

	public async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
		const necordContext = NecordExecutionContext.create(context);
		const [interaction] = necordContext.getContext<AutocompleteContext>();
		const discovery = necordContext.getDiscovery();

		if (!interaction.isAutocomplete() || !discovery.isSlashCommand()) return next.handle();

		return of(this.transformOptions(interaction));
	}
}
