import { DomainError } from "../../../shared/domain/DomainError";

export class AnnouncementContentTooLongError extends DomainError {
	readonly type = "announcement_content_too_long_error";
	readonly message = `The announcement content <<< ${this.content} >>> is longer than ${this.maxLength} characters.`;

	constructor(
		public readonly content: string,
		public readonly maxLength: number
	) {
		super();
	}
}
