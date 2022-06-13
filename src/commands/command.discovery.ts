import { BaseApplicationCommandData } from 'discord.js';
import { NecordBaseDiscovery } from '../context';

// TODO: Add guild parameter
export abstract class CommandDiscovery<
	T extends BaseApplicationCommandData = BaseApplicationCommandData
> extends NecordBaseDiscovery<T> {}
