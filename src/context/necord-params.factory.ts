import { ParamsFactory } from '@nestjs/core/helpers/external-context-creator';
import { NecordParamType } from './necord-paramtype.enum';
import { BaseDiscovery } from '../discovery';

export class NecordParamsFactory implements ParamsFactory {
	public exchangeKeyForValue(
		type: number,
		data: unknown,
		args: [Array<any>, BaseDiscovery]
	): any {
		if (!args) return null;

		switch (type as NecordParamType) {
			case NecordParamType.CONTEXT:
				return args[0];
			case NecordParamType.DISCOVERY:
				return args[1];
			default:
				return null;
		}
	}
}
