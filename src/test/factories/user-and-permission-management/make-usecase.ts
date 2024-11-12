import { faker } from '@faker-js/faker'
import {
    UseCase,
    UseCaseProps,
} from '@/domain/user-and-permission-management/enterprise/entities/usecase'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'
import { PrismaUseCaseMapper } from '@/infra/database/prisma/mappers/user-and-permission-management/prisma-usecase-mapper'

export function makeUseCase(override: Partial<UseCaseProps> = {}): UseCase {
    const usecase = UseCase.create({
        name: faker.word.noun(),
        description: faker.lorem.sentences(),
        ...override,
    })

    return usecase
}

@Injectable()
export class UseCaseFactory {
    constructor(private prisma: PrismaService) {}

    async makePrismaUseCase(
        data: Partial<UseCaseProps> = {},
    ): Promise<UseCase> {
        const usecase = makeUseCase(data)

        await this.prisma.useCase.create({
            data: PrismaUseCaseMapper.toPrisma(usecase),
        })

        return usecase
    }
}
