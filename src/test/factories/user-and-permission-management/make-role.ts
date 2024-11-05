import { faker } from '@faker-js/faker'
import {
    Role,
    RoleProps,
} from '@/domain/user-and-permission-management/enterprise/entities/role'

export function makeRole(override: Partial<RoleProps> = {}): Role {
    const role = Role.create({
        name: faker.person.jobArea(),
        ...override,
    })

    return role
}
