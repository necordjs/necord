import { assignMetadata, PipeTransform, Type } from '@nestjs/common';
import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';

import { NecordParamType } from '../necord-paramtype.enum.js';

export function createNecordParamDecorator(type: NecordParamType) {
	return (...pipes: (Type<PipeTransform> | PipeTransform)[]): ParameterDecorator =>
		(target, key, index) => {
			if (key === undefined) {
				return;
			}

			const args = Reflect.getMetadata(ROUTE_ARGS_METADATA, target.constructor, key) || {};

			Reflect.defineMetadata(
				ROUTE_ARGS_METADATA,
				assignMetadata(args, type, index, undefined, ...pipes),
				target.constructor,
				key
			);
		};
}
