import { Injectable, Logger, OnApplicationBootstrap, OnModuleInit } from '@nestjs/common';
import { Client, InteractionType } from 'discord.js';
import { ExplorerService } from '../necord-explorer.service';
import { MessageComponentDiscovery, MessageComponentMeta } from './message-component.discovery';
import { MESSAGE_COMPONENT_METADATA } from '../necord.constants';

@Injectable()
export class MessageComponentsService implements OnModuleInit, OnApplicationBootstrap {
	private readonly logger = new Logger(MessageComponentsService.name);
	private readonly components = new Map<string, MessageComponentDiscovery>();

	public constructor(
		private readonly client: Client,
		private readonly explorerService: ExplorerService<MessageComponentDiscovery>
	) {}

	public onModuleInit() {
		return this.explorerService
			.explore(MESSAGE_COMPONENT_METADATA)
			.forEach(component => this.add(component));
	}

	public onApplicationBootstrap() {
		return this.client.on('interactionCreate', interaction => {
			if (interaction.type !== InteractionType.MessageComponent) return;

			const name = this.componentName(interaction.componentType, interaction.customId);

			for (const component of this.components.values()) {
				if (component.matcher(name)) {
					return component.execute(interaction);
				}
			}
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
		
		if (this.components.has(name)) {
			this.logger.warn(`Message Component : ${name} already exists`);
		}
		
		this.components.set(name, component);
	}

	public remove(type: MessageComponentMeta['type'], customId: MessageComponentMeta['customId']) {
		this.components.delete(this.componentName(type, customId));
	}
}
