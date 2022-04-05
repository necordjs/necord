import { Injectable } from '@nestjs/common';

class Node<T extends Record<string, any>> {
	public children: Node<T>[] = [];

	public constructor(public key: string, public value: T) {}

	public append(node) {
		this.children.push(node);
	}

	public toJSON() {
		if (!this.value) {
			return this.children.map(node => node.toJSON());
		}

		const value = JSON.parse(JSON.stringify(this.value));
		const options = this.children.length
			? this.children?.map(node => node.toJSON())
			: value.options;

		return Object.assign(value, { options });
	}
}

@Injectable()
export class TreeService<T = any> {
	private root = new Node<T>('', null);

	public add(path: string[] | string, value: any) {
		path = Array.isArray(path) ? path : [path];

		for (let i = 0, node = this.root; i < path.length; i++) {
			const part = path[i];
			let child = node.children.find(n => n.key === part);

			if (!child) {
				child = new Node(part, null);
				node.append(child);
			}

			if (i === path.length - 1) {
				child.value = value;
			}

			node = child;
		}

		return this;
	}

	public find(path: string[] | string) {
		path = Array.isArray(path) ? path : [path];

		for (let i = 0, node = this.root; i < path.length; i++) {
			const part = path[i];
			let child = node.children.find(n => n.key === part);

			if (!child) {
				return;
			}

			node = child;

			if (i === path.length - 1) {
				return node.value;
			}
		}
	}

	public toJSON() {
		return this.root.children.map(node => node.toJSON()).flat();
	}
}
