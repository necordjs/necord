import { CanActivate, ExecutionContext, Injectable, Optional } from '@nestjs/common';
import { Collection, Interaction } from 'discord.js';
import { NecordExecutionContext } from '../context';

export enum BucketType {
	GUILD,
	CHANNEL,
	USER
}

@Injectable()
export class CooldownGuard implements CanActivate {
	private readonly storage = new Collection<string, number>();

	public constructor(
		private readonly ttl: number,
		@Optional()
		private readonly bucketType: BucketType = BucketType.USER
	) {}

	public canActivate(context: ExecutionContext): boolean | Promise<boolean> {
		const necordContext = NecordExecutionContext.create(context);
		const [interaction] = necordContext.getContext<'interactionCreate'>();

		if (!(interaction instanceof Interaction)) return true;

		const now = Date.now();

		const bucketKey = this.getBucketKey(interaction);
		const bucket = this.storage.ensure(bucketKey, () => now);

		if (bucket > now) return false;

		return this.storage.set(bucketKey, now + this.ttl * 1000) && true;
	}

	private getBucketKey(interaction: Interaction): string {
		switch (this.bucketType) {
			case BucketType.GUILD:
				return interaction.guildId;
			case BucketType.CHANNEL:
				return interaction.channelId;
			case BucketType.USER:
				return interaction.user.id;
		}
	}
}
