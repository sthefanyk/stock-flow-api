import { User } from '@/domain/user-and-permission-management/enterprise/entities/user'
import { UserStatus } from '@/domain/user-and-permission-management/enterprise/enums/user-status'
import { User as PrismaUser, Role as RolePrisma, Prisma } from '@prisma/client'
import { PrismaRoleMapper } from './prisma-role-mapper'
import { UniqueEntityID } from '@/shared/value-objects/unique-entity-id'

export class PrismaUserMapper {
    static toEntity(raw: PrismaUser & { role: RolePrisma }): User {
        return User.create(
            {
                name: raw.name,
                email: raw.email,
                password: raw.password_hash,
                role: PrismaRoleMapper.toEntity(raw.role),
                status: UserStatus.getUserStatusByName(raw.status)!,
            },
            new UniqueEntityID(raw.id),
        )
    }

    static toPrisma(entity: User): Prisma.UserUncheckedCreateInput {
        return {
            id: entity.id.toString(),
            name: entity.name,
            email: entity.email,
            password_hash: entity.password,
            role_name: entity.role.name,
            status: entity.status.name,
        }
    }
}
