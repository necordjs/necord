import { NecordParamType } from '../necord-paramtype.enum.js';
import { createNecordParamDecorator } from './params.util.js';

/**
 * Context decorator that marks a argument as a discovery.
 * This decorator is used to retrieve the discovery.
 * @returns The decorated argument.
 */
export const Discovery = createNecordParamDecorator(NecordParamType.DISCOVERY);
