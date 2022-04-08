import { DiscoveredMethod, DiscoveredMethodWithMeta } from '@golevelup/nestjs-discovery';
import { Reflector } from '@nestjs/core';
import { createNecordContext } from '../context';
import { IDiscovery } from './discovery.interface';
import { DiscoveryType } from './discovery-type.enum';

export abstract class BaseDiscovery<M> implements IDiscovery<M> {
	protected readonly reflector = new Reflector();

	protected abstract type: DiscoveryType | any;

	private readonly contextExecute: Function;

	public discoveredMethod: DiscoveredMethod;

	public meta: M;

	public constructor(discovery: DiscoveredMethodWithMeta<M>) {
		this.discoveredMethod = discovery.discoveredMethod;
		this.meta = discovery.meta;

		this.contextExecute = createNecordContext(
			this.discoveredMethod.parentClass.instance,
			Object.getPrototypeOf(this.discoveredMethod.parentClass.instance),
			this.discoveredMethod.methodName
		);
	}

	public getType<T = any>(): T {
		return this.type;
	}

	public getHandler() {
		return this.discoveredMethod.handler;
	}

	public getClass() {
		return this.discoveredMethod.parentClass.instance.constructor;
	}

	public getModule() {
		return this.discoveredMethod.parentClass.parentModule;
	}

	public isContextMenu() {
		return this.getType() === DiscoveryType.CONTEXT_MENU;
	}

	public isSlashCommand() {
		return this.getType() === DiscoveryType.SLASH_COMMAND;
	}

	public isMessageComponent() {
		return this.getType() === DiscoveryType.MESSAGE_COMPONENT;
	}

	public isListener() {
		return this.getType() === DiscoveryType.LISTENER;
	}

	public isTextCommand() {
		return this.getType() === DiscoveryType.TEXT_COMMAND;
	}

	public execute(context: any = [], options: any = undefined) {
		return this.contextExecute(context, options, this);
	}
}
