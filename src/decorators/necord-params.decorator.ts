import { NecordParamType } from '../context';
import { OPTIONS_METADATA } from '../necord.constants';
import { createNecordParamDecorator, createNecordPipesParamDecorator } from '../utils';

export const Context = createNecordPipesParamDecorator(NecordParamType.CONTEXT);

export const Component = createNecordParamDecorator(NecordParamType.COMPONENT);

export const Values = createNecordParamDecorator(NecordParamType.VALUES);

export const Options = createNecordPipesParamDecorator(NecordParamType.OPTIONS, [
	(target, propertyKey, parameterIndex) => {
		const paramTypes = Reflect.getMetadata('design:paramtypes', target, propertyKey);
		const options = Reflect.getMetadata(OPTIONS_METADATA, paramTypes[parameterIndex]);

		Reflect.defineMetadata(OPTIONS_METADATA, options, target[propertyKey]);
	}
]);
