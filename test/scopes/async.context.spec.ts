import { ASYNC_CONTEXT_ATTRIBUTE, AsyncContext } from '../../src';

describe('AsyncContext', () => {
	it('should create a unique context id', () => {
		const context1 = new AsyncContext();
		const context2 = new AsyncContext();

		expect(context1.id).toBeDefined();
		expect(context2.id).toBeDefined();
		expect(context1.id).not.toEqual(context2.id);
	});

	it('should attach context to an object', () => {
		const context = new AsyncContext();
		const obj = {};

		context.attachTo(obj);

		expect(obj[ASYNC_CONTEXT_ATTRIBUTE]).toBe(context);
		expect(Object.getOwnPropertyDescriptor(obj, ASYNC_CONTEXT_ATTRIBUTE)?.enumerable).toBe(
			false
		);
	});

	it('should detect if an object has context attached', () => {
		const obj = {};
		expect(AsyncContext.isAttached(obj)).toBe(false);

		const context = new AsyncContext();
		context.attachTo(obj);

		expect(AsyncContext.isAttached(obj)).toBe(true);
	});

	it('should merge context from one object to another', () => {
		const source = {};
		const target = {};

		const context = new AsyncContext();
		context.attachTo(source);

		AsyncContext.merge(source, target);

		expect(target[ASYNC_CONTEXT_ATTRIBUTE]).toBe(context);
	});

	it('should not merge context if source has no context', () => {
		const source = {};
		const target = {};

		AsyncContext.merge(source, target);

		expect(target[ASYNC_CONTEXT_ATTRIBUTE]).toBeUndefined();
	});

	it('should retrieve context from an object', () => {
		const context = new AsyncContext();
		const obj = {};

		context.attachTo(obj);

		expect(AsyncContext.of(obj)).toBe(context);
	});

	it('should return undefined if no context is attached', () => {
		const obj = {};
		expect(AsyncContext.of(obj)).toBeUndefined();
	});
});
