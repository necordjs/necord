import { NecordParamType } from '../necord-paramtype.enum';
import { createNecordParamDecorator } from './params.util';

export const Context = createNecordParamDecorator(NecordParamType.CONTEXT);

export const Ctx = Context;
