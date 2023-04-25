export interface OnCollectorFilter {
	(...args: any): boolean;
}

export interface OnCollectorCollect {
	(...args: any): any;
}

export interface OnCollectorIgnore {
	(...args: any): any;
}

export interface OnCollectorDispose {
	(...args: any): any;
}
