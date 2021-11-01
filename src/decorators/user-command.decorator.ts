import { createNecordContextMenu } from '../utils';

export const UserCommand = (name: string, defaultPermission = true) =>
	createNecordContextMenu('USER', name, defaultPermission);
