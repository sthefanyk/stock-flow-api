import { Either, left, right } from '@/shared/errors/contracts/either'
import { Permission } from '../../../enterprise/entities/permission'
import { PermissionDAO } from '../../DAO/permission-dao'
import { ResourcesAlreadyExistError } from '@/shared/errors/use-case-errors/resources-already-exist-error'
import { ValidationError } from '@/shared/errors/entity-errors/validation-error'
import { SubdomainDAO } from '../../DAO/subdomain-dao'
import { UseCaseDAO } from '../../DAO/usecase-dao'
import { AccessLevel } from '@/domain/user-and-permission-management/enterprise/enums/access-level'
import { ResourceNotFoundError } from '@/shared/errors/use-case-errors/resource-not-found-error'

export type CreatePermissionInput = {
    subdomain: string
    usecase: string
    accessLevel: string
}

type CreatePermissionOutput = Either<Error, { permission: Permission }>

export class CreatePermissionUseCase {
    constructor(
        private permissionRepository: PermissionDAO,
        private subdomainRepository: SubdomainDAO,
        private usecaseRepository: UseCaseDAO,
    ) {}

    async execute({
        subdomain,
        usecase,
        accessLevel,
    }: CreatePermissionInput): Promise<CreatePermissionOutput> {
        try {
            const subdomainFound = await this.subdomainRepository.findByName(
                subdomain.toLowerCase(),
            )

            if (!subdomainFound) {
                throw new ResourceNotFoundError('Subdomain not found')
            }

            const usecaseFound = await this.usecaseRepository.findByName(
                usecase.toLowerCase(),
            )

            if (!usecaseFound) {
                throw new ResourceNotFoundError('Use case not found')
            }

            const permission = Permission.create({
                subdomain: subdomainFound,
                usecase: usecaseFound,
                accessLevel: AccessLevel.getAccessLevelByName(accessLevel)!,
            })

            const permissionExists =
                await this.permissionRepository.find(permission)

            if (permissionExists) {
                throw new ResourcesAlreadyExistError()
            }

            await this.permissionRepository.create(permission)

            return right({ permission })
        } catch (error) {
            if (
                error instanceof ResourceNotFoundError ||
                error instanceof ResourcesAlreadyExistError ||
                error instanceof ValidationError
            ) {
                return left(error)
            }
            throw error
        }
    }
}
