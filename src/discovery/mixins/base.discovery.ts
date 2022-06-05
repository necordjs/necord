import { Reflector } from '@nestjs/core';
import { ContextMenuDiscovery } from '../../context-menus';
import { SlashCommandDiscovery } from '../../slash-commands';
import { MessageComponentDiscovery } from '../../message-components';
import { ListenerDiscovery } from '../../listeners';
import { TextCommandDiscovery } from '../../text-commands';
import { ModalDiscovery } from '../../modals';

export abstract class BaseDiscovery {
	protected readonly reflector = new Reflector();

	public constructor(discovery: unknown) {
		Object.assign(this, discovery);
	}

	public isContextMenu(): this is ContextMenuDiscovery {
		return false;
	}

	public isSlashCommand(): this is SlashCommandDiscovery {
		return false;
	}

	public isMessageComponent(): this is MessageComponentDiscovery {
		return false;
	}

	public isListener(): this is ListenerDiscovery {
		return false;
	}

	public isTextCommand(): this is TextCommandDiscovery {
		return false;
	}

	public isModal(): this is ModalDiscovery {
		return false;
	}

	public abstract toJSON(): Record<string, any>;
}
