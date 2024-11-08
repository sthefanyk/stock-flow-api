import { UserDAO } from '@/domain/user-and-permission-management/application/DAO/user-dao'
import { User } from '@/domain/user-and-permission-management/enterprise/entities/user'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma.service'
import { PrismaUserMapper } from '../../mappers/user-and-permission-management/prisma-user-mapper'

@Injectable()
export class PrismaUserRepository implements UserDAO {
    constructor(private prisma: PrismaService) {}

    async create(entity: User): Promise<void> {
        await this.prisma.user.create({
            data: PrismaUserMapper.toPrisma(entity),
        })
    }

    async save(entity: User): Promise<void> {
        await this.prisma.user.update({
            where: { id: entity.id.toString() },
            data: PrismaUserMapper.toPrisma(entity),
        })
    }

    async delete(entity: User): Promise<void> {
        await this.prisma.user.delete({
            where: { id: entity.id.toString() },
        })
    }

    async findByEmail(email: string): Promise<User | null> {
        const prismaUser = await this.prisma.user.findUnique({
            where: { email },
            include: { role: true },
        })

        if (prismaUser) {
            return PrismaUserMapper.toEntity(prismaUser)
        }

        return null
    }

    async findById(id: string): Promise<User | null> {
        const prismaUser = await this.prisma.user.findUnique({
            where: { id },
            include: { role: true },
        })

        if (prismaUser) {
            return PrismaUserMapper.toEntity(prismaUser)
        }

        return null
    }

    async listAll(): Promise<User[]> {
        const usersPrisma = await this.prisma.user.findMany({
            include: {
                role: true,
            },
        })

        return usersPrisma.map(PrismaUserMapper.toEntity)
    }
}
