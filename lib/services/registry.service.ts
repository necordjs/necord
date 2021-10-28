import { Injectable, Logger } from '@nestjs/common';
import { RestService } from './rest.service';
import { NecordClient } from '../necord-client';
import { ApplicationCommandExecuteMetadata, ExecuteMetadata, ListenerExecuteMetadata } from '../interfaces';
import { ApplicationCommandData, Collection, CommandInteraction, Interaction } from 'discord.js';
import { Routes } from 'discord-api-types';
import { Context, On } from '../decorators';
import { ApplicationCommandTypes } from 'discord.js/typings/enums';

@Injectable()
export class RegistryService {
	private readonly logger = new Logger(RegistryService.name);

	private readonly applicationCommands = new Collection<string, ApplicationCommandExecuteMetadata>();

	public constructor(private readonly restService: RestService, private readonly necordClient: NecordClient) {}

	@On('interactionCreate')
	public async onInteractionCreate(@Context() interaction: Interaction) {
		if (!interaction.isCommand()) return;

		const command = this.getCommand(interaction);

		if (command) {
			command.execute(interaction);
		}
	}

	public registerListener({ event, once, execute, filter }: ListenerExecuteMetadata) {
		this.logger.log(`Registered new listener for event "${event}"`);
		this.necordClient[once ? 'once' : 'on'](event, (...args) =>
			typeof filter === 'function' ? filter(...args) && execute(...args) : execute(...args)
		);
	}

	public async registerApplicationCommands(applicationCommands: Array<ApplicationCommandExecuteMetadata>) {
		try {
			const commands = new Collection<string, ApplicationCommandData>();

			const commandGroups: Record<string, [string, ApplicationCommandExecuteMetadata[]]> = {};

			for (const command of applicationCommands) {
				let commandName;

				if (command.group) {
					const subGroupName = command.subGroup;
					const groupName = command.group;

					const prev = commandGroups[subGroupName]?.[1] ?? [];

					commandGroups[subGroupName] = [groupName, [...prev, command]];
					commandName = `${groupName}-${subGroupName}-${command.name}`;
				} else {
					commandName = command.name;

					const data: ApplicationCommandData = {
						type: command.type,
						name: command.name,
						description:
							command.type === ApplicationCommandTypes.CHAT_INPUT
								? command.description ?? 'Empty description'
								: '',
						options: command.options ?? []
					};

					commands.set(command.name, data);
				}

				this.applicationCommands.set(commandName, command);
			}

			for (const subGroup in commandGroups) {
				const [groupName, cmds] = commandGroups[subGroup];
				const isSubGroup = subGroup !== 'undefined';
				const options = cmds.map(c => ({
					type: 1,
					name: c.name,
					description: c.description ?? 'Empty description',
					options: c.options
				}));

				const applicationData: ApplicationCommandData = commands.get(groupName) ?? {
					type: 1,
					name: groupName,
					description: `${groupName} commands`,
					options: []
				};

				if ('options' in applicationData) {
					applicationData.options = isSubGroup
						? applicationData.options.concat({
								type: 2,
								name: subGroup,
								description: `${subGroup} sub commands`,
								options
						  })
						: applicationData.options.concat(options);
				}

				commands.set(groupName, applicationData);
			}

			await this.restService.put(Routes.applicationGuildCommands('747038640571416666', '580747890272763964'), {
				body: [...commands.values()]
			});
		} catch (err) {
			console.error(err);
		}
	}

	private getCommand(interaction: CommandInteraction) {
		let command: string;

		const commandName = interaction.commandName;
		const group = interaction.options.getSubcommandGroup(false);
		const subCommand = interaction.options.getSubcommand(false);

		if (subCommand) {
			if (group) {
				command = `${commandName}-${group}-${subCommand}`;
			} else {
				command = `${commandName}-undefined-${subCommand}`;
			}
		} else {
			command = commandName;
		}

		return this.applicationCommands.get(command);
	}
}
