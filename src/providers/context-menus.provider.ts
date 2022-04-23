import { TreeService } from '../services/tree.service';

export const CONTEXT_MENUS = 'necord:context_menus';

export const ContextMenusProvider = {
	provide: CONTEXT_MENUS,
	useClass: TreeService
};
