import { TreeService } from '../services/tree.service';
import { CONTEXT_MENUS } from '../necord.constants';

export const ContextMenusProvider = {
	provide: CONTEXT_MENUS,
	useClass: TreeService
};
