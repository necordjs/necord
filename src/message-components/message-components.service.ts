import { Injectable, OnApplicationBootstrap, OnModuleInit } from '@nestjs/common';
import { Client, InteractionType } from 'discord.js';
import { ExplorerService } from '../necord-explorer.service';
import { MessageComponentDiscovery } from './message-component.discovery';
import { MESSAGE_COMPONENT_METADATA } from '../necord.constants';

@Injectable()
export class MessageComponentsService implements OnModuleInit, OnApplicationBootstrap {
	private readonly components: MessageComponentDiscovery[] = [];

	public constructor(
		private readonly client: Client,
		private readonly explorerService: ExplorerService<MessageComponentDiscovery>
	) {}

	public onModuleInit() {
		return this.explorerService
			.explore(MESSAGE_COMPONENT_METADATA)
			.forEach(component => this.components.push(component));
	}

	public onApplicationBootstrap() {
		return this.client.on('interactionCreate', interaction => {
			if (interaction.type !== InteractionType.MessageComponent) return;

			const name = [interaction.componentType, interaction.customId].join('_');

			for (const component of this.components) {
				if (component.matcher(name)) {
					return component.execute(interaction);
				}
			}
		});
	}
}
