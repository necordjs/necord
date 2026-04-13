import { BaseHandler } from './base.handler';
import { Injectable } from '@nestjs/common';
import { CustomListener, CustomListenerHandler } from '../decorators';
import { ContextOf } from '../../context';
import { GuildMember, VoiceBasedChannel } from 'discord.js';

export type CustomVoiceStateUpdateEvents = {
	voiceChannelJoin: [member: GuildMember | null, channel: VoiceBasedChannel];
	voiceChannelSwitch: [
		member: GuildMember | null,
		oldChannel: VoiceBasedChannel,
		newChannel: VoiceBasedChannel
	];
	voiceChannelLeave: [member: GuildMember | null, channel: VoiceBasedChannel];
	voiceChannelMute: [member: GuildMember | null, type: 'self-muted' | 'server-muted'];
	voiceChannelUnmute: [member: GuildMember | null, type: 'self-muted' | 'server-muted'];
	voiceChannelDeaf: [member: GuildMember | null, type: 'self-deafed' | 'server-deafed'];
	voiceChannelUndeaf: [member: GuildMember | null, type: 'self-deafed' | 'server-deafed'];
	voiceStreamingStart: [member: GuildMember | null, channel: VoiceBasedChannel | null];
	voiceStreamingStop: [member: GuildMember | null, channel: VoiceBasedChannel | null];
};

@Injectable()
@CustomListener('voiceStateUpdate')
export class VoiceStateUpdateHandler extends BaseHandler<CustomVoiceStateUpdateEvents> {
	@CustomListenerHandler()
	public handleVoiceChannelChanges([oldState, newState]: ContextOf<'voiceStateUpdate'>) {
		const newMember = newState.member;

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

		if (!oldState.streaming && newState.streaming) {
			this.emit('voiceStreamingStart', newMember, newState.channel);
		}

		if (oldState.streaming && !newState.streaming) {
			this.emit('voiceStreamingStop', newMember, newState.channel);
		}
	}
}
