import { AggregateRoot } from "../../../shared/domain/AggregateRoot";
import { AnnouncementStatus } from "./AnnouncementStatus";
import { AnnouncementContent } from "./AnnouncementContent";
import { AnnouncementId } from "./AnnouncementId";
import { AnnouncementPublishDate } from "./AnnouncementPublishDate";
import { AnnouncementTitle } from "./AnnouncementTitle";
import { AnnouncementType } from "./AnnouncementType";
import { AnnouncementContentUpdatedDomainEvent } from "./event/AnnouncementContentUpdatedDomainEvent";
import { AnnouncementPostedDomainEvent } from "./event/AnnouncementPostedDomainEvent";
import { AnnouncementTitleUpdatedDomainEvent } from "./event/AnnouncementTitleUpdatedDomainEvent";
import { AnnouncementPublishedDomainEvent } from "./event/AnnouncementPublishedDomainEvent";
import { AnnouncementArchivedDomainEvent } from "./event/AnnouncementArchivedDomainEvent";
import { AnnouncementRestoredDomainEvent } from "./event/AnnouncementRestoredDomainEvent";

export interface AnnouncementPrimitives {
	id: string;
	title: string;
	content: string;
	publishDate: string;
	type: string;
	status: string;
}

export class Announcement extends AggregateRoot {
	constructor(
		private readonly id: AnnouncementId,
		private title: AnnouncementTitle,
		private content: AnnouncementContent,
		private readonly publishDate: AnnouncementPublishDate,
		private readonly type: AnnouncementType,
		private status: AnnouncementStatus
	) {
		super();
	}

	static create(
		id: string,
		title: string,
		content: string,
		publishDate: string,
		type: string,
	): Announcement {
		const announcement = new Announcement(
			new AnnouncementId(id),
			new AnnouncementTitle(title),
			new AnnouncementContent(content),
			new AnnouncementPublishDate(publishDate),
			type as AnnouncementType,
			AnnouncementStatus.DRAFT
		);

		announcement.record(
			new AnnouncementPostedDomainEvent(id, title, content, publishDate, type)
		);

		return announcement;
	}

	static fromPrimitives(plainData: AnnouncementPrimitives): Announcement {
		return new Announcement(
			new AnnouncementId(plainData.id),
			new AnnouncementTitle(plainData.title),
			new AnnouncementContent(plainData.content),
			new AnnouncementPublishDate(plainData.publishDate),
			plainData.type as AnnouncementType,
			plainData.status as AnnouncementStatus
		);
	}

	toPrimitives(): AnnouncementPrimitives {
		return {
			id: this.id.value,
			title: this.title.value,
			content: this.content.value,
			publishDate: this.publishDate.value.toISOString(),
			type: this.type,
			status: this.status
		};
	}

	updateTitle(title: string): void {
		this.title = new AnnouncementTitle(title);
		this.record(new AnnouncementTitleUpdatedDomainEvent(this.id.value, title));
	}

	updateContent(content: string): void {
		this.content = new AnnouncementContent(content);
		this.record(new AnnouncementContentUpdatedDomainEvent(this.id.value, content));
	}

	publish(): void {
		this.status = AnnouncementStatus.PUBLISHED;
		this.record(new AnnouncementPublishedDomainEvent(
			this.id.value,
			this.title.value,
			this.content.value,
			this.publishDate.value.toISOString(),
			this.type
		));
	}

	archive(): void {
		this.status = AnnouncementStatus.ARCHIVED;
		this.record(new AnnouncementArchivedDomainEvent(this.id.value));
	}

	restore(): void {
		this.status = AnnouncementStatus.DRAFT;
		this.record(
			new AnnouncementRestoredDomainEvent(this.id.value)
		);
	}
}