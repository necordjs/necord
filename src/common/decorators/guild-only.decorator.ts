import { UseGuards } from '@nestjs/common';
import { GuildOnlyGuard } from '../guards';

export const GuildOnly = () => UseGuards(GuildOnlyGuard);
