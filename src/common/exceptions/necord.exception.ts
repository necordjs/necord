import { CommandException } from '../enums/command-exception.enum';

export class NecordException {
	public constructor(
		public readonly exception: CommandException,
		public readonly payload: Record<string, any> = {}
	) {}
}
