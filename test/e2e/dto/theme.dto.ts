import { StringOption } from '../../../src';

export enum Style {
	CHRISTMAS = 'christmas',
	HALLOWEEN = 'halloween',
	SUMMER = 'summer'
}

export class ThemeDto {
	@StringOption({
		name: 'style',
		description: 'Select your theme style',
		autocomplete: true,
		required: true
	})
	style: Style;
}
