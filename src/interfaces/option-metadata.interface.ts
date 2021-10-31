import { ChannelTypes } from 'discord.js/typings/enums';

export type OptionMetadata = {
	name: string;
	description?: string;
	required?: boolean;
};

export type ChannelOptionMetadata = OptionMetadata & {
	types: Exclude<ChannelTypes, ChannelTypes.DM | ChannelTypes.GROUP_DM>[];
};

export type PrimitiveOptionMetadata<V = string> = OptionMetadata & {
	choices?: [string, V][];
};
