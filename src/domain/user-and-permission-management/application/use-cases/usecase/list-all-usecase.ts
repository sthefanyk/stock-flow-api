import { Either, left, right } from '@/shared/errors/contracts/either'
import { UseCase } from '../../../enterprise/entities/usecase'
import { UseCaseDAO } from '../../DAO/usecase-dao'
import { ValidationError } from '@/shared/errors/entity-errors/validation-error'

// type ListAllUseCaseInput = null

type ListAllUseCaseOutput = Either<Error, { usecases: UseCase[] }>

export class ListAllUseCaseUseCase {
    constructor(private usecaseRepository: UseCaseDAO) {}

    async execute(): Promise<ListAllUseCaseOutput> {
        try {
            const usecases = await this.usecaseRepository.listAll()

            return right({ usecases })
        } catch (error) {
            if (error instanceof ValidationError) {
                return left(error)
            }
            throw error
        }
    }
}
