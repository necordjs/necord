import { NecordParamType } from '../necord-paramtype.enum.js';
import { createNecordParamDecorator } from './params.util.js';

/**
 * Context decorator that marks a argument as a context.
 * This decorator is used to retrieve the context.
 * @returns The decorated argument.
 * @url https://necord.org/start/#context
 */
export const Context = createNecordParamDecorator(NecordParamType.CONTEXT);

export const Ctx = Context;
