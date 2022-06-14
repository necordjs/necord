import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { AutocompleteContext, NecordExecutionContext } from '../../../context';
import { ModuleRef, Reflector } from '@nestjs/core';
import { AUTOCOMPLETE_METADATA } from '../../../necord.constants';
import { AutocompleteMeta } from './autocomplete.decorator';
import { InteractionType } from 'discord.js';

// TODO: Make Service instead Interceptor
@Injectable()
export class AutocompleteInterceptor implements NestInterceptor {
	public constructor(
		private readonly moduleRef: ModuleRef,
		private readonly reflector: Reflector
	) {}

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

		const autocompletes = this.reflector
			.getAllAndOverride<AutocompleteMeta>(AUTOCOMPLETE_METADATA, [discovery.getHandler()])
			.map(meta => this.moduleRef.get(meta));

		for (const autocomplete of autocompletes) {
			const options = await autocomplete.transformOptions(
				interaction,
				interaction.options.getFocused(true)
			);

			if (!options || !Array.isArray(options)) continue;

			return of(interaction.respond(options));
		}

		return of(interaction.respond([]));
	}
}
