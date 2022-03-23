import { Injectable } from '@nestjs/common';
import { MetadataScanner, Reflector } from '@nestjs/core';

@Injectable()
export class NecordExplorer {
	public constructor(
		private readonly metadataScanner: MetadataScanner,
		private readonly reflector: Reflector
	) {}

	public explore() {
		// const appCommands = this.flatMap(wrapper => {
		// 	const commandGroup = this.filterProvider<SlashCommandMeta>(
		// 		wrapper,
		// 		SLASH_GROUP_METADATA
		// 	);
		//
		// 	const subGroups = new Collection<string, any>();
		// 	const subCommands = [];
		// 	const commands = [];
		//
		// 	const metadataKey = CONTEXT_MENU_METADATA;
		// 	const optionalKeys: OptionMetadata[] = [SLASH_GROUP_METADATA];
		//
		// 	// for (const command of this.filterProperties(wrapper, metadataKey, optionalKeys)) {
		// 	// 	command.options = Object.values(command.metadata[OPTIONS_METADATA] ?? []);
		// 	//
		// 	// 	if (!commandGroup || command.type !== 1) {
		// 	// 		commands.push(command);
		// 	// 		continue;
		// 	// 	}
		// 	//
		// 	// 	const subGroup = command.metadata[SLASH_GROUP_METADATA];
		// 	//
		// 	// 	subGroup
		// 	// 		? subGroups.ensure(subGroup.name, () => subGroup).options.push(command)
		// 	// 		: subCommands.push(command);
		// 	// }
		//
		// 	if (commandGroup) {
		// 		// commandGroup.metadata = this.extractOptionalMetadata(
		// 		// 	[GUILDS_METADATA, PERMISSIONS_METADATA],
		// 		// 	wrapper.instance
		// 		// );
		//
		// 		commandGroup.options = [...subGroups.values(), ...subCommands];
		// 	}
		//
		// 	return commands.concat(commandGroup);
		// });
		//
		// return {
		// 	appCommands
		// };
	}
}
