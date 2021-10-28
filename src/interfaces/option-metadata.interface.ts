import { ChannelType } from 'discord-api-types';

export type OptionMetadata = {
	name: string;
	description?: string;
	required?: boolean;
};

export type ChannelOptionMetadata = OptionMetadata & {
	types: Exclude<ChannelType, ChannelType.DM | ChannelType.GroupDM>[];
};

export type PrimitiveOptionMetadata<V = string> = OptionMetadata & {
	choices?: [string, V][];
};
