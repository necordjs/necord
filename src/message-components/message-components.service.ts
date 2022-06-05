import { Injectable, OnApplicationBootstrap, OnModuleInit } from '@nestjs/common';
import { Client } from 'discord.js';
import { NecordExplorerService } from '../necord-explorer.service';
import { MessageComponentDiscovery } from './message-component.discovery';
import { MESSAGE_COMPONENT_METADATA } from '../necord.constants';

@Injectable()
export class MessageComponentsService implements OnModuleInit, OnApplicationBootstrap {
	private readonly componentsMap = new Map<string, MessageComponentDiscovery>();

	public constructor(
		private readonly client: Client,
		private readonly explorerService: NecordExplorerService
	) {}

	public onModuleInit() {
		return this.explorerService.explore(
			MESSAGE_COMPONENT_METADATA,
			MessageComponentDiscovery,
			component =>
				this.componentsMap.set(
					[component.getComponentType(), component.getCustomId()].join(':'),
					component
				)
		);
	}

	public onApplicationBootstrap() {
		return this.client.on('interactionCreate', interaction => {
			if (!interaction.isMessageComponent()) return;

			return this.componentsMap
				.get([interaction.componentType, interaction.customId].join(':'))
				?.execute(interaction);
		});
	}
}
