import { Inject, Module, OnModuleInit } from '@nestjs/common';
import { DiscoveryModule, DiscoveryService } from '@golevelup/nestjs-discovery';
import { Client } from 'discord.js';
import { MESSAGE_COMPONENT_METADATA, MESSAGE_COMPONENTS } from './message-components.constants';
import { MessageComponentDiscovery, ComponentMeta } from './message-component.discovery';
import { MessageComponentsProvider } from './message-components.provider';
import { TreeService } from '../common';

@Module({
	imports: [DiscoveryModule],
	providers: [MessageComponentsProvider],
	exports: [MessageComponentsProvider]
})
export class MessageComponentsModule implements OnModuleInit {
	public constructor(
		private readonly discoveryService: DiscoveryService,
		private readonly client: Client,
		@Inject(MESSAGE_COMPONENTS)
		private readonly components: TreeService<MessageComponentDiscovery>
	) {}

	public async onModuleInit() {
		await this.discoveryService
			.providerMethodsWithMetaAtKey<ComponentMeta>(MESSAGE_COMPONENT_METADATA)
			.then(methods => methods.map(m => new MessageComponentDiscovery(m)))
			.then(discovered =>
				discovered.forEach(d =>
					this.components.add([d.getComponentType(), d.getCustomId()], d)
				)
			);

		this.client.on('interactionCreate', interaction => {
			if (!interaction.isMessageComponent()) return;

			return this.components
				.find([interaction.componentType, interaction.customId])
				?.execute(interaction);
		});
	}
}
