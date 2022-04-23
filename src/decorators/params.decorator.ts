import { createNecordParamDecorator, createNecordPipesParamDecorator } from './param.utils';
import { NecordParamType } from '../context';
import { OPTIONS_METADATA } from '../necord.constants';

export const Context = createNecordParamDecorator(NecordParamType.CONTEXT);

export const Options = createNecordPipesParamDecorator(NecordParamType.OPTIONS, [
	(target, propertyKey, parameterIndex) => {
		try {
			const paramTypes = Reflect.getMetadata('design:paramtypes', target, propertyKey);
			let prototype = Reflect.getPrototypeOf(new paramTypes[parameterIndex]());

			const options = {};

			for (; prototype !== Object.prototype; prototype = Reflect.getPrototypeOf(prototype)) {
				Object.getOwnPropertyNames(prototype)
					.map(name => [name, Reflect.getMetadata(OPTIONS_METADATA, prototype, name)])
					.filter(([, meta]) => !!meta)
					.forEach(([name, meta]) => (options[name] = meta));
			}

			Reflect.defineMetadata(OPTIONS_METADATA, options, target[propertyKey]);
		} catch (err) {
			// NO-OP
		}
	}
]);

export const Discovery = createNecordPipesParamDecorator(NecordParamType.DISCOVERY);

export const Ctx = Context;

export const Opts = Options;
