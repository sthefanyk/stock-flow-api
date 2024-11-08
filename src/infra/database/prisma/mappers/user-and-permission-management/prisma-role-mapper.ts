import { Role } from '@/domain/user-and-permission-management/enterprise/entities/role'
import { Prisma, Role as PrismaRole } from '@prisma/client'

export class PrismaRoleMapper {
    static toEntity(raw: PrismaRole): Role {
        return Role.create({
            name: raw.name,
        })
    }

    static toPrisma(entity: Role): Prisma.RoleUncheckedCreateInput {
        return {
            name: entity.name,
        }
    }
}
