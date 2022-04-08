import { ListenerDiscovery } from '../../listeners';
import { TextCommandDiscovery } from '../../text-commands';
import { DiscoveredMethodWithMeta } from '@golevelup/nestjs-discovery';
import { MessageComponentDiscovery } from '../../message-components';
import { SlashCommandDiscovery } from '../../slash-commands';
import { ContextMenuDiscovery } from '../../context-menus';

export interface IDiscovery<T> extends DiscoveredMethodWithMeta<T> {
	isListener(): this is ListenerDiscovery;

	isTextCommand(): this is TextCommandDiscovery;

	isMessageComponent(): this is MessageComponentDiscovery;

	isSlashCommand(): this is SlashCommandDiscovery;

	isContextMenu(): this is ContextMenuDiscovery;
}
