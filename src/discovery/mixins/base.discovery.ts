import { Reflector } from '@nestjs/core';
import { ContextMenuDiscovery } from '../context-menu.discovery';
import { SlashCommandDiscovery } from '../slash-command.discovery';
import { ComponentDiscovery } from '../component.discovery';
import { ListenerDiscovery } from '../listener.discovery';
import { TextCommandDiscovery } from '../text-command.discovery';

export enum DiscoveryType {
	LISTENER,
	SLASH_COMMAND,
	CONTEXT_MENU,
	MESSAGE_COMPONENT,
	TEXT_COMMAND
}

export abstract class BaseDiscovery {
	protected readonly reflector = new Reflector();

	protected abstract readonly type: DiscoveryType;

	public constructor(discovery: unknown) {
		Object.assign(this, discovery);
	}

	public getType<T = any>(): DiscoveryType {
		return this.type;
	}

	public isContextMenu(): this is ContextMenuDiscovery {
		return this.getType() === DiscoveryType.CONTEXT_MENU;
	}

	public isSlashCommand(): this is SlashCommandDiscovery {
		return this.getType() === DiscoveryType.SLASH_COMMAND;
	}

	public isMessageComponent(): this is ComponentDiscovery {
		return this.getType() === DiscoveryType.MESSAGE_COMPONENT;
	}

	public isListener(): this is ListenerDiscovery {
		return this.getType() === DiscoveryType.LISTENER;
	}

	public isTextCommand(): this is TextCommandDiscovery {
		return this.getType() === DiscoveryType.TEXT_COMMAND;
	}

	public abstract toJSON(): Record<string, any>;
}
