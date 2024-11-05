import { Either, left, right } from '@/shared/errors/contracts/either'
import { UserGroup } from '../../../enterprise/entities/user-group'
import { UserGroupDAO } from '../../DAO/user-group-dao'
import { ValidationError } from '@/shared/errors/entity-errors/validation-error'

type FindByNameUserGroupInput = {
    name: string
}

type FindByNameUserGroupOutput = Either<Error, { userGroup: UserGroup | null }>

export class FindByNameUserGroupUseCase {
    constructor(private userGroupRepository: UserGroupDAO) {}

    async execute({
        name,
    }: FindByNameUserGroupInput): Promise<FindByNameUserGroupOutput> {
        try {
            const userGroupFound = await this.userGroupRepository.findByName(
                name.toUpperCase(),
            )
            return right({ userGroup: userGroupFound })
        } catch (error) {
            if (error instanceof ValidationError) {
                return left(error)
            }
            throw error
        }
    }
}
