import { PermissionDAO } from '@/domain/user-and-permission-management/application/DAO/permission-dao'
import { Permission } from '@/domain/user-and-permission-management/enterprise/entities/permission'
import { Subdomain } from '@/domain/user-and-permission-management/enterprise/entities/subdomain'
import { UseCase } from '@/domain/user-and-permission-management/enterprise/entities/usecase'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma.service'
import { PrismaPermissionMapper } from '../../mappers/user-and-permission-management/prisma-permission-mapper'

@Injectable()
export class PrismaPermissionRepository implements PermissionDAO {
    constructor(private prisma: PrismaService) {}

    async create(entity: Permission): Promise<void> {
        await this.prisma.permission.create({
            data: PrismaPermissionMapper.toPrisma(entity),
        })
    }

    async save(entity: Permission): Promise<void> {
        await this.prisma.permission.update({
            where: {
                subdomain_name_use_case_name: {
                    subdomain_name: entity.subdomain.name,
                    use_case_name: entity.usecase.name,
                },
            },
            data: PrismaPermissionMapper.toPrisma(entity),
        })
    }

    async delete(entity: Permission): Promise<void> {
        await this.prisma.permission.delete({
            where: {
                subdomain_name_use_case_name: {
                    subdomain_name: entity.subdomain.name,
                    use_case_name: entity.usecase.name,
                },
            },
        })
    }

    async find(entity: Permission): Promise<Permission | null> {
        const prismaPermission = await this.prisma.permission.findUnique({
            where: {
                subdomain_name_use_case_name: {
                    subdomain_name: entity.subdomain.name,
                    use_case_name: entity.usecase.name,
                },
            },
            include: {
                subdomain: true,
                usecase: true,
            },
        })

        if (prismaPermission) {
            return PrismaPermissionMapper.toEntity(prismaPermission)
        }

        return null
    }

    async findByUsecase(usecase: UseCase): Promise<Permission[]> {
        const prismaPermissions = await this.prisma.permission.findMany({
            where: {
                use_case_name: usecase.name,
            },
            include: {
                subdomain: true,
                usecase: true,
            },
        })

        return prismaPermissions.map(PrismaPermissionMapper.toEntity)
    }

    async findBySubdomain(subdomain: Subdomain): Promise<Permission[]> {
        const prismaPermissions = await this.prisma.permission.findMany({
            where: {
                subdomain_name: subdomain.name,
            },
            include: {
                subdomain: true,
                usecase: true,
            },
        })

        return prismaPermissions.map(PrismaPermissionMapper.toEntity)
    }

    async listAll(): Promise<Permission[]> {
        const prismaPermissions = await this.prisma.permission.findMany({
            include: {
                subdomain: true,
                usecase: true,
            },
        })

        return prismaPermissions.map(PrismaPermissionMapper.toEntity)
    }
}
