import { ParamsFactory } from '@nestjs/core/helpers/external-context-creator';
import { ParamData } from '@nestjs/common';

import { NecordParamType } from './necord-paramtype.enum.js';
import { NecordBaseDiscovery } from '../context/index.js';

export class NecordParamsFactory implements ParamsFactory {
	public exchangeKeyForValue(
		type: NecordParamType,
		data: ParamData | undefined,
		args?: [Array<any>, NecordBaseDiscovery]
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
