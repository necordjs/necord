import { CommandOptionData, OptionMeta } from './options.interface';
import { OPTIONS_METADATA } from './options.constants';

export function createNecordOptionDecorator<T extends CommandOptionData['type']>(
	type: T,
	methodName: OptionMeta['resolver']
) {
	return (data: OptionMeta<T>): PropertyDecorator => {
		return (target: any, propertyKey: string | symbol) => {
			Reflect.defineProperty(target, propertyKey, { value: undefined });

			Reflect.defineMetadata(
				OPTIONS_METADATA,
				{
					...data,
					type,
					methodName
				},
				target,
				propertyKey
			);
		};
	};
}
