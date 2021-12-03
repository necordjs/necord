import { createNecordOptionDecorator } from '../utils';
import { ApplicationCommandOptionTypes } from 'discord.js/typings/enums';

export const BooleanOption = createNecordOptionDecorator(ApplicationCommandOptionTypes.BOOLEAN, 'getBoolean');

export const IntegerOption = createNecordOptionDecorator(ApplicationCommandOptionTypes.INTEGER, 'getInteger');

export const NumberOption = createNecordOptionDecorator(ApplicationCommandOptionTypes.NUMBER, 'getNumber');

export const StringOption = createNecordOptionDecorator(ApplicationCommandOptionTypes.STRING, 'getString');

export const UserOption = createNecordOptionDecorator(ApplicationCommandOptionTypes.USER, 'getUser');

export const MemberOption = createNecordOptionDecorator(ApplicationCommandOptionTypes.USER, 'getMember');

export const ChannelOption = createNecordOptionDecorator(ApplicationCommandOptionTypes.USER, 'getChannel');

export const RoleOption = createNecordOptionDecorator(ApplicationCommandOptionTypes.ROLE, 'getRole');

export const MentionableOption = createNecordOptionDecorator(
	ApplicationCommandOptionTypes.MENTIONABLE,
	'getMentionable'
);
