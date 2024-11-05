import { Either, left, right } from '@/shared/errors/contracts/either'
import { UserGroup } from '../../../enterprise/entities/user-group'
import { UserGroupDAO } from '../../DAO/user-group-dao'
import { ResourceNotFoundError } from '@/shared/errors/use-case-errors/resource-not-found-error'

type DeleteUserGroupInput = {
    name: string
}

type DeleteUserGroupOutput = Either<Error, { userGroup: UserGroup }>

export class DeleteUserGroupUseCase {
    constructor(private userGroupRepository: UserGroupDAO) {}

    async execute({
        name,
    }: DeleteUserGroupInput): Promise<DeleteUserGroupOutput> {
        try {
            const userGroupFound = await this.userGroupRepository.findByName(
                name.toUpperCase(),
            )

            if (!userGroupFound) {
                throw new ResourceNotFoundError(
                    'User group with this name not found',
                )
            }

            await this.userGroupRepository.delete(userGroupFound)

            return right({ userGroup: userGroupFound })
        } catch (error) {
            if (error instanceof ResourceNotFoundError) {
                return left(error)
            }
            throw error
        }
    }
}
