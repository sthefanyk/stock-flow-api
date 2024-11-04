import { Either, left, right } from '@/shared/errors/contracts/either'
import { Permission } from '../../../enterprise/entities/permission'
import { PermissionDAO } from '../../DAO/permission-dao'
import { ResourceNotFoundError } from '@/shared/errors/use-case-errors/resource-not-found-error'
import { AccessLevel } from '@/domain/user-and-permission-management/enterprise/enums/access-level'
import { SubdomainDAO } from '../../DAO/subdomain-dao'
import { UseCaseDAO } from '../../DAO/usecase-dao'
import { ValidationError } from '@/shared/errors/entity-errors/validation-error'

type DeletePermissionInput = {
    subdomain: string
    usecase: string
    accessLevel: string
}

type DeletePermissionOutput = Either<Error, { permission: Permission }>

export class DeletePermissionUseCase {
    constructor(
        private permissionRepository: PermissionDAO,
        private subdomainRepository: SubdomainDAO,
        private usecaseRepository: UseCaseDAO,
    ) {}

    async execute({
        subdomain,
        usecase,
        accessLevel,
    }: DeletePermissionInput): Promise<DeletePermissionOutput> {
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

            const permissionFound =
                await this.permissionRepository.find(permission)

            if (!permissionFound) {
                throw new ResourceNotFoundError()
            }

            await this.permissionRepository.delete(permissionFound)

            return right({ permission: permissionFound })
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
