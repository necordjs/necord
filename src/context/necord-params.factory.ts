import { ParamData } from '@nestjs/common';
import { ParamsFactory } from '@nestjs/core/helpers/external-context-creator';

export enum NecordParamType {
	CONTEXT,
	OPTIONS,
	INFO
}

export class NecordParamsFactory implements ParamsFactory {
	public exchangeKeyForValue(type: number, data: ParamData, args: unknown): any {
		if (!args) return null;

		switch (type as NecordParamType) {
			case NecordParamType.CONTEXT:
				return args[0];
			case NecordParamType.OPTIONS:
				return data && args[1] ? args[1][data] : args[1];
			case NecordParamType.INFO:
				return args[2];
			default:
				return null;
		}
	}
}
