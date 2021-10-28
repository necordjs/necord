import { Inject, Injectable } from '@nestjs/common';
import { REST } from '@discordjs/rest';
import { MODULE_OPTIONS } from '../necord.constants';
import { NecordModuleOptions } from '../interfaces';

@Injectable()
export class RestService extends REST {
	public constructor(@Inject(MODULE_OPTIONS) private readonly options: NecordModuleOptions) {
		super({ version: '9' });

		this.setToken(this.options.token);
	}
}
