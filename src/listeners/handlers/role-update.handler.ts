import { PermissionsBitField, Role } from 'discord.js';
import { Injectable } from '@nestjs/common';

import { CustomListener, CustomListenerHandler } from '../decorators/index.js';
import { ContextOf } from '../../context/index.js';
import { BaseHandler } from './base.handler.js';

export type CustomRoleUpdateEvents = {
	rolePositionUpdate: [role: Role, oldPosition: number, newPosition: number];
	rolePermissionsUpdate: [
		role: Role,
		oldPermissions: Readonly<PermissionsBitField>,
		newPermissions: Readonly<PermissionsBitField>
	];
	roleIconAdd: [role: Role, iconURL: string | null];
	roleIconUpdate: [role: Role, oldIconURL: string | null, newIconURL: string | null];
	roleIconRemove: [role: Role, iconURL: string | null];
};

@CustomListener('roleUpdate')
@Injectable()
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
