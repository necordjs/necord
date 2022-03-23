import { Inject, Module, OnModuleInit } from '@nestjs/common';
import { DiscoveryModule, DiscoveryService } from '@golevelup/nestjs-discovery';
import { Client } from 'discord.js';
import { MESSAGE_COMPONENT_METADATA, MESSAGE_COMPONENTS } from './components.constants';
import { ComponentDiscovery, ComponentMeta } from './component.discovery';
import { ComponentsProvider } from './components.provider';

@Module({
	imports: [DiscoveryModule],
	providers: [ComponentsProvider],
	exports: [ComponentsProvider]
})
export class ComponentsModule implements OnModuleInit {
	public constructor(
		private readonly discoveryService: DiscoveryService,
		private readonly client: Client,
		@Inject(MESSAGE_COMPONENTS)
		private readonly components: Map<string, ComponentDiscovery>
	) {}

	public async onModuleInit() {
		await this.discoveryService
			.providerMethodsWithMetaAtKey<ComponentMeta>(MESSAGE_COMPONENT_METADATA)
			.then(methods => methods.map(m => new ComponentDiscovery(m)))
			.then(discovered => discovered.map(d => this.components.set(d.getKey(), d)));

		this.client.on('interactionCreate', interaction => {
			if (!interaction.isMessageComponent()) return;

			return this.components
				.get([interaction.componentType, interaction.customId].join(':'))
				?.execute(interaction);
		});
	}
}
