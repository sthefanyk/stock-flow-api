import { SubdomainDAO } from '@/domain/user-and-permission-management/application/DAO/subdomain-dao'
import { Subdomain } from '@/domain/user-and-permission-management/enterprise/entities/subdomain'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma.service'
import { PrismaSubdomainMapper } from '../../mappers/user-and-permission-management/prisma-subdomain-mapper'

@Injectable()
export class PrismaSubdomainRepository implements SubdomainDAO {
    constructor(private prisma: PrismaService) {}

    async create(entity: Subdomain): Promise<void> {
        await this.prisma.subdomain.create({
            data: PrismaSubdomainMapper.toPrisma(entity),
        })
    }

    async save(entity: Subdomain): Promise<void> {
        await this.prisma.subdomain.update({
            where: { name: entity.name },
            data: PrismaSubdomainMapper.toPrisma(entity),
        })
    }

    async delete(entity: Subdomain): Promise<void> {
        await this.prisma.subdomain.delete({
            where: { name: entity.name },
        })
    }

    async findByName(name: string): Promise<Subdomain | null> {
        const prismaSubdomain = await this.prisma.subdomain.findUnique({
            where: { name },
        })

        if (prismaSubdomain) {
            return PrismaSubdomainMapper.toEntity(prismaSubdomain)
        }

        return null
    }

    async listAll(): Promise<Subdomain[]> {
        const subdomainsPrisma = await this.prisma.subdomain.findMany()
        return subdomainsPrisma.map(PrismaSubdomainMapper.toEntity)
    }
}
