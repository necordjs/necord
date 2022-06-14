import { Injectable, OnApplicationBootstrap, OnModuleInit } from '@nestjs/common';
import { Client } from 'discord.js';
import { ExplorerService } from '../necord-explorer.service';
import { MessageComponentDiscovery } from './message-component.discovery';
import { MESSAGE_COMPONENT_METADATA } from '../necord.constants';

// TODO: Support path-to-regexp https://github.com/necordjs/necord/issues/279
@Injectable()
export class MessageComponentsService implements OnModuleInit, OnApplicationBootstrap {
	private readonly componentsMap = new Map<string, MessageComponentDiscovery>();

	public constructor(
		private readonly client: Client,
		private readonly explorerService: ExplorerService<MessageComponentDiscovery>
	) {}

	public onModuleInit() {
		return this.explorerService
			.explore(MESSAGE_COMPONENT_METADATA)
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
