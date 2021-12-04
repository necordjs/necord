import { MessageComponentTypes } from 'discord.js/typings/enums';
import { createNecordComponentDecorator } from '../utils';

export const Button = createNecordComponentDecorator(MessageComponentTypes.BUTTON);

export const SelectMenu = createNecordComponentDecorator(MessageComponentTypes.SELECT_MENU);
