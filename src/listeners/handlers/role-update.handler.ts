import { BaseHandler } from './base.handler';
import { Injectable } from '@nestjs/common';
import { CustomListener, CustomListenerHandler } from '../decorators';
import { ContextOf } from '../../context';
import { PermissionsBitField, Role } from 'discord.js';

export type CustomRoleUpdateEvents = {
	rolePositionUpdate: [role: Role, oldPosition: number, newPosition: number];
	rolePermissionsUpdate: [
		role: Role,
		oldPermissions: Readonly<PermissionsBitField>,
		newPermissions: Readonly<PermissionsBitField>
	];
	roleIconAdd: [role: Role, iconURL: string];
	roleIconUpdate: [role: Role, oldIconURL: string, newIconURL: string];
	roleIconRemove: [role: Role, iconURL: string];
};

@Injectable()
@CustomListener('roleUpdate')
export class RoleUpdateHandler extends BaseHandler<CustomRoleUpdateEvents> {
	@CustomListenerHandler()
	public handleRolePositionUpdate([oldRole, newRole]: ContextOf<'roleUpdate'>) {
		if (oldRole.rawPosition !== newRole.rawPosition) {
			this.emit('rolePositionUpdate', newRole, oldRole.rawPosition, newRole.rawPosition);
		}
	}

	@CustomListenerHandler()
	public handleRolePermissionsUpdate([oldRole, newRole]: ContextOf<'roleUpdate'>) {
		if (oldRole.permissions.bitfield !== newRole.permissions.bitfield) {
			this.emit('rolePermissionsUpdate', newRole, oldRole.permissions, newRole.permissions);
		}
	}

	@CustomListenerHandler()
	public handleRoleIconChanges([oldRole, newRole]: ContextOf<'roleUpdate'>) {
		if (!oldRole.icon && newRole.icon) {
			this.emit('roleIconAdd', newRole, newRole.iconURL());
		}

		if (oldRole.icon !== newRole.icon) {
			this.emit('roleIconUpdate', newRole, oldRole.iconURL(), newRole.iconURL());
		}

		if (oldRole.icon && !newRole.icon) {
			this.emit('roleIconRemove', newRole, oldRole.iconURL());
		}
	}
}
