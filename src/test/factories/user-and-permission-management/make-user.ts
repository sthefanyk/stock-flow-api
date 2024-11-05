import { faker } from '@faker-js/faker'
import {
    User,
    UserProps,
} from '@/domain/user-and-permission-management/enterprise/entities/user'
import { makeRole } from './make-role'

export function makeUser(override: Partial<UserProps> = {}): User {
    const user = User.create({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 8 }),
        role: makeRole(),
        ...override,
    })

    return user
}
