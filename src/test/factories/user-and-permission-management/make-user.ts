import { faker } from '@faker-js/faker'
import {
    User,
    UserProps,
} from '@/domain/user-and-permission-management/enterprise/entities/user'
import { makeRole } from './make-role'
import { UserStatus } from '@/domain/user-and-permission-management/enterprise/enums/user-status'

export function makeUser(override: Partial<UserProps> = {}): User {
    const user = User.create({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 8 }),
        role: makeRole(),
        status: UserStatus.ACTIVE,
        ...override,
    })

    return user
}
