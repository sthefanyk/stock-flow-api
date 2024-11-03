import { Either, left, right } from '@/shared/errors/contracts/either'
import { UseCase } from '../../../enterprise/entities/usecase'
import { UseCaseDAO } from '../../DAO/usecase-dao'
import { ResourceNotFoundError } from '@/shared/errors/use-case-errors/resource-not-found-error'

type DeleteUseCaseInput = {
    name: string
}

type DeleteUseCaseOutput = Either<Error, { usecase: UseCase }>

export class DeleteUseCaseUseCase {
    constructor(private usecaseRepository: UseCaseDAO) {}

    async execute({ name }: DeleteUseCaseInput): Promise<DeleteUseCaseOutput> {
        try {
            const usecaseFound = await this.usecaseRepository.findByName(
                name.toLowerCase(),
            )

            if (!usecaseFound) {
                throw new ResourceNotFoundError()
            }

            await this.usecaseRepository.delete(usecaseFound)

            return right({ usecase: usecaseFound })
        } catch (error) {
            if (error instanceof ResourceNotFoundError) {
                return left(error)
            }
            throw error
        }
    }
}
