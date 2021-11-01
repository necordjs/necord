import { NecordParamType } from '../context';
import { createNecordParamDecorator, createNecordPipesParamDecorator } from '../utils';

export function Context();
export function Context(index: number);
export function Context(index?: number): ParameterDecorator {
	return createNecordPipesParamDecorator(NecordParamType.CONTEXT)(typeof index === 'number' ? String(index) : index);
}

export const Ctx = Context;

export const Values = createNecordParamDecorator(NecordParamType.VALUES);

export const Options = createNecordParamDecorator(NecordParamType.OPTIONS);
