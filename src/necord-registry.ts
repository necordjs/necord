import { Client, Collection } from "discord.js";
import { Injectable } from "@nestjs/common";
import {
	ApplicationCommandMetadata,
	ComponentMetadata,
	ContextMenuMetadata,
	ListenerMetadata, ModalMetadata,
	SlashCommandMetadata,
	TextCommandMetadata
} from "./interfaces";
import { NecordInfoType } from "./context";

@Injectable()
export class NecordRegistry {
	private static readonly GENERATE_KEY = (...args: any[]) => args.map(String).join(":");

	private readonly textCommands = new Collection<string, TextCommandMetadata>();

	private readonly messageComponents = new Collection<string, ComponentMetadata>();

	private readonly applicationCommands = new Collection<string, ApplicationCommandMetadata>();

	private readonly applicationCommandsData: ApplicationCommandMetadata[] = [];

	private readonly modals = new Collection<string, ModalMetadata>();

	public constructor(private readonly client: Client) {
	}

	public registerListeners(listeners: ListenerMetadata[]) {
		listeners.forEach(listener => {
			this.client[listener.type]<any>(listener.event, (...args) =>
				listener.metadata.execute(args, null, { type: NecordInfoType.LISTENER })
			);
		});
	}

	public addModals(modals: ModalMetadata[]) {
		modals.forEach(modal => this.modals.set(modal.customId, modal));
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

	public addApplicationCommands(appCommands: ApplicationCommandMetadata[]) {
		const recursive = (command: ApplicationCommandMetadata, tree) => {
			const options = "options" in command ? command.options : [];

			options.every(option => option.type !== 1 && option.type !== 2)
				? this.applicationCommands.set(NecordRegistry.GENERATE_KEY(...tree), command)
				: options.map((command: any) => recursive(command, tree.concat(command.name)));
		};

		appCommands.forEach(command => recursive(command, [command.type, command.name]));

		this.applicationCommandsData.push(...appCommands);
	}

	public getApplicationCommands() {
		return this.applicationCommandsData;
	}

	public getContextMenu(type: "USER" | "MESSAGE", name: string): ContextMenuMetadata {
		return this.applicationCommands.get(NecordRegistry.GENERATE_KEY(type, name)) as any;
	}

	public getSlashCommand(...args: string[]): SlashCommandMetadata {
		return this.applicationCommands.get(NecordRegistry.GENERATE_KEY(1, ...args)) as any;
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

	public getMessageComponent(componentType: ComponentMetadata["type"], customId: string) {
		return this.messageComponents.get(NecordRegistry.GENERATE_KEY(componentType, customId));
	}

	public getButton(customId: string) {
		return this.getMessageComponent("BUTTON", customId);
	}

	public getSelectMenu(customId: string) {
		return this.getMessageComponent("SELECT_MENU", customId);
	}

	public getModal(customId: string) {
		return this.modals.get(customId);
	}
}
