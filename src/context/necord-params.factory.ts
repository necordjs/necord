import { ParamsFactory } from '@nestjs/core/helpers/external-context-creator';
import { ParamData } from '@nestjs/common';
import { NecordParamType } from './necord-paramtype.enum';
import { Interaction } from 'discord.js';

export class NecordParamsFactory implements ParamsFactory {
	public exchangeKeyForValue(type: number, data: ParamData, args: unknown): any {
		if (!args) {
			return null;
		}

		const context = args[0] as Interaction;

		switch (type as NecordParamType) {
			case NecordParamType.CONTEXT:
				return data && Array.isArray(context) ? context[data as string] : context;
			case NecordParamType.VALUES:
				return context.isSelectMenu() && context.values;
			case NecordParamType.OPTIONS:
				return context.isApplicationCommand() ? context.options : null;
			default:
				return null;
		}
	}
}
