import { Either, left, right } from '@/shared/errors/contracts/either'
import { Permission } from '../../../enterprise/entities/permission'
import { PermissionDAO } from '../../DAO/permission-dao'
import { ValidationError } from '@/shared/errors/entity-errors/validation-error'
import { ResourceNotFoundError } from '@/shared/errors/use-case-errors/resource-not-found-error'
import { UseCaseDAO } from '../../DAO/usecase-dao'

type FindPermissionByNameUsecaseInput = {
    name: string
}

type FindPermissionByNameUsecaseOutput = Either<
    Error,
    { permissions: Permission[] }
>

export class FindPermissionByNameUsecaseUseCase {
    constructor(
        private permissionRepository: PermissionDAO,
        private usecaseRepository: UseCaseDAO,
    ) {}

    async execute({
        name,
    }: FindPermissionByNameUsecaseInput): Promise<FindPermissionByNameUsecaseOutput> {
        try {
            const usecaseFound = await this.usecaseRepository.findByName(
                name.toLowerCase(),
            )

            if (!usecaseFound) {
                throw new ResourceNotFoundError('Use case not found')
            }

            const permissionsFound =
                await this.permissionRepository.findByUsecase(usecaseFound)

            return right({ permissions: permissionsFound })
        } catch (error) {
            if (
                error instanceof ResourceNotFoundError ||
                error instanceof ValidationError
            ) {
                return left(error)
            }
            throw error
        }
    }
}
