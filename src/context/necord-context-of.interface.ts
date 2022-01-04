import { ClientEvents } from 'discord.js';

export type NecordContextOf<K extends keyof ClientEvents> = ClientEvents[K];
