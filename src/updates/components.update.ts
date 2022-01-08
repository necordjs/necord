import { Injectable } from '@nestjs/common';
import { ContextOf } from '../interfaces';
import { Context, On } from '../decorators';
import { NecordRegistry } from '../necord-registry';

@Injectable()
export class ComponentsUpdate {
	public constructor(private readonly registry: NecordRegistry) {}

	@On('interactionCreate')
	public onInteractionCreate(@Context() [interaction]: ContextOf<'interactionCreate'>) {
		if (!interaction.isMessageComponent()) return;

		return this.registry
			.getMessageComponent(interaction.componentType, interaction.customId)
			?.metadata.execute(
				[interaction],
				interaction.isSelectMenu() ? interaction.values : undefined
			);
	}
}
