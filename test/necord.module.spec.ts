import { Test, TestingModule } from '@nestjs/testing';
import { Client } from 'discord.js';
import { NecordModule, NecordModuleOptions } from '../src';

describe('NecordModule', () => {
	let moduleRef: TestingModule;
	let client: Client;

	const token = 'test-token';

	beforeEach(async () => {
		client = new Client({ intents: [] });
		const options: NecordModuleOptions = { token, intents: [] };

		moduleRef = await Test.createTestingModule({
			imports: [NecordModule.forRoot(options)]
		})
			.overrideProvider(Client)
			.useValue(client)
			.compile();
	});

	it('should login on application bootstrap', async () => {
		const loginSpy = jest.spyOn(client, 'login').mockResolvedValue('logged');

		const necordModule = moduleRef.get(NecordModule);
		await necordModule.onApplicationBootstrap();

		expect(loginSpy).toHaveBeenCalledWith(token);
	});

	it('should destroy client on shutdown', async () => {
		const destroySpy = jest.spyOn(client, 'destroy').mockResolvedValue();

		const necordModule = moduleRef.get(NecordModule);
		await necordModule.onApplicationShutdown();

		expect(destroySpy).toHaveBeenCalled();
	});

	afterEach(async () => {
		jest.resetAllMocks();
	});
});
