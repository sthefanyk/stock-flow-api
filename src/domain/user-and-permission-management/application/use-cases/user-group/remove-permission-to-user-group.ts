import { Either, left, right } from '@/shared/errors/contracts/either'
import { UserGroup } from '../../../enterprise/entities/user-group'
import { UserGroupDAO } from '../../DAO/user-group-dao'
import { ValidationError } from '@/shared/errors/entity-errors/validation-error'
import { PermissionDAO } from '../../DAO/permission-dao'
import { ResourceNotFoundError } from '@/shared/errors/use-case-errors/resource-not-found-error'
import { ResourceNotFoundError as ResourceNotFoundEntityError } from '@/shared/errors/entity-errors/resource-not-found-error'
import { ResourcesAlreadyExistError } from '@/shared/errors/entity-errors/resources-already-exist-error'

type RemovePermissionToUserGroupInput = {
    nameGroup: string
    permissionID: string
}

type RemovePermissionToUserGroupOutput = Either<
    Error,
    { userGroup: UserGroup | null }
>

export class RemovePermissionToUserGroupUseCase {
    constructor(
        private userGroupRepository: UserGroupDAO,
        private permissionRepository: PermissionDAO,
    ) {}

    async execute({
        nameGroup,
        permissionID,
    }: RemovePermissionToUserGroupInput): Promise<RemovePermissionToUserGroupOutput> {
        try {
            const userGroupFound = await this.userGroupRepository.findByName(
                nameGroup.toUpperCase(),
            )

            if (!userGroupFound) {
                throw new ResourceNotFoundError('User group not found')
            }

            const permissionFound =
                await this.permissionRepository.findById(permissionID)

            if (!permissionFound) {
                throw new ResourceNotFoundError('Permission not found')
            }

            userGroupFound.removePermission(permissionFound)

            await this.userGroupRepository.save(userGroupFound)

            return right({ userGroup: userGroupFound })
        } catch (error) {
            if (
                error instanceof ValidationError ||
                error instanceof ResourceNotFoundEntityError ||
                error instanceof ResourcesAlreadyExistError ||
                error instanceof ResourceNotFoundError
            ) {
                return left(error)
            }
            throw error
        }
    }
}
