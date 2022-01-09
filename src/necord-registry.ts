import { ApplicationCommandData, Client, Collection } from 'discord.js';
import { Injectable } from '@nestjs/common';
import {
	ComponentMetadata,
	ContextMenuMetadata,
	ListenerMetadata,
	TextCommandMetadata,
	SlashCommandMetadata
} from './interfaces';

@Injectable()
export class NecordRegistry {
	private static readonly GENERATE_KEY = (...args: any[]) => args.map(String).join(':');

	private readonly textCommands = new Collection<string, TextCommandMetadata>();

	private readonly slashCommands = new Collection<string, SlashCommandMetadata>();

	private readonly contextMenus = new Collection<string, ContextMenuMetadata>();

	private readonly messageComponents = new Collection<string, ComponentMetadata>();

	private readonly applicationCommands: ApplicationCommandData[] = [];

	public constructor(private readonly client: Client) {}

	public registerListeners(listeners: ListenerMetadata[]) {
		listeners.forEach(listener => {
			this.client[listener.type]<any>(listener.event, (...args) =>
				listener.metadata.execute(args)
			);
		});
	}

	public addTextCommands(textCommands: TextCommandMetadata[]) {
		textCommands.forEach(command => this.textCommands.set(command.name, command));
	}

	public getTextCommands() {
		return [...this.textCommands.values()];
	}

	public getTextCommand(name: string) {
		return this.textCommands.get(name);
	}

	public addContextMenus(contextMenus: ContextMenuMetadata[]) {
		contextMenus.forEach(contextMenu =>
			this.contextMenus.set(
				NecordRegistry.GENERATE_KEY(contextMenu.type, contextMenu.name),
				contextMenu
			)
		);

		this.applicationCommands.push(...contextMenus);
	}

	public addSlashCommands(slashCommands: SlashCommandMetadata[]) {
		const recursive = (command: SlashCommandMetadata, tree = [command.name]) => {
			const options = command.options ?? [];

			options.every(option => option.type !== 1 && option.type !== 2)
				? this.slashCommands.set(NecordRegistry.GENERATE_KEY(...tree), command)
				: options.map((command: any) => recursive(command, tree.concat(command.name)));
		};

		slashCommands.forEach(slashCommand => recursive(slashCommand));

		this.applicationCommands.push(...slashCommands);
	}

	public getApplicationCommands() {
		return this.applicationCommands;
	}

	public getContextMenu(type: 'USER' | 'MESSAGE', name: string) {
		return this.contextMenus.get(NecordRegistry.GENERATE_KEY(type, name));
	}

	public getSlashCommand(...args: string[]) {
		return this.slashCommands.get(NecordRegistry.GENERATE_KEY(...args));
	}

	public addMessageComponents(messageComponents: ComponentMetadata[]) {
		messageComponents.forEach(component =>
			this.messageComponents.set(
				NecordRegistry.GENERATE_KEY(component.type, component.customId),
				component
			)
		);
	}

	public getMessageComponents() {
		return [...this.messageComponents.values()];
	}

	public getMessageComponent(componentType: ComponentMetadata['type'], customId: string) {
		return this.messageComponents.get(NecordRegistry.GENERATE_KEY(componentType, customId));
	}

	public getButton(customId: string) {
		return this.getMessageComponent('BUTTON', customId);
	}

	public getSelectMenu(customId: string) {
		return this.getMessageComponent('SELECT_MENU', customId);
	}
}
