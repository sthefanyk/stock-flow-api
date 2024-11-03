import { Either, left, right } from '@/shared/errors/contracts/either'
import { UseCase } from '../../../enterprise/entities/usecase'
import { UseCaseDAO } from '../../DAO/usecase-dao'
import { ResourcesAlreadyExistError } from '@/shared/errors/use-case-errors/resources-already-exist-error'
import { ValidationError } from '@/shared/errors/entity-errors/validation-error'

type CreateUseCaseInput = {
    name: string
    description?: string
}

type CreateUseCaseOutput = Either<Error, { usecase: UseCase }>

export class CreateUseCaseUseCase {
    constructor(private usecaseRepository: UseCaseDAO) {}

    async execute({
        name,
        description,
    }: CreateUseCaseInput): Promise<CreateUseCaseOutput> {
        try {
            const usecaseExists = await this.usecaseRepository.findByName(
                name.toLowerCase(),
            )

            if (usecaseExists) {
                throw new ResourcesAlreadyExistError()
            }

            const usecase = UseCase.create({
                name,
                description,
            })

            await this.usecaseRepository.create(usecase)

            return right({ usecase })
        } catch (error) {
            if (
                error instanceof ResourcesAlreadyExistError ||
                error instanceof ValidationError
            ) {
                return left(error)
            }
            throw error
        }
    }
}
