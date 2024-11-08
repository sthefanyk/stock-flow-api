import { Subdomain } from '@/domain/user-and-permission-management/enterprise/entities/subdomain'
import { Subdomain as PrismaSubdomain, Prisma } from '@prisma/client'

export class PrismaSubdomainMapper {
    static toEntity(raw: PrismaSubdomain): Subdomain {
        return Subdomain.create({
            name: raw.name,
            description: raw.description,
        })
    }

    static toPrisma(entity: Subdomain): Prisma.SubdomainUncheckedCreateInput {
        return {
            name: entity.name,
            description: entity.description ?? null,
        }
    }
}
