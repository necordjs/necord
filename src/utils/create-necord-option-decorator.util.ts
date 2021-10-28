import 'reflect-metadata';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { NecordExecutionContext } from '../context';
import { CommandInteractionOptionResolver, ContextMenuInteraction } from 'discord.js';
import { OPTIONS_METADATA } from '../necord.constants';
import { SlashCommandOptionBase } from '@discordjs/builders/dist/interactions/slashCommands/mixins/CommandOptionBase';

export const createNecordOption = <V, T extends SlashCommandOptionBase>(
	fn: (resolver: CommandInteractionOptionResolver) => V,
	builder: T = null
) =>
	createParamDecorator(
		(data: unknown, context: ExecutionContext): V => {
			const ctx = NecordExecutionContext.create(context);
			const interaction = ctx.getContext<ContextMenuInteraction>();

			return fn(interaction.options);
		},
		[
			(target, propertyKey, parameterIndex) => {
				const options = Reflect.getOwnMetadata(OPTIONS_METADATA, target[propertyKey]) || [];

				Reflect.defineMetadata(
					OPTIONS_METADATA,
					options.concat({ ...(builder?.toJSON() ?? {}), parameterIndex }),
					target[propertyKey]
				);
			}
		]
	)();
