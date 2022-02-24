import { SetMetadata } from "@nestjs/common";
import { TextCommandMetadata } from "../../interfaces";
import { TEXT_COMMAND_METADATA } from "../../necord.constants";

export const TextCommand = (name: string, description?: string) =>
	SetMetadata<string, TextCommandMetadata>(TEXT_COMMAND_METADATA, {
		name,
		description
	});
