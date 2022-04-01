import { UseGuards } from '@nestjs/common';
import { BucketType, CooldownGuard } from '../guards';

export const Cooldown = (ttl: number, bucketType: BucketType = BucketType.USER) =>
	UseGuards(new CooldownGuard(ttl, bucketType));
