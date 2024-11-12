import { UseCaseDAO } from '@/domain/user-and-permission-management/application/DAO/usecase-dao'
import { UseCase } from '@/domain/user-and-permission-management/enterprise/entities/usecase'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma.service'
import { PrismaUseCaseMapper } from '../../mappers/user-and-permission-management/prisma-usecase-mapper'
import { CacheDAO } from '@/infra/cache/cache-dao'

@Injectable()
export class PrismaUseCaseRepository implements UseCaseDAO {
    constructor(
        private prisma: PrismaService,
        private cache: CacheDAO,
    ) {}

    async create(entity: UseCase): Promise<void> {
        await this.prisma.useCase.create({
            data: PrismaUseCaseMapper.toPrisma(entity),
        })
    }

    async save(entity: UseCase): Promise<void> {
        await this.prisma.useCase.update({
            where: { name: entity.name },
            data: PrismaUseCaseMapper.toPrisma(entity),
        })

        this.cache.delete(`usecase:${entity.name}`)
    }

    async delete(entity: UseCase): Promise<void> {
        await this.prisma.useCase.delete({
            where: { name: entity.name },
        })
    }

    async findByName(name: string): Promise<UseCase | null> {
        const cacheHit = await this.cache.get(`usecase:${name}`)

        if (cacheHit) {
            const cacheData = JSON.parse(cacheHit)

            return PrismaUseCaseMapper.toEntity(cacheData)
        }

        const prismaUseCase = await this.prisma.useCase.findUnique({
            where: { name },
        })

        if (prismaUseCase) {
            await this.cache.set(
                `usecase:${name}`,
                JSON.stringify(prismaUseCase),
            )

            const usecase = PrismaUseCaseMapper.toEntity(prismaUseCase)

            return usecase
        }

        return null
    }

    async listAll(): Promise<UseCase[]> {
        const useCasesPrisma = await this.prisma.useCase.findMany()
        const usecases = useCasesPrisma.map(PrismaUseCaseMapper.toEntity)

        return usecases
    }
}
