import { ApplicationCommandPermissionData } from 'discord.js';

export type TypedPermissions<T> = Omit<
	ApplicationCommandPermissionData,
	T extends string ? 'type' : never
>[];
