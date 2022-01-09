import { NecordParamType } from '../context';
import { OPTIONS_METADATA } from '../necord.constants';
import { createNecordParamDecorator, createNecordPipesParamDecorator } from './params.util';

export const Context = createNecordParamDecorator(NecordParamType.CONTEXT);

export const Options = createNecordPipesParamDecorator(NecordParamType.OPTIONS, [
	(target, propertyKey, parameterIndex) => {
		const paramTypes = Reflect.getMetadata('design:paramtypes', target, propertyKey);
		const options = Reflect.getMetadata(OPTIONS_METADATA, paramTypes[parameterIndex]);

		Reflect.defineMetadata(OPTIONS_METADATA, options, target[propertyKey]);
	}
]);

export const Ctx = Context;

export const Opts = Options;
