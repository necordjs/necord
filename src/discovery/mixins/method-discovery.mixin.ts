import { DiscoveredMethod, DiscoveredMethodWithMeta } from '@golevelup/nestjs-discovery';
import { createNecordContext } from '../../context';

export class MethodDiscoveryMixin<M> implements DiscoveredMethodWithMeta<M> {
	public discoveredMethod: DiscoveredMethod;

	public meta: M;

	public getHandler() {
		return this.discoveredMethod.handler;
	}

	public getClass() {
		return this.discoveredMethod.parentClass.instance.constructor;
	}

	public getModule() {
		return this.discoveredMethod.parentClass.parentModule.instance.constructor;
	}

	private contextExecute: Function;

	protected get _execute() {
		if (!this.contextExecute) {
			this.contextExecute = createNecordContext(
				this.discoveredMethod.parentClass.instance,
				Object.getPrototypeOf(this.discoveredMethod.parentClass.instance),
				this.discoveredMethod.methodName
			);
		}

		return (context: any = []) => this.contextExecute(context, this);
	}

	public execute(context: any = []) {
		return this._execute(context);
	}
}
