import { RoleDAO } from '@/domain/user-and-permission-management/application/DAO/role-dao'
import { Role } from '@/domain/user-and-permission-management/enterprise/entities/role'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma.service'
import { PrismaRoleMapper } from '../../mappers/user-and-permission-management/prisma-role-mapper'

@Injectable()
export class PrismaRoleRepository implements RoleDAO {
    constructor(private prisma: PrismaService) {}

    async create(entity: Role): Promise<void> {
        await this.prisma.role.create({
            data: PrismaRoleMapper.toPrisma(entity),
        })
    }

    async save(entity: Role): Promise<void> {
        await this.prisma.role.update({
            where: { name: entity.name },
            data: PrismaRoleMapper.toPrisma(entity),
        })
    }

    async delete(entity: Role): Promise<void> {
        await this.prisma.role.delete({
            where: { name: entity.name },
        })
    }

    async findByName(name: string): Promise<Role | null> {
        const prismaRole = await this.prisma.role.findUnique({
            where: { name },
        })

        if (prismaRole) {
            return PrismaRoleMapper.toEntity(prismaRole)
        }

        return null
    }

    async listAll(): Promise<Role[]> {
        const rolesPrisma = await this.prisma.role.findMany()
        return rolesPrisma.map(PrismaRoleMapper.toEntity)
    }
}
