import { InjectionToken, Provider } from '@nestjs/common';

export const createMapProviderUtil = (provide: InjectionToken): Provider<Map<string, any>> => ({
	provide,
	useValue: new Map<string, any>()
});
