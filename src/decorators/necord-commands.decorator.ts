import { createNecordCommandDecorator } from '../utils';
import { ApplicationCommandTypes } from 'discord.js/typings/enums';

export const SlashCommand = createNecordCommandDecorator(ApplicationCommandTypes.CHAT_INPUT);

export const UserCommand = createNecordCommandDecorator(ApplicationCommandTypes.USER);

export const MessageCommand = createNecordCommandDecorator(ApplicationCommandTypes.MESSAGE);
