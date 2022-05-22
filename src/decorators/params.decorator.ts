import { NecordParamType } from '../context';
import { OPTIONS_METADATA } from '../necord.constants';
import { createNecordParamDecorator, createNecordPipesParamDecorator } from './params.util';

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
					.forEach(([name, meta]) => (options[name] ??= meta));
			}

			Reflect.defineMetadata(OPTIONS_METADATA, options, target[propertyKey]);
		} catch (err) {
			// NO-OP
		}
	}
]);

export const Info = createNecordPipesParamDecorator(NecordParamType.INFO);

export const Ctx = Context;

export const Opts = Options;
