import { EventBus } from "../../../../shared/domain/event/EventBus";
import { UserFinder } from "../../domain/UserFinder";
import { UserRepository } from "../../domain/UserRepository";

export class UserRestorer {
	private readonly finder: UserFinder;

	constructor(
		private readonly repository: UserRepository,
		private readonly eventBus: EventBus
	) {
		this.finder = new UserFinder(repository);
	}

	async restore(id: string): Promise<void> {
		const user = await this.finder.find(id);

		user.restore();

		await this.repository.save(user);
		await this.eventBus.publish(user.pullDomainEvents());
	}
}
