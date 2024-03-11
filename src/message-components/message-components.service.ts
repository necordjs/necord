import { Injectable, Logger } from '@nestjs/common';
import { Collection } from 'discord.js';
import { MessageComponentDiscovery, MessageComponentMeta } from './message-component.discovery';

/**
 * Service that manages message components.
 */
@Injectable()
export class MessageComponentsService {
	private readonly logger = new Logger(MessageComponentsService.name);

	public readonly cache = new Collection<string, MessageComponentDiscovery>();

	private componentName(
		type: MessageComponentMeta['type'],
		customId: MessageComponentMeta['customId']
	): string {
		return [type, customId].join('_');
	}

	public add(component: MessageComponentDiscovery) {
		const name = this.componentName(component.getType(), component.getCustomId());

		if (this.cache.has(name)) {
			this.logger.warn(`Message Component : ${name} already exists`);
		}

		this.cache.set(name, component);
	}

	public get(type: MessageComponentMeta['type'], customId: MessageComponentMeta['customId']) {
		for (const component of this.cache.values()) {
			if (component.matcher(this.componentName(type, customId))) {
				return component;
			}
		}

		return null;
	}

	public remove(type: MessageComponentMeta['type'], customId: MessageComponentMeta['customId']) {
		this.cache.delete(this.componentName(type, customId));
	}
}
