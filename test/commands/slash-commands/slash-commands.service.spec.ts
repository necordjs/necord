import { Collection } from 'discord.js';
import { Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
	SlashCommand,
	SlashCommandDiscovery,
	SlashCommandsService,
	SubcommandGroup
} from '../../../src';

describe('SlashCommandsService', () => {
	let reflector: Reflector;
	let service: SlashCommandsService;

	beforeEach(() => {
		reflector = new Reflector();
		service = new SlashCommandsService(reflector);
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('adds a command to the cache and retrieves it', () => {
		const cmd = new SlashCommandDiscovery({ name: 'ping', description: 'ping' });
		service.add(cmd);

		expect(service.cache).toBeInstanceOf(Collection);
		expect(service.cache.size).toBe(1);
		expect(service.get('ping')).toBe(cmd);
	});

	it('logs a warning when adding a command with a duplicate name', () => {
		const warnSpy = jest.spyOn(Logger.prototype as any, 'warn').mockImplementation(() => {});
		const cmd = new SlashCommandDiscovery({ name: 'ping', description: 'ping' });

		service.add(cmd);
		service.add(cmd); // duplicate

		expect(warnSpy).toHaveBeenCalledTimes(1);
		expect(service.get('ping')).toBe(cmd);
		expect(service.cache.size).toBe(1);
	});

	it('returns undefined when getting a non-existent command', () => {
		expect(service.get('unknown')).toBeUndefined();
	});

	it('removes a command and returns true; removing again returns false', () => {
		const cmd = new SlashCommandDiscovery({ name: 'to-remove', description: 'remove me' });
		service.add(cmd as any);

		expect(service.remove('to-remove')).toBe(true);
		expect(service.get('to-remove')).toBeUndefined();
		expect(service.remove('to-remove')).toBe(false);
	});

	it('addSubCommand (no group): ensures the root command and attaches the subcommand', () => {
		// Arrange a root and a subcommand
		const root = new SlashCommandDiscovery({ name: 'root', description: 'root command' });
		const sub = new SlashCommandDiscovery({ name: 'child', description: 'child command' });
		// Spy on ensureSubcommand to ensure it was called with sub
		const rootEnsureSpy = jest.spyOn(root, 'ensureSubcommand');

		// Reflector returns the root for SlashCommand.KEY and undefined for SubcommandGroup.KEY
		jest.spyOn(reflector, 'get').mockImplementation((key: any, target: any) => {
			if (target === sub.getClass()) {
				if (key === SlashCommand.KEY) return root as any;
				if (key === SubcommandGroup.KEY) return undefined;
			}
			return undefined;
		});

		// Act
		service.addSubCommand(sub as any);

		// Assert: root is ensured into the cache by name
		expect(service.cache.get('root')).toBe(root);
		// Assert: root.ensureSubcommand called with the sub
		expect(rootEnsureSpy).toHaveBeenCalledTimes(1);
		expect(rootEnsureSpy).toHaveBeenCalledWith(sub);
	});

	it('addSubCommand (with group): ensures root, ensures group under root, and ensures sub under group', () => {
		const root = new SlashCommandDiscovery({ name: 'root', description: 'root command' });
		// Spy to verify group is ensured into root
		const groupEnsureSpy = jest.fn((_: SlashCommandDiscovery) => group);
		const group = new SlashCommandDiscovery({ name: 'group', description: 'group command' });
		// Override root.ensureSubcommand to use our spy
		root.ensureSubcommand = groupEnsureSpy;

		// Subcommand to add
		const sub = new SlashCommandDiscovery({ name: 'child', description: 'child command' });

		// Spy to verify call ordering: root.ensureSubcommand(group) then group.ensureSubcommand(sub)
		const rootEnsureSpy = jest.spyOn(root, 'ensureSubcommand');
		const subEnsureSpy = jest.spyOn(group, 'ensureSubcommand');

		// Reflector returns root for SlashCommand.KEY and group for SubcommandGroup.KEY
		jest.spyOn(reflector, 'get').mockImplementation((key: any, target: any) => {
			if (target === sub.getClass()) {
				if (key === (SlashCommand as any).KEY) return root as any;
				if (key === (SubcommandGroup as any).KEY) return group as any;
			}
			return undefined;
		});

		service.addSubCommand(sub as any);

		// Root must be present in cache (ensured)
		expect(service.cache.get('root')).toBe(root);

		// Root should ensure the group
		expect(rootEnsureSpy).toHaveBeenCalledTimes(1);
		expect(rootEnsureSpy).toHaveBeenCalledWith(group);

		// Group should ensure the sub
		expect(subEnsureSpy).toHaveBeenCalledTimes(1);
		expect(subEnsureSpy).toHaveBeenCalledWith(sub);

		// Also verify our custom groupEnsureSpy was used to return the ensured group
		expect(groupEnsureSpy).toHaveBeenCalledTimes(1);
	});
});
