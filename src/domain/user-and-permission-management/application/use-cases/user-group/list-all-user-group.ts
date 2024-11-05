import { Either, left, right } from '@/shared/errors/contracts/either'
import { UserGroup } from '../../../enterprise/entities/user-group'
import { UserGroupDAO } from '../../DAO/user-group-dao'
import { ValidationError } from '@/shared/errors/entity-errors/validation-error'

// type ListAllUserGroupInput = null

type ListAllUserGroupOutput = Either<Error, { userGroups: UserGroup[] }>

export class ListAllUserGroupUseCase {
    constructor(private userGroupRepository: UserGroupDAO) {}

    async execute(): Promise<ListAllUserGroupOutput> {
        try {
            const userGroups = await this.userGroupRepository.listAll()

            return right({ userGroups })
        } catch (error) {
            if (error instanceof ValidationError) {
                return left(error)
            }
            throw error
        }
    }
}
