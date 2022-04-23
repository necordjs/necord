import { createNecordOptionDecorator } from './options.util';
import {
	BooleanOptionData,
	ChannelOptionData,
	DiscordOptionData,
	NumericOptionData,
	StringOptionData
} from './options.interface';

export const BooleanOption = createNecordOptionDecorator<BooleanOptionData>(
	'BOOLEAN',
	'getBoolean'
);

export const IntegerOption = createNecordOptionDecorator<NumericOptionData>(
	'INTEGER',
	'getInteger'
);

export const NumberOption = createNecordOptionDecorator<NumericOptionData>('NUMBER', 'getNumber');

export const StringOption = createNecordOptionDecorator<StringOptionData>('STRING', 'getString');

export const ChannelOption = createNecordOptionDecorator<ChannelOptionData>(
	'CHANNEL',
	'getChannel'
);

export const UserOption = createNecordOptionDecorator<DiscordOptionData>('USER', 'getUser');

export const MemberOption = createNecordOptionDecorator<DiscordOptionData>('USER', 'getMember');

export const RoleOption = createNecordOptionDecorator<DiscordOptionData>('ROLE', 'getRole');

export const MentionableOption = createNecordOptionDecorator<DiscordOptionData>(
	'MENTIONABLE',
	'getMentionable'
);
