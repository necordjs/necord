import {
	ContextMenuCommandInteraction,
	MessageApplicationCommandData,
	UserApplicationCommandData
} from 'discord.js';
import { CommandDiscovery } from '../command.discovery';

export type ContextMenuMeta = MessageApplicationCommandData | UserApplicationCommandData;

export class ContextMenuDiscovery extends CommandDiscovery<ContextMenuMeta> {
	public getContextType() {
		return this.meta.type;
	}

	public getName() {
		return this.meta.name;
	}

	public isContextMenu(): this is ContextMenuDiscovery {
		return true;
	}

	public execute(interaction: ContextMenuCommandInteraction): any {
		return super.execute(
			[interaction]
			// ApplicationCommandType.User === this.getContextType()
			// 	? {
			// 		user: interaction.options.getUser('user', false),
			// 		member: interaction.options.getMember('user')
			// 	}
			// 	: { message: interaction.optiosns.getMessage('message', false) }
		);
	}

	public override toJSON() {
		return this.meta;
	}
}
