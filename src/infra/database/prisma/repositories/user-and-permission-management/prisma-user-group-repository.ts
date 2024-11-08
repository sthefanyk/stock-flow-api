import { UserGroupDAO } from '@/domain/user-and-permission-management/application/DAO/user-group-dao'
import { UserGroup } from '@/domain/user-and-permission-management/enterprise/entities/user-group'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma.service'
import { PrismaUserGroupMapper } from '../../mappers/user-and-permission-management/prisma-user-group-mapper'

@Injectable()
export class PrismaUserGroupRepository implements UserGroupDAO {
    constructor(private prisma: PrismaService) {}

    async create(entity: UserGroup): Promise<void> {
        await this.prisma.userGroup.create({
            data: PrismaUserGroupMapper.toPrisma(entity),
        })
    }

    async save(entity: UserGroup): Promise<void> {
        await this.prisma.userGroup.update({
            where: {
                name: entity.name,
            },
            data: PrismaUserGroupMapper.toPrisma(entity),
        })
    }

    async delete(entity: UserGroup): Promise<void> {
        await this.prisma.userGroup.delete({
            where: {
                name: entity.name,
            },
        })
    }

    async findByName(name: string): Promise<UserGroup | null> {
        const prismaUserGroup = await this.prisma.userGroup.findUnique({
            where: { name },
            include: {
                permissions: {
                    include: {
                        usecase: true,
                        subdomain: true,
                    },
                },
                users: {
                    include: {
                        role: true,
                    },
                },
            },
        })

        if (prismaUserGroup) {
            return PrismaUserGroupMapper.toEntity(prismaUserGroup)
        }

        return null
    }

    async listAll(): Promise<UserGroup[]> {
        const usersPrisma = await this.prisma.userGroup.findMany({
            include: {
                permissions: {
                    include: {
                        usecase: true,
                        subdomain: true,
                    },
                },
                users: {
                    include: {
                        role: true,
                    },
                },
            },
        })

        return usersPrisma.map(PrismaUserGroupMapper.toEntity)
    }
}
