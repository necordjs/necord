import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { loadPackage } from '@nestjs/common/utils/load-package.util';

let classValidator: any = {};
let classTransformer: any = {};

@Injectable()
export class NecordValidationPipe implements PipeTransform<any> {
	public constructor() {
		classValidator = this.loadValidator();
		classTransformer = this.loadTransformer();
	}

	public async transform(value: any, metadata: ArgumentMetadata) {
		console.log(value, metadata);
	}

	protected loadValidator() {
		return loadPackage('class-validator', 'NecordValidationPipe', () => require('class-validator'));
	}

	protected loadTransformer() {
		return loadPackage('class-transformer', 'NecordValidationPipe', () => require('class-transformer'));
	}
}
