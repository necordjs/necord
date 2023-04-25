import { Collection, Collector } from 'discord.js';

export abstract class BaseCollector<Original, Options> {
	public constructor(private readonly options?: Options) {}

	protected abstract filter(original: Original, ...args: any): boolean;

	protected abstract collect(original: Original, ...args: any): any;

	protected end(
		original: Original,
		collected: Collection<string, Original>,
		reason?: string
	): any {}

	protected ignore(original: Original, ...args: any): any {}

	protected dispose(original: Original, ...args: any): any {}

	public start(original: Original, options?: Options): Promise<Collection<string, Original>> {
		return new Promise(resolve => {
			const mergedOptions = this.getOptions(original, options);
			const collector = this.getDiscordCollector(original, mergedOptions);

			collector.on('collect', (...args: any) => this.collect(original, ...args));

			collector.once('end', (collected, reason) => {
				this.end(original, collected, reason);

				return resolve(collected);
			});

			collector.on('dispose', (...args: any) => this.dispose(original, ...args));

			collector.on('ignore', (...args: any) => this.ignore(original, ...args));
		});
	}

	protected abstract getDiscordCollector(
		original: Original,
		options: Options
	): Collector<any, any>;

	protected getOptions(original: Original, options?: Options) {
		return {
			...this.options,
			...options,
			filter: (...args: any) => this.filter(original, ...args)
		};
	}
}
