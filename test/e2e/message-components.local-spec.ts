import {
	Button,
	ButtonContext,
	ChannelSelect,
	ChannelSelectContext,
	ComponentParam,
	Context,
	ISelectedChannels,
	ISelectedMembers,
	ISelectedRoles,
	ISelectedUsers,
	MentionableSelect,
	MentionableSelectContext,
	RoleSelect,
	RoleSelectContext,
	SelectedChannels,
	SelectedMembers,
	SelectedRoles,
	SelectedStrings,
	SelectedUsers,
	SlashCommand,
	SlashCommandContext,
	StringSelect,
	StringSelectContext,
	UserSelectContext
} from '../../src';
import { Injectable } from '@nestjs/common';
import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	ChannelSelectMenuBuilder,
	ChannelType,
	MentionableSelectMenuBuilder,
	RoleSelectMenuBuilder,
	SelectMenuBuilder,
	StringSelectMenuBuilder,
	UserSelectMenuBuilder
} from 'discord.js';
import { MessageActionRowComponentBuilder } from '@discordjs/builders';
import { createApplication } from './utils.local-spec';

@Injectable()
export class MessageComponentsLocalSpec {
	@SlashCommand({ name: 'button', description: 'Creates button component.' })
	public async createButton(@Context() [interaction]: SlashCommandContext) {
		return interaction.reply({
			content: `Button`,
			components: [
				new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents([
					new ButtonBuilder()
						.setCustomId('click/12345')
						.setLabel('LABEL')
						.setStyle(ButtonStyle.Primary)
				])
			]
		});
	}

	@SlashCommand({ name: 'select-menu', description: 'Creates select menu component.' })
	public async createSelectMenu(@Context() [interaction]: SlashCommandContext) {
		return interaction.reply({
			content: `Select Menu`,
			components: [
				new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents([
					new SelectMenuBuilder()
						.setCustomId('SELECT_MENU')
						.setPlaceholder('Select your color')
						.setMaxValues(1)
						.setMinValues(1)
						.setOptions([
							{ label: 'Red', value: 'Red' },
							{ label: 'Blue', value: 'Blue' },
							{ label: 'Yellow', value: 'Yellow' }
						])
				])
			]
		});
	}

	@Button('click/:value')
	public onButton(
		@Context() [interaction]: ButtonContext,
		@ComponentParam('value') value: string
	) {
		return interaction.reply({ content: `Button clicked! Value: ${value}` });
	}

	@SlashCommand({ name: 'string-select', description: 'Creates string select menu component.' })
	public async createStringSelect(@Context() [interaction]: SlashCommandContext) {
		return interaction.reply({
			content: `String Select Menu`,
			components: [
				new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents([
					new StringSelectMenuBuilder()
						.setCustomId('STRING_SELECT_MENU')
						.setPlaceholder('Select your color')
						.setMaxValues(1)
						.setMinValues(1)
						.setOptions([
							{ label: 'Red', value: 'Red' },
							{ label: 'Blue', value: 'Blue' },
							{ label: 'Yellow', value: 'Yellow' }
						])
				])
			]
		});
	}

	@StringSelect('STRING_SELECT_MENU')
	public onStringSelect(
		@Context() [interaction]: StringSelectContext,
		@SelectedStrings() selected: string[]
	) {
		return interaction.reply({
			content: `Your selected color - ${selected.join(' ')}`
		});
	}

	@SlashCommand({ name: 'channel-select', description: 'Creates channel select menu component.' })
	public async createChannelSelect(@Context() [interaction]: SlashCommandContext) {
		return interaction.reply({
			content: `Channel Select Menu`,
			components: [
				new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents([
					new ChannelSelectMenuBuilder()
						.setCustomId('CHANNEL_SELECT_MENU')
						.setPlaceholder('Select a text channel')
						.setMaxValues(1)
						.setMinValues(1)
						.setChannelTypes(ChannelType.GuildText)
				])
			]
		});
	}

	@ChannelSelect('CHANNEL_SELECT_MENU')
	public onChannelSelect(
		@Context() [interaction]: ChannelSelectContext,
		@SelectedChannels() channels: ISelectedChannels
	) {
		return interaction.reply({
			content: `Your selected channels - ${channels.map(ch => ch.id).join(',')}`
		});
	}

	@SlashCommand({ name: 'user-select', description: 'Creates user select menu component.' })
	public async createUserSelect(@Context() [interaction]: SlashCommandContext) {
		return interaction.reply({
			content: `User Select Menu`,
			components: [
				new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents([
					new UserSelectMenuBuilder()
						.setCustomId('USER_SELECT_MENU')
						.setPlaceholder('Select a user')
						.setMaxValues(1)
						.setMinValues(1)
				])
			]
		});
	}

	@RoleSelect('USER_SELECT_MENU')
	public async onUserSelect(
		@Context() [interaction]: UserSelectContext,
		@SelectedUsers() users: ISelectedUsers,
		@SelectedMembers() members: ISelectedMembers
	) {
		await interaction.reply({
			content: `
      Your selected users - ${users.map(user => user.username).join(',')}\n
      Your selected members - ${members.map(member => member.user?.username).join(',')}
      `
		});
	}

	@SlashCommand({ name: 'role-select', description: 'Creates role select menu component.' })
	public async createRoleSelect(@Context() [interaction]: SlashCommandContext) {
		return interaction.reply({
			content: `Role Select Menu`,
			components: [
				new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents([
					new RoleSelectMenuBuilder()
						.setCustomId('ROLE_SELECT_MENU')
						.setPlaceholder('Select a role')
						.setMaxValues(1)
						.setMinValues(1)
				])
			]
		});
	}

	@RoleSelect('ROLE_SELECT_MENU')
	public onRoleSelect(
		@Context() [interaction]: RoleSelectContext,
		@SelectedRoles() roles: ISelectedRoles
	) {
		return interaction.reply({
			content: `Your selected roles - ${roles.map(role => role.name).join(',')}`
		});
	}

	@SlashCommand({
		name: 'mentionable-select',
		description: 'Creates mentionable select menu component.'
	})
	public async createMentionableSelect(@Context() [interaction]: SlashCommandContext) {
		return interaction.reply({
			content: `Mentionable Select Menu`,
			components: [
				new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents([
					new MentionableSelectMenuBuilder()
						.setCustomId('MENTIONABLE_SELECT_MENU')
						.setPlaceholder('Select a mentionable (user or role)')
						.setMaxValues(1)
						.setMinValues(1)
				])
			]
		});
	}

	@MentionableSelect('MENTIONABLE_SELECT_MENU')
	public onMentionableSelect(
		@Context() [interaction]: MentionableSelectContext,
		@SelectedUsers() users: ISelectedUsers,
		@SelectedMembers() members: ISelectedMembers,
		@SelectedRoles() roles: ISelectedRoles
	) {
		return interaction.reply({
			content: `
      Selected roles - ${roles.map(role => role.name).join(',')}\n
      Selected users - ${users.map(user => user.username).join(',')}\n
      Selected members - ${members.map(member => member.user?.username).join(',')}
      `
		});
	}

	@SlashCommand({
		name: 'dynamic-select/:id',
		description: 'Creates a dynamic string select component.'
	})
	public async createDynamicStringSelect(@Context() [interaction]: SlashCommandContext) {
		return interaction.reply({
			content: `Dynamic String Select Menu`,
			components: [
				new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents([
					new StringSelectMenuBuilder()
						.setCustomId('preferences/color')
						.setPlaceholder('Select a color')
						.setMaxValues(1)
						.setMinValues(1)
						.setOptions([
							{ label: 'Red', value: 'Red' },
							{ label: 'Blue', value: 'Blue' },
							{ label: 'Yellow', value: 'Yellow' }
						])
				])
			]
		});
	}

	@StringSelect('preferences/:item')
	public onPreferenceSelect(
		@Context() [interaction]: StringSelectContext,
		@SelectedStrings() values: string[],
		@ComponentParam('item') item: string
	) {
		return interaction.reply({
			content: `
      ${item} = ${values.join(',')}\n
      `
		});
	}
}

createApplication(MessageComponentsLocalSpec);
