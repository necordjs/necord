import { ParamsFactory } from '@nestjs/core/helpers/external-context-creator';
import { ParamData } from '@nestjs/common';

import { NecordParamType } from './necord-paramtype.enum';
import { NecordBaseDiscovery } from '../context';

export class NecordParamsFactory implements ParamsFactory {
	public exchangeKeyForValue(
		type: NecordParamType,
		data: ParamData,
		args: [Array<any>, NecordBaseDiscovery]
	): any {
		if (!args) return null;

		switch (type) {
			case NecordParamType.CONTEXT:
				return args[0];
			case NecordParamType.DISCOVERY:
				return args[1];
			default:
				return null;
		}
	}
}
