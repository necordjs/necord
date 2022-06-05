import { Injectable, OnModuleInit } from '@nestjs/common';
import { ExternalContextCreator } from '@nestjs/core/helpers/external-context-creator';
import { ParamMetadata } from '@nestjs/core/helpers/interfaces';
import { NecordContextType } from './necord-execution-context';
import { STATIC_CONTEXT } from '@nestjs/core/injector/constants';
import { NecordParamsFactory } from './necord-params.factory';
import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';

// TODO: REMOVE THIS SHIT o_O
export let createNecordContext: <T extends Record<string, any>>(
	instance: T,
	prototype: any,
	methodName: string
) => (...args) => void;

@Injectable()
export class NecordContextCreator implements OnModuleInit {
	private readonly necordParamsFactory = new NecordParamsFactory();

	public constructor(private readonly externalContextCreator: ExternalContextCreator) {}

	public onModuleInit() {
		createNecordContext = (instance, prototype, methodName) => {
			return this.externalContextCreator.create<
				Record<number, ParamMetadata>,
				NecordContextType
			>(
				instance,
				prototype[methodName],
				methodName,
				ROUTE_ARGS_METADATA,
				this.necordParamsFactory,
				STATIC_CONTEXT,
				undefined,
				{ guards: true, filters: true, interceptors: true },
				'necord'
			);
		};
	}
}
