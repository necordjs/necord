import { Inject, Injectable, Logger } from '@nestjs/common';
import { NECORD_MODULE_OPTIONS, NecordModuleOptions } from './necord-options';

@Injectable()
export class NecordUpdate {
	private readonly logger = new Logger(NecordUpdate.name);

	public constructor(
		@Inject(NECORD_MODULE_OPTIONS)
		private readonly options: NecordModuleOptions
	) {}

	// @Once('ready')
	// private async onReady(@Context() [client]: ContextOf<'ready'>) {
	// 	if (client.application.partial) {
	// 		await client.application.fetch();
	// 	}
	//
	// 	const clientCommands = client.application.commands;
	// 	const commandsByGuildMap = new Map<string, ApplicationCommandMetadata[]>([[undefined, []]]);
	//
	// 	for (const command of this.registry.getApplicationCommands()) {
	// 		const defaultGuild = Array.isArray(this.options.development)
	// 			? this.options.development
	// 			: [undefined];
	//
	// 		for (const guild of command.metadata[GUILDS_METADATA] ?? defaultGuild) {
	// 			const visitedCommands = commandsByGuildMap.get(guild) ?? [];
	// 			commandsByGuildMap.set(guild, visitedCommands.concat(command));
	// 		}
	// 	}
	//
	// 	this.logger.log(`Started refreshing application commands.`);
	// 	for (const [guild, commands] of commandsByGuildMap.entries()) {
	// 		const registeredCommands = await clientCommands.set(commands, guild);
	//
	// 		if (!guild) continue;
	//
	// 		await clientCommands.permissions.set({
	// 			guild,
	// 			fullPermissions: commands.map(command => ({
	// 				id: registeredCommands.find(x => x.name === command.name).id,
	// 				permissions: command.metadata[PERMISSIONS_METADATA] ?? []
	// 			}))
	// 		});
	// 	}
	// 	this.logger.log(`Successfully reloaded application commands.`);
	// }
}
