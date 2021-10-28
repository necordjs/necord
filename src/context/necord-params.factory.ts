import { ParamsFactory } from '@nestjs/core/helpers/external-context-creator';
import { ParamData } from '@nestjs/common';
import { NecordParamType } from './necord-paramtype.enum';

export class NecordParamsFactory implements ParamsFactory {
	public exchangeKeyForValue(type: number, data: ParamData, args: unknown): any {
		if (!args) {
			return null;
		}

		const context = args[0];

		switch (type as NecordParamType) {
			case NecordParamType.CONTEXT:
				return data && Array.isArray(context) ? context[data as string] : context;
			default:
				return null;
		}
	}
}
