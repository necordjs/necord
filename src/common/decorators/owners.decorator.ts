import { UseGuards } from '@nestjs/common';
import { BotOwnerGuard, GuildOwnerGuard } from '../guards';

export const BotOwner = () => UseGuards(BotOwnerGuard);

export const GuildOwner = () => UseGuards(GuildOwnerGuard);
