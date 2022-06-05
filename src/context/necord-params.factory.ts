import { ParamData } from '@nestjs/common';
import { ParamsFactory } from '@nestjs/core/helpers/external-context-creator';
import { NecordParamType } from './necord-paramtype.enum';

export class NecordParamsFactory implements ParamsFactory {
	public exchangeKeyForValue(type: number, data: ParamData, args: unknown): any {
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
