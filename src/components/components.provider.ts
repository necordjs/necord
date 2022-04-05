import { MESSAGE_COMPONENTS } from './components.constants';
import { TreeService } from '../common';

export const ComponentsProvider = {
	provide: MESSAGE_COMPONENTS,
	useClass: TreeService
};
