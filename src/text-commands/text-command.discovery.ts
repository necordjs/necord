import { NecordBaseDiscovery } from '../context';

export interface TextCommandMeta {
	name: string;
	description: string;
	botNames?: string[];
}

export class TextCommandDiscovery extends NecordBaseDiscovery<TextCommandMeta> {
	public getName() {
		return this.meta.name;
	}

	public getDescription() {
		return this.meta.description;
	}

	public isTextCommand(): this is TextCommandDiscovery {
		return true;
	}

	public isForBot(botName: string) {
		return this.meta.botNames?.includes(botName) ?? true;
	}

	public override toJSON(): Record<string, any> {
		return this.meta;
	}
}
