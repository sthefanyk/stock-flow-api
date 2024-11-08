import { UseCase } from '@/domain/user-and-permission-management/enterprise/entities/usecase'
import { UseCase as PrismaUseCase, Prisma } from '@prisma/client'

export class PrismaUseCaseMapper {
    static toEntity(raw: PrismaUseCase): UseCase {
        return UseCase.create({
            name: raw.name,
            description: raw.description,
        })
    }

    static toPrisma(entity: UseCase): Prisma.UseCaseUncheckedCreateInput {
        return {
            name: entity.name,
            description: entity.description ?? null,
        }
    }
}
