import { Either, left, right } from '@/shared/errors/contracts/either'
import { UserGroup } from '../../../enterprise/entities/user-group'
import { UserGroupDAO } from '../../DAO/user-group-dao'
import { ValidationError } from '@/shared/errors/entity-errors/validation-error'
import { PermissionDAO } from '../../DAO/permission-dao'
import { ResourceNotFoundError } from '@/shared/errors/use-case-errors/resource-not-found-error'
import { ResourcesAlreadyExistError } from '@/shared/errors/entity-errors/resources-already-exist-error'

type AddPermissionToUserGroupInput = {
    nameGroup: string
    usecaseName: string
    subdomainName: string
}

type AddPermissionToUserGroupOutput = Either<
    Error,
    { userGroup: UserGroup | null }
>

export class AddPermissionToUserGroupUseCase {
    constructor(
        private userGroupRepository: UserGroupDAO,
        private permissionRepository: PermissionDAO,
    ) {}

    async execute({
        nameGroup,
        usecaseName,
        subdomainName,
    }: AddPermissionToUserGroupInput): Promise<AddPermissionToUserGroupOutput> {
        try {
            const userGroupFound = await this.userGroupRepository.findByName(
                nameGroup.toUpperCase(),
            )

            if (!userGroupFound) {
                throw new ResourceNotFoundError('User group not found')
            }

            const permissionFound =
                await this.permissionRepository.findByUsecaseAndSubdomain(
                    usecaseName,
                    subdomainName,
                )

            if (!permissionFound) {
                throw new ResourceNotFoundError('Permission not found')
            }

            userGroupFound.addPermission(permissionFound)

            await this.userGroupRepository.save(userGroupFound)

            return right({ userGroup: userGroupFound })
        } catch (error) {
            if (
                error instanceof ValidationError ||
                error instanceof ResourcesAlreadyExistError ||
                error instanceof ResourceNotFoundError
            ) {
                return left(error)
            }
            throw error
        }
    }
}
