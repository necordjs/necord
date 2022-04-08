import { createNecordOptionDecorator } from './options.util';

export const BooleanOption = createNecordOptionDecorator('BOOLEAN', 'getBoolean');

export const IntegerOption = createNecordOptionDecorator('INTEGER', 'getInteger');

export const NumberOption = createNecordOptionDecorator('NUMBER', 'getNumber');

export const StringOption = createNecordOptionDecorator('STRING', 'getString');

export const UserOption = createNecordOptionDecorator('USER', 'getUser');

export const MemberOption = createNecordOptionDecorator('USER', 'getMember');

export const ChannelOption = createNecordOptionDecorator('CHANNEL', 'getChannel');

export const RoleOption = createNecordOptionDecorator('ROLE', 'getRole');

export const MentionableOption = createNecordOptionDecorator('MENTIONABLE', 'getMentionable');
