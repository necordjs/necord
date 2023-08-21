import { Injectable, Logger } from '@nestjs/common';
import { Client, Collection } from 'discord.js';
import { ExplorerService } from '../necord-explorer.service';
import { MessageComponentDiscovery, MessageComponentMeta } from './message-component.discovery';
import { MessageComponent } from './decorators';

@Injectable()
export class MessageComponentsService {
	private readonly logger = new Logger(MessageComponentsService.name);

	public readonly cache = new Collection<string, MessageComponentDiscovery>();

	public constructor(
		private readonly client: Client,
		private readonly explorerService: ExplorerService<MessageComponentDiscovery>
	) {}

	private onModuleInit() {
		return this.explorerService
			.explore(MessageComponent.KEY)
			.forEach(component => this.add(component));
	}

	private onApplicationBootstrap() {
		return this.client.on('interactionCreate', interaction => {
			if (!interaction.isMessageComponent()) return;

			return this.get(interaction.componentType, interaction.customId)?.execute(interaction);
		});
	}

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
