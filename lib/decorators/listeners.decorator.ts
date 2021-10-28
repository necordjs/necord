import { createNecordListener } from '../utils';
import { ClientEvents } from 'discord.js';

export const On = (event: keyof ClientEvents) => createNecordListener({ event, once: false });

export const Once = (event: keyof ClientEvents) => createNecordListener({ event, once: true });

export const OnReady = Once('ready');

export const OnDebug = On('debug');

export const OnWarn = On('warn');

export const OnError = On('error');
