import { GuildMember, VoiceBasedChannel } from 'discord.js';
import { Injectable } from '@nestjs/common';

import { CustomListener, CustomListenerHandler } from '../decorators/index.js';
import { ContextOf } from '../../context/index.js';
import { BaseHandler } from './base.handler.js';

export type CustomVoiceStateUpdateEvents = {
	voiceChannelJoin: [member: GuildMember, channel: VoiceBasedChannel];
	voiceChannelSwitch: [
		member: GuildMember,
		oldChannel: VoiceBasedChannel,
		newChannel: VoiceBasedChannel
	];
	voiceChannelLeave: [member: GuildMember, channel: VoiceBasedChannel];
	voiceChannelMute: [member: GuildMember, type: 'self-muted' | 'server-muted'];
	voiceChannelUnmute: [member: GuildMember, type: 'self-muted' | 'server-muted'];
	voiceChannelDeaf: [member: GuildMember, type: 'self-deafed' | 'server-deafed'];
	voiceChannelUndeaf: [member: GuildMember, type: 'self-deafed' | 'server-deafed'];
	voiceStreamingStart: [member: GuildMember, channel: VoiceBasedChannel];
	voiceStreamingStop: [member: GuildMember, channel: VoiceBasedChannel];
};

@CustomListener('voiceStateUpdate')
@Injectable()
export class VoiceStateUpdateHandler extends BaseHandler<CustomVoiceStateUpdateEvents> {
	@CustomListenerHandler()
	public handleVoiceChannelChanges([oldState, newState]: ContextOf<'voiceStateUpdate'>) {
		const newMember = newState.member;

		if (!newMember) {
			return;
		}

		if (!oldState.channel && newState.channel) {
			this.emit('voiceChannelJoin', newMember, newState.channel);
		}

		if (oldState.channel && newState.channel && oldState.channel.id !== newState.channel.id) {
			this.emit('voiceChannelSwitch', newMember, oldState.channel, newState.channel);
		}

		if (oldState.channel && !newState.channel) {
			this.emit('voiceChannelLeave', newMember, oldState.channel);
		}
	}

	@CustomListenerHandler()
	public handleVoiceChannelMuteChanges([oldState, newState]: ContextOf<'voiceStateUpdate'>) {
		const newMember = newState.member;

		if (!newMember) {
			return;
		}

		if (!oldState.mute && newState.mute) {
			this.emit(
				'voiceChannelMute',
				newMember,
				newState.selfMute ? 'self-muted' : 'server-muted'
			);
		}

		if (oldState.mute && !newState.mute) {
			this.emit(
				'voiceChannelUnmute',
				newMember,
				oldState.selfMute ? 'self-muted' : 'server-muted'
			);
		}
	}

	@CustomListenerHandler()
	public handleVoiceChannelDeafChanges([oldState, newState]: ContextOf<'voiceStateUpdate'>) {
		const newMember = newState.member;

		if (!newMember) {
			return;
		}

		if (!oldState.deaf && newState.deaf) {
			this.emit(
				'voiceChannelDeaf',
				newMember,
				newState.selfDeaf ? 'self-deafed' : 'server-deafed'
			);
		}

		if (oldState.deaf && !newState.deaf) {
			this.emit(
				'voiceChannelUndeaf',
				newMember,
				oldState.selfDeaf ? 'self-deafed' : 'server-deafed'
			);
		}
	}

	@CustomListenerHandler()
	public handleVoiceStreamingChanges([oldState, newState]: ContextOf<'voiceStateUpdate'>) {
		const newMember = newState.member;

		if (!newMember) {
			return;
		}

		if (!oldState.streaming && newState.streaming) {
			if (newState.channel) {
				this.emit('voiceStreamingStart', newMember, newState.channel);
			}
		}

		if (oldState.streaming && !newState.streaming) {
			if (oldState.channel) {
				this.emit('voiceStreamingStop', newMember, oldState.channel);
			}
		}
	}
}
