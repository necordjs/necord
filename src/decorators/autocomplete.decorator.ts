import { SetMetadata, Type } from '@nestjs/common';
import { AUTOCOMPLETE_METADATA } from '../necord.constants';
import { TransformOptions } from '../interfaces';

export const Autocomplete = (...autocompletes: Type<TransformOptions>[]): MethodDecorator =>
	SetMetadata(AUTOCOMPLETE_METADATA, autocompletes);
