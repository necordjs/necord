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
				return data ? context[data as string] : context;
			case NecordParamType.OPTIONS:
				return context.isApplicationCommand() ? (!!data ? args[1][data] : args[1]) : null;
			case NecordParamType.VALUES:
				return context.isSelectMenu() ? context.values : null;
			case NecordParamType.COMPONENT:
				return context.isMessageComponent() ? context.component : null;
			default:
				return null;
		}
	}
}
