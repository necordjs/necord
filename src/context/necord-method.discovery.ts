import {
	DiscoveredClassWithMeta,
	DiscoveredMethod,
	DiscoveredMethodWithMeta
} from '@golevelup/nestjs-discovery';
import { createNecordContext } from './necord-context-creator';
import { ComponentDiscovery } from '../components';
import { Reflector } from '@nestjs/core';
import { ListenerDiscovery } from '../listeners';
import { SlashCommandDiscovery, ContextMenuDiscovery } from "../commands";

export enum NecordMethodDiscoveryType {
	LISTENER,
	SLASH_COMMAND,
	CONTEXT_MENU,
	MESSAGE_COMPONENT,
	TEXT_COMMAND
}

export abstract class NecordMethodDiscovery<M> implements DiscoveredMethodWithMeta<M> {
	protected readonly reflector = new Reflector();

	protected readonly contextExecute: Function;

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

	protected abstract type: NecordMethodDiscoveryType | any;

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

	public isContextMenu(): this is ContextMenuDiscovery {
		return this.getType() === NecordMethodDiscoveryType.CONTEXT_MENU;
	}

	public isSlashCommand(): this is SlashCommandDiscovery {
		return this.getType() === NecordMethodDiscoveryType.SLASH_COMMAND;
	}

	public isMessageComponent(): this is ComponentDiscovery {
		return this.getType() === NecordMethodDiscoveryType.MESSAGE_COMPONENT;
	}

	public isListener(): this is ListenerDiscovery {
		return this.getType() === NecordMethodDiscoveryType.LISTENER;
	}

	public execute(context: any = [], options: any = undefined) {
		return this.contextExecute(context, options, this);
	}
}
