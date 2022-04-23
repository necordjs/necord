import { DiscoveredClass, DiscoveredClassWithMeta } from '@golevelup/nestjs-discovery';

export class ClassDiscoveryMixin<M> implements DiscoveredClassWithMeta<M> {
	public discoveredClass: DiscoveredClass;

	public meta: M;

	public getClass() {
		return this.discoveredClass.instance.constructor;
	}

	public getModule() {
		return this.discoveredClass.parentModule.instance.constructor;
	}
}
