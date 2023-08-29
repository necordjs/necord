import { SlashCommandDiscovery, SlashCommandMeta } from '../slash-command.discovery';
import { ApplicationCommandType } from 'discord.js';
import { Reflector } from '@nestjs/core';

export const SlashCommand = Reflector.createDecorator<
	Omit<SlashCommandMeta, 'type' | 'options'>,
	SlashCommandDiscovery
>({
	transform: options =>
		new SlashCommandDiscovery({
			type: ApplicationCommandType.ChatInput,
			...options
		})
});
