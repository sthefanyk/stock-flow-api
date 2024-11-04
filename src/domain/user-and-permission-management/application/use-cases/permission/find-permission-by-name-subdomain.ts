import { Either, left, right } from '@/shared/errors/contracts/either'
import { Permission } from '../../../enterprise/entities/permission'
import { PermissionDAO } from '../../DAO/permission-dao'
import { ValidationError } from '@/shared/errors/entity-errors/validation-error'
import { ResourceNotFoundError } from '@/shared/errors/use-case-errors/resource-not-found-error'
import { SubdomainDAO } from '../../DAO/subdomain-dao'

type FindPermissionByNameSubdomainInput = {
    name: string
}

type FindPermissionByNameSubdomainOutput = Either<
    Error,
    { permissions: Permission[] }
>

export class FindPermissionByNameSubdomainUseCase {
    constructor(
        private permissionRepository: PermissionDAO,
        private subdomainRepository: SubdomainDAO,
    ) {}

    async execute({
        name,
    }: FindPermissionByNameSubdomainInput): Promise<FindPermissionByNameSubdomainOutput> {
        try {
            const subdomainFound = await this.subdomainRepository.findByName(
                name.toLowerCase(),
            )

            if (!subdomainFound) {
                throw new ResourceNotFoundError('Subdomain not found')
            }

            const permissionFound =
                await this.permissionRepository.findBySubdomain(subdomainFound)

            return right({ permissions: permissionFound })
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
