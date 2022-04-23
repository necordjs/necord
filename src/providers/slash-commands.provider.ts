import { TreeService } from '../services/tree.service';

export const SLASH_COMMANDS = 'necord:slash_commands';

export const SlashCommandsProvider = {
	provide: SLASH_COMMANDS,
	useClass: TreeService
};
