import { User, UserPrimitives } from "../../../../../src/contexts/cma/users/domain/User";
import { UserStatus } from "../../../../../src/contexts/cma/users/domain/UserStatus";
import { UserAvatarMother } from "./UserAvatarMother";
import { UserEmailMother } from "./UserEmailMother";
import { UserEmailVerifiedMother } from "./UserEmailVerifiedMother";
import { UserIdMother } from "./UserIdMother";
import { UserNameMother } from "./UserNameMother";

export class UserMother {
	static create(params?: Partial<UserPrimitives>): User {
		const primitives: UserPrimitives = {
			id: UserIdMother.create().value,
			name: UserNameMother.create().value,
			email: UserEmailMother.create().value,
			emailVerified: UserEmailVerifiedMother.create().value,
			avatar: UserAvatarMother.create().value.toString(),
			status: UserStatus.ACTIVE,
			...params
		};

		return User.fromPrimitives(primitives);
	}
}
