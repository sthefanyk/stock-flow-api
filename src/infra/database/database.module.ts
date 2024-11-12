import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { RoleDAO } from '@/domain/user-and-permission-management/application/DAO/role-dao'
import { RepositoriesProvider } from './providers/repositories.provider'
import { UserDAO } from '@/domain/user-and-permission-management/application/DAO/user-dao'
import { SubdomainDAO } from '@/domain/user-and-permission-management/application/DAO/subdomain-dao'
import { UseCaseDAO } from '@/domain/user-and-permission-management/application/DAO/usecase-dao'
import { PermissionDAO } from '@/domain/user-and-permission-management/application/DAO/permission-dao'
import { UserGroupDAO } from '@/domain/user-and-permission-management/application/DAO/user-group-dao'
import { ActionLogDAO } from '@/domain/activity-log/application/DAO/action-log-dao'
import { CacheModule } from '../cache/cache.module'

@Module({
    imports: [CacheModule],
    providers: [PrismaService, ...RepositoriesProvider],
    exports: [
        PrismaService,
        UserDAO,
        RoleDAO,
        SubdomainDAO,
        UseCaseDAO,
        PermissionDAO,
        UserGroupDAO,
        ActionLogDAO,
    ],
})
export class DatabaseModule {}
