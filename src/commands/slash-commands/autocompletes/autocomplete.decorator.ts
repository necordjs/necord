import { SetMetadata } from '@nestjs/common';
import { AutocompleteMeta } from './autocomplete.interfaces';

export const AUTOCOMPLETE_METADATA = 'necord:autocomplete_metadata';

export const Autocomplete = (...autocompletes: AutocompleteMeta): MethodDecorator =>
	SetMetadata(AUTOCOMPLETE_METADATA, autocompletes);
