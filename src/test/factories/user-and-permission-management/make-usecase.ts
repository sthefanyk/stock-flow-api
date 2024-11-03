import { faker } from '@faker-js/faker'
import {
    UseCase,
    UseCaseProps,
} from '@/domain/user-and-permission-management/enterprise/entities/usecase'

export function makeUseCase(override: Partial<UseCaseProps> = {}): UseCase {
    const usecase = UseCase.create({
        name: faker.word.noun(),
        description: faker.lorem.sentences(),
        ...override,
    })

    return usecase
}
