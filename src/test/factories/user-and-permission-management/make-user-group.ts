import { faker } from '@faker-js/faker'
import {
    UserGroup,
    UserGroupProps,
} from '@/domain/user-and-permission-management/enterprise/entities/user-group'
import { makePermission } from './make-permission'
import { makeUser } from './make-user'
import { UserList } from '@/domain/user-and-permission-management/enterprise/watched-lists/user-list'
import { PermissionList } from '@/domain/user-and-permission-management/enterprise/watched-lists/permission-list'

export function makeUserGroup(
    override: Partial<UserGroupProps> = {},
): UserGroup {
    const userGroup = UserGroup.create({
        name: faker.person.jobArea(),
        permissions: new PermissionList([
            makePermission(),
            makePermission(),
            makePermission(),
        ]),
        users: new UserList([makeUser(), makeUser(), makeUser()]),
        ...override,
    })

    return userGroup
}
