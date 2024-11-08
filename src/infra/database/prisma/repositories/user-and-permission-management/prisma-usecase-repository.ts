import { UseCaseDAO } from '@/domain/user-and-permission-management/application/DAO/usecase-dao'
import { UseCase } from '@/domain/user-and-permission-management/enterprise/entities/usecase'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma.service'
import { PrismaUseCaseMapper } from '../../mappers/user-and-permission-management/prisma-usecase-mapper'

@Injectable()
export class PrismaUseCaseRepository implements UseCaseDAO {
    constructor(private prisma: PrismaService) {}

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
    }

    async delete(entity: UseCase): Promise<void> {
        await this.prisma.useCase.delete({
            where: { name: entity.name },
        })
    }

    async findByName(name: string): Promise<UseCase | null> {
        const prismaUseCase = await this.prisma.useCase.findUnique({
            where: { name },
        })

        if (prismaUseCase) {
            return PrismaUseCaseMapper.toEntity(prismaUseCase)
        }

        return null
    }

    async listAll(): Promise<UseCase[]> {
        const useCasesPrisma = await this.prisma.useCase.findMany()
        return useCasesPrisma.map(PrismaUseCaseMapper.toEntity)
    }
}
