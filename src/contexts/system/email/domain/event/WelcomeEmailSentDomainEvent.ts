import { DomainEvent, DomainEventAttributes } from "../../../../shared/domain/event/DomainEvent";

export class WelcomeEmailSentDomainEvent extends DomainEvent {
	static eventName = "pnfi.system.welcome_email.sent";
	constructor(
		public readonly id: string,
		public readonly userId: string,
		public readonly userName: string,
		public readonly fromEmailAddress: string,
		public readonly toEmailAddress: string,
		public readonly emailSubject: string,
		public readonly emailBody: string,
		eventId?: string,
		occurredOn?: Date
	) {
		super(WelcomeEmailSentDomainEvent.eventName, id, eventId, occurredOn);
	}

	static fromPrimitives(
		aggregateId: string,
		eventId: string,
		occurredOn: Date,
		attributes: DomainEventAttributes
	): WelcomeEmailSentDomainEvent {
		return new WelcomeEmailSentDomainEvent(
			aggregateId,
			attributes.userId as string,
			attributes.userName as string,
			attributes.fromEmailAddress as string,
			attributes.toEmailAddress as string,
			attributes.emailSubject as string,
			attributes.emailBody as string,
			eventId,
			occurredOn
		);
	}

	toPrimitives(): Record<string, unknown> {
		return {
			id: this.id,
			userId: this.userId,
			userName: this.userName,
			fromEmailAddress: this.fromEmailAddress,
			toEmailAddress: this.toEmailAddress,
			emailSubject: this.emailSubject,
			emailBody: this.emailBody
		};
	}
}
