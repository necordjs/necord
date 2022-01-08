import { Injectable } from '@nestjs/common';
import { ContextOf } from '../interfaces';
import { Context, On } from '../decorators';
import { NecordRegistry } from '../necord-registry';

@Injectable()
export class ContextMenusUpdate {
	public constructor(private readonly registry: NecordRegistry) {}

	@On('interactionCreate')
	private onInteractionCreate(@Context() [interaction]: ContextOf<'interactionCreate'>) {
		if (!interaction.isContextMenu()) return;

		const options = interaction.isUserContextMenu()
			? {
					user: interaction.options.getUser('user', false),
					member: interaction.options.getMember('user', false)
			  }
			: { message: interaction.options.getMessage('message', false) };

		return this.registry
			.getContextMenu(interaction.targetType, interaction.commandName)
			?.metadata.execute([interaction], options);
	}
}
