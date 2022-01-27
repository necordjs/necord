import { ApplicationCommandPermissionData, ApplicationCommandPermissionType } from 'discord.js';
import { SetMetadata } from '@nestjs/common';
import { LISTENERS_METADATA, PERMISSIONS_METADATA } from '../necord.constants';
import { ListenerMetadata, NecordEvents } from '../interfaces';

export const Permissions = createNecordPermissionsDecorator();

export const UserPermissions = createNecordPermissionsDecorator('USER');

export const RolePermissions = createNecordPermissionsDecorator('ROLE');

type TypedPermissions<T> = Omit<
	ApplicationCommandPermissionData,
	T extends string ? 'type' : never
>[];

function createNecordPermissionsDecorator<T>(type?: T) {
	return (...permissions: TypedPermissions<T>): ClassDecorator & MethodDecorator =>
		(target, propertyKey?: string) => {
			const metadataTarget = target[propertyKey] ?? target;
			const existing = Reflect.getMetadata(PERMISSIONS_METADATA, metadataTarget) ?? [];

			Reflect.defineMetadata(
				PERMISSIONS_METADATA,
				existing
					.concat(permissions)
					.map(permission => ({ ...permission, type: permission.type ?? type })),
				metadataTarget
			);
		};
}
