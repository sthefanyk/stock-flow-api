import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { PrismaRoleRepository } from './prisma/repositories/user-and-permission-management/prisma-role-repository'
import { PrismaPermissionRepository } from './prisma/repositories/user-and-permission-management/prisma-permission-repository'
import { PrismaSubdomainRepository } from './prisma/repositories/user-and-permission-management/prisma-subdomain-repository'
import { PrismaUserRepository } from './prisma/repositories/user-and-permission-management/prisma-user-repository'
import { PrismaActionLogRepository } from './prisma/repositories/activity-log/prisma-action-log-repository'
import { PrismaUseCaseRepository } from './prisma/repositories/user-and-permission-management/prisma-usecase-repository'
import { PrismaUserGroupRepository } from './prisma/repositories/user-and-permission-management/prisma-user-group-repository'

@Module({
    providers: [
        PrismaService,
        PrismaUserRepository,
        PrismaRoleRepository,
        PrismaSubdomainRepository,
        PrismaUseCaseRepository,
        PrismaPermissionRepository,
        PrismaUserGroupRepository,
        PrismaActionLogRepository,
    ],
    exports: [
        PrismaService,
        PrismaUserRepository,
        PrismaRoleRepository,
        PrismaSubdomainRepository,
        PrismaUseCaseRepository,
        PrismaPermissionRepository,
        PrismaUserGroupRepository,
        PrismaActionLogRepository,
    ],
})
export class DatabaseModule {}
