import { UserGroup } from '@/domain/user-and-permission-management/enterprise/entities/user-group'
import { PermissionList } from '@/domain/user-and-permission-management/enterprise/watched-lists/permission-list'
import { UserList } from '@/domain/user-and-permission-management/enterprise/watched-lists/user-list'
import {
    Prisma,
    UserGroup as PrismaUserGroup,
    User as PrismaUser,
    Role as PrismaRole,
    Permission as PrismaPermission,
    UseCase as PrismaUseCase,
    Subdomain as PrismaSubdomain,
} from '@prisma/client'
import { PrismaPermissionMapper } from './prisma-permission-mapper'
import { PrismaUserMapper } from './prisma-user-mapper'

export class PrismaUserGroupMapper {
    static toEntity(
        raw: PrismaUserGroup & {
            permissions: (PrismaPermission & {
                usecase: PrismaUseCase
                subdomain: PrismaSubdomain
            })[]
            users: (PrismaUser & { role: PrismaRole })[]
        },
    ): UserGroup {
        const permissions = raw.permissions.map(PrismaPermissionMapper.toEntity)
        const users = raw.users.map(PrismaUserMapper.toEntity)

        return UserGroup.create({
            name: raw.name,
            permissions: new PermissionList(permissions),
            users: new UserList(users),
        })
    }

    static toPrisma(entity: UserGroup): Prisma.UserGroupUncheckedCreateInput {
        const permissionsToCreate = entity.permissions.map(
            PrismaPermissionMapper.toPrisma,
        )

        const usersToCreate = entity.users.map(PrismaUserMapper.toPrisma)

        return {
            name: entity.name,
            permissions: { create: permissionsToCreate },
            users: { create: usersToCreate },
        }
    }
}
