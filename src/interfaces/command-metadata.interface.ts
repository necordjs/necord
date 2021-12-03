import { ApplicationCommandData } from 'discord.js';
import { MethodMetadata } from './method-metadata.interface';

export type ApplicationCommandMetadata = ApplicationCommandData & MethodMetadata;
