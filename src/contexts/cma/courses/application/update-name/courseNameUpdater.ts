import { EventBus } from "../../../../shared/domain/event/EventBus";
import { CourseFinder } from "../../domain/CourseFinder";
import { CourseRepository } from "../../domain/CourseRepository";

export class EventNameUpdater {
	private readonly finder: CourseFinder;
	constructor(
		private readonly repository: CourseRepository,
		private readonly eventBus: EventBus
	) {
		this.finder = new CourseFinder(repository);
	}

	async update(id: string, name: string): Promise<void> {
		const course = await this.finder.find(id);
		course.updateName(name);
		await this.repository.save(course);
		await this.eventBus.publish(course.pullDomainEvents());
	}
}