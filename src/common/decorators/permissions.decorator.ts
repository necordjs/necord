import { UseGuards } from '@nestjs/common';
import { BotPermissionsGuard, MemberPermissionsGuard } from '../guards';
import { PermissionResolvable } from 'discord.js';

export const MemberPermissions = (permissions: PermissionResolvable) =>
	UseGuards(new MemberPermissionsGuard(permissions));

export const BotPermissions = (permissions: PermissionResolvable) =>
	UseGuards(new BotPermissionsGuard(permissions));
