import { TypedPermissions } from './permissions.interface';
import { PERMISSIONS_METADATA } from './permissions.constants';

export function createNecordPermissionsDecorator<T>(type?: T) {
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
