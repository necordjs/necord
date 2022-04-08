import { CommandOptionData, DistributiveOmit, OptionMeta } from './options.interface';
import { OPTIONS_METADATA } from './options.constants';

export function createNecordOptionDecorator<T extends CommandOptionData['type']>(
	type: T,
	methodName: OptionMeta['methodName']
) {
	return (data: DistributiveOmit<OptionMeta<T>, 'type' | 'methodName'>): PropertyDecorator => {
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
