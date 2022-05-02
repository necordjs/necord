import { PermissionResolvable, PermissionsBitField } from 'discord.js';
import { SetMetadata } from '@nestjs/common';
import { DM_PERMISSIONS_METADATA, MEMBER_PERMISSIONS_METADATA } from '../necord.constants';

export const MemberPermissions = (permissions: PermissionResolvable) =>
	SetMetadata(MEMBER_PERMISSIONS_METADATA, new PermissionsBitField(permissions));

export const AdminOnly = MemberPermissions('Administrator');

export const AllowDm = SetMetadata(DM_PERMISSIONS_METADATA, true);

export const GuildOnly = SetMetadata(DM_PERMISSIONS_METADATA, false);
