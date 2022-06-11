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
		return this.explorerService
			.exploreMethods<MessageComponentDiscovery>(MESSAGE_COMPONENT_METADATA)
			.forEach(component =>
				this.componentsMap.set(
					[component.getType(), component.getCustomId()].join(':'),
					component
				)
			);
	}

	public onApplicationBootstrap() {
		return this.client.on('interactionCreate', interaction => {
			if (!interaction.isButton() && !interaction.isSelectMenu()) return;

			return this.componentsMap
				.get([interaction.componentType, interaction.customId].join(':'))
				?.execute(interaction);
		});
	}
}
