import { createNecordPermissionsDecorator } from './permissions.util';

export const Permissions = createNecordPermissionsDecorator();

export const UserPermissions = createNecordPermissionsDecorator('USER');

export const RolePermissions = createNecordPermissionsDecorator('ROLE');
