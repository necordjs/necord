import { TreeService } from '../services/tree.service';
import { SLASH_COMMANDS } from '../necord.constants';

export const SlashCommandsProvider = {
	provide: SLASH_COMMANDS,
	useClass: TreeService
};
