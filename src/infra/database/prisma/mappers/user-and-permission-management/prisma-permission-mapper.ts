import { Permission } from '@/domain/user-and-permission-management/enterprise/entities/permission'
import {
    Permission as PrismaPermission,
    Prisma,
    UseCase as PrismaUseCase,
    Subdomain as PrismaSubdomain,
} from '@prisma/client'
import { PrismaSubdomainMapper } from './prisma-subdomain-mapper'
import { AccessLevel } from '@/domain/user-and-permission-management/enterprise/enums/access-level'

export class PrismaPermissionMapper {
    static toEntity(
        raw: PrismaPermission & { usecase: PrismaUseCase } & {
            subdomain: PrismaSubdomain
        },
    ): Permission {
        return Permission.create({
            subdomain: PrismaSubdomainMapper.toEntity(raw.subdomain),
            usecase: PrismaSubdomainMapper.toEntity(raw.usecase),
            accessLevel: AccessLevel.getAccessLevelByName(raw.access_level)!,
        })
    }

    static toPrisma(entity: Permission): Prisma.PermissionUncheckedCreateInput {
        return {
            use_case_name: entity.usecase.name,
            subdomain_name: entity.subdomain.name,
            access_level: entity.accessLevel.name,
        }
    }
}
