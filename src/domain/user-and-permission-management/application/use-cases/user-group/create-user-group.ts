import { Either, left, right } from '@/shared/errors/contracts/either'
import { UserGroup } from '../../../enterprise/entities/user-group'
import { UserGroupDAO } from '../../DAO/user-group-dao'
import { ResourcesAlreadyExistError } from '@/shared/errors/use-case-errors/resources-already-exist-error'
import { ValidationError } from '@/shared/errors/entity-errors/validation-error'

type CreateUserGroupInput = {
    name: string
}

type CreateUserGroupOutput = Either<Error, { userGroup: UserGroup }>

export class CreateUserGroupUseCase {
    constructor(private userGroupRepository: UserGroupDAO) {}

    async execute({
        name,
    }: CreateUserGroupInput): Promise<CreateUserGroupOutput> {
        try {
            const userGroupExists = await this.userGroupRepository.findByName(
                name.toUpperCase(),
            )

            if (userGroupExists) {
                throw new ResourcesAlreadyExistError()
            }

            const userGroup = UserGroup.create({
                name,
            })

            await this.userGroupRepository.create(userGroup)

            return right({ userGroup })
        } catch (error) {
            if (
                error instanceof ResourcesAlreadyExistError ||
                error instanceof ValidationError
            ) {
                return left(error)
            }
            throw error
        }
    }
}
