import { Test, TestingModule } from '@nestjs/testing';
import {
	ChannelsProvider,
	GuildsProvider,
	RestProvider,
	ShardProvider,
	UsersProvider,
	VoiceProvider,
	WsProvider
} from '../../src';
import {
	ChannelManager,
	Client,
	ClientVoiceManager,
	GuildManager,
	REST,
	ShardClientUtil,
	UserManager,
	WebSocketManager
} from 'discord.js';

describe('Client Providers', () => {
	const mockClient = {
		channels: Symbol('channels'),
		guilds: Symbol('guilds'),
		rest: Symbol('rest'),
		shard: Symbol('shard'),
		users: Symbol('users'),
		voice: Symbol('voice'),
		ws: Symbol('ws')
	};

	let moduleRef: TestingModule;

	beforeAll(async () => {
		moduleRef = await Test.createTestingModule({
			providers: [
				ChannelsProvider,
				GuildsProvider,
				RestProvider,
				ShardProvider,
				VoiceProvider,
				UsersProvider,
				WsProvider,
				{
					provide: Client,
					useValue: mockClient
				}
			]
		}).compile();
	});

	it('should provide the Client instance', () => {
		const client = moduleRef.get<Client>(Client);
		expect(client).toBe(mockClient);
	});

	it('should provide the ChannelManager from Client', () => {
		const channels = moduleRef.get<ChannelManager>(ChannelManager);
		expect(channels).toBe(mockClient.channels);
	});

	it('should provide the GuildManager from Client', () => {
		const guilds = moduleRef.get<GuildManager>(GuildManager);
		expect(guilds).toBe(mockClient.guilds);
	});

	it('should provide the REST from Client', () => {
		const rest = moduleRef.get<REST>(REST);
		expect(rest).toBe(mockClient.rest);
	});

	it('should provide the ShardManager from Client', () => {
		const shard = moduleRef.get(ShardClientUtil);
		expect(shard).toBe(mockClient.shard);
	});

	it('should provide the Users from Client', () => {
		const users = moduleRef.get(UserManager);
		expect(users).toBe(mockClient.users);
	});

	it('should provide the Voice from Client', () => {
		const voice = moduleRef.get(ClientVoiceManager);
		expect(voice).toBe(mockClient.voice);
	});

	it('should provide the WebSocket from Client', () => {
		const ws = moduleRef.get(WebSocketManager);
		expect(ws).toBe(mockClient.ws);
	});
});
