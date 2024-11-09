import { Provider } from '@nestjs/common'
import { PrismaRoleRepository } from '@/infra/database/prisma/repositories/user-and-permission-management/prisma-role-repository'
import { RoleDAO } from '@/domain/user-and-permission-management/application/DAO/role-dao'
import { UserDAO } from '@/domain/user-and-permission-management/application/DAO/user-dao'
import { PermissionDAO } from '@/domain/user-and-permission-management/application/DAO/permission-dao'
import { UseCaseDAO } from '@/domain/user-and-permission-management/application/DAO/usecase-dao'
import { SubdomainDAO } from '@/domain/user-and-permission-management/application/DAO/subdomain-dao'
import { UserGroupDAO } from '@/domain/user-and-permission-management/application/DAO/user-group-dao'
import { PrismaUserRepository } from '../prisma/repositories/user-and-permission-management/prisma-user-repository'
import { PrismaPermissionRepository } from '../prisma/repositories/user-and-permission-management/prisma-permission-repository'
import { PrismaUseCaseRepository } from '../prisma/repositories/user-and-permission-management/prisma-usecase-repository'
import { PrismaSubdomainRepository } from '../prisma/repositories/user-and-permission-management/prisma-subdomain-repository'
import { PrismaUserGroupRepository } from '../prisma/repositories/user-and-permission-management/prisma-user-group-repository'
import { ActionLogDAO } from '@/domain/activity-log/application/DAO/action-log-dao'
import { PrismaActionLogRepository } from '../prisma/repositories/activity-log/prisma-action-log-repository'

export const RepositoriesProvider: Provider[] = [
    {
        provide: RoleDAO,
        useClass: PrismaRoleRepository,
    },
    {
        provide: UserDAO,
        useClass: PrismaUserRepository,
    },
    {
        provide: PermissionDAO,
        useClass: PrismaPermissionRepository,
    },
    {
        provide: UseCaseDAO,
        useClass: PrismaUseCaseRepository,
    },
    {
        provide: SubdomainDAO,
        useClass: PrismaSubdomainRepository,
    },
    {
        provide: UserGroupDAO,
        useClass: PrismaUserGroupRepository,
    },
    {
        provide: ActionLogDAO,
        useClass: PrismaActionLogRepository,
    },
]
