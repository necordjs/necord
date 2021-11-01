import { createNecordContextMenu } from '../utils';

export const MessageCommand = (name: string, defaultPermission = true) =>
	createNecordContextMenu('MESSAGE', name, defaultPermission);
