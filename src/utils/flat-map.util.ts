import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';

export function flatMap<T>(
	wrappers: InstanceWrapper[],
	callback: (instance: Record<string, any>, prototype: object) => T[]
): T[] {
	return wrappers
		.map(wrapper => {
			const { instance } = wrapper;

			if (!instance || !Object.getPrototypeOf(instance)) {
				return;
			}

			const prototype = Object.getPrototypeOf(instance);

			return callback(instance, prototype);
		})
		.reduce((a, b) => a.concat(b), [])
		.filter(element => !!element) as T[];
}
