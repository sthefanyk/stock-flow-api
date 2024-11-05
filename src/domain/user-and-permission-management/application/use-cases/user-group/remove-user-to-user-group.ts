import { Either, left, right } from '@/shared/errors/contracts/either'
import { UserGroup } from '../../../enterprise/entities/user-group'
import { UserGroupDAO } from '../../DAO/user-group-dao'
import { ValidationError } from '@/shared/errors/entity-errors/validation-error'
import { UserDAO } from '../../DAO/user-dao'
import { ResourceNotFoundError } from '@/shared/errors/use-case-errors/resource-not-found-error'
import { ResourceNotFoundError as ResourceNotFoundEntityError } from '@/shared/errors/entity-errors/resource-not-found-error'
import { ResourcesAlreadyExistError } from '@/shared/errors/entity-errors/resources-already-exist-error'

type RemoveUserToUserGroupInput = {
    nameGroup: string
    userID: string
}

type RemoveUserToUserGroupOutput = Either<
    Error,
    { userGroup: UserGroup | null }
>

export class RemoveUserToUserGroupUseCase {
    constructor(
        private userGroupRepository: UserGroupDAO,
        private userRepository: UserDAO,
    ) {}

    async execute({
        nameGroup,
        userID,
    }: RemoveUserToUserGroupInput): Promise<RemoveUserToUserGroupOutput> {
        try {
            const userGroupFound = await this.userGroupRepository.findByName(
                nameGroup.toUpperCase(),
            )

            if (!userGroupFound) {
                throw new ResourceNotFoundError('User group not found')
            }

            const userFound = await this.userRepository.findById(userID)

            if (!userFound) {
                throw new ResourceNotFoundError('User not found')
            }

            userGroupFound.removeUser(userFound)

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
