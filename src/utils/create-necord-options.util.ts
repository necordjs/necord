import { OptionData, OptionMetadata, OptionTransform } from '../interfaces';
import { OPTIONS_METADATA } from '../necord.constants';

export function createNecordOptionDecorator<
	T extends OptionData['type'],
	C extends OptionMetadata<T> = OptionMetadata<T>
>(type: T, methodName: OptionTransform): (data: Omit<C, 'type' | 'methodName'>) => PropertyDecorator {
	return (data: C): PropertyDecorator => {
		return (target: object, propertyKey: string) => {
			const options: Record<string, C> = Reflect.getMetadata(OPTIONS_METADATA, target.constructor) || {};

			options[propertyKey] = {
				...data,
				type,
				methodName
			};

			Reflect.defineMetadata(OPTIONS_METADATA, options, target.constructor);
		};
	};
}
