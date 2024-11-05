import { Either, left, right } from '@/shared/errors/contracts/either'
import { UserGroup } from '../../../enterprise/entities/user-group'
import { UserGroupDAO } from '../../DAO/user-group-dao'
import { ValidationError } from '@/shared/errors/entity-errors/validation-error'
import { UserDAO } from '../../DAO/user-dao'
import { ResourceNotFoundError } from '@/shared/errors/use-case-errors/resource-not-found-error'
import { ResourcesAlreadyExistError } from '@/shared/errors/entity-errors/resources-already-exist-error'

type AddUserToUserGroupInput = {
    nameGroup: string
    userID: string
}

type AddUserToUserGroupOutput = Either<Error, { userGroup: UserGroup | null }>

export class AddUserToUserGroupUseCase {
    constructor(
        private userGroupRepository: UserGroupDAO,
        private userRepository: UserDAO,
    ) {}

    async execute({
        nameGroup,
        userID,
    }: AddUserToUserGroupInput): Promise<AddUserToUserGroupOutput> {
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

            userGroupFound.addUser(userFound)

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
