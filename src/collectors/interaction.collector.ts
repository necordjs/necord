import {
	CollectedInteraction,
	Interaction,
	InteractionCollector as DiscordCollector,
	InteractionCollectorOptions
} from 'discord.js';
import { BaseCollector } from './base.collector';

export abstract class InteractionCollector<
	T extends CollectedInteraction = CollectedInteraction
> extends BaseCollector<Interaction, InteractionCollectorOptions<T>> {
	protected abstract filter(original: Interaction, interaction: Interaction): boolean;

	protected abstract collect(original: Interaction, interaction: Interaction): void;

	protected ignore(original: Interaction, interaction: Interaction): void {}

	protected dispose(original: Interaction, interaction: Interaction): void {}

	protected getDiscordCollector(original: Interaction, options: InteractionCollectorOptions<T>) {
		return new DiscordCollector(original.client) as any;
	}
}
