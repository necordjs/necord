import { NecordParamType } from '../necord-paramtype.enum';
import { createNecordParamDecorator } from './params.util';

/**
 * Context decorator that marks a argument as a discovery.
 * This decorator is used to retrieve the discovery.
 * @returns The decorated argument.
 */
export const Discovery = createNecordParamDecorator(NecordParamType.DISCOVERY);
