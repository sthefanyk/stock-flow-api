import { Either, left, right } from '@/shared/errors/contracts/either'
import { UseCase } from '../../../enterprise/entities/usecase'
import { UseCaseDAO } from '../../DAO/usecase-dao'
import { ValidationError } from '@/shared/errors/entity-errors/validation-error'

type FindByNameUseCaseInput = {
    name: string
}

type FindByNameUseCaseOutput = Either<Error, { usecase: UseCase | null }>

export class FindByNameUseCaseUseCase {
    constructor(private usecaseRepository: UseCaseDAO) {}

    async execute({
        name,
    }: FindByNameUseCaseInput): Promise<FindByNameUseCaseOutput> {
        try {
            const usecaseFound = await this.usecaseRepository.findByName(
                name.toLowerCase(),
            )
            return right({ usecase: usecaseFound })
        } catch (error) {
            if (error instanceof ValidationError) {
                return left(error)
            }
            throw error
        }
    }
}
