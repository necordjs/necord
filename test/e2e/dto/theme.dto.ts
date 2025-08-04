import { StringOption } from '../../src';

export enum Style {
	HALLOWEEN = 'halloween',
	CHRISTMAS = 'christmas',
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
