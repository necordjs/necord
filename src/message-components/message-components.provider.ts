import { MESSAGE_COMPONENTS } from './message-components.constants';
import { TreeService } from '../common';

export const MessageComponentsProvider = {
	provide: MESSAGE_COMPONENTS,
	useClass: TreeService
};
