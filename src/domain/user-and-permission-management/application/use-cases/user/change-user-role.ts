import { Either, left, right } from '@/shared/errors/contracts/either'
import { User } from '../../../enterprise/entities/user'
import { UserDAO } from '../../DAO/user-dao'
import { ValidationError } from '@/shared/errors/entity-errors/validation-error'
import { ResourceNotFoundError } from '@/shared/errors/use-case-errors/resource-not-found-error'
import { RoleDAO } from '../../DAO/role-dao'

type ChangeUserRoleInput = {
    userID: string
    newRole: string
}

type ChangeUserRoleOutput = Either<Error, { user: User }>

export class ChangeUserRoleUseCase {
    constructor(
        private userRepository: UserDAO,
        private roleRepository: RoleDAO,
    ) {}

    async execute({
        userID,
        newRole,
    }: ChangeUserRoleInput): Promise<ChangeUserRoleOutput> {
        try {
            const userFound = await this.userRepository.findById(userID)

            if (!userFound) {
                throw new ResourceNotFoundError('User not found')
            }

            const roleFound = await this.roleRepository.findByName(
                newRole.toUpperCase(),
            )

            if (!roleFound) {
                throw new ResourceNotFoundError('Role not found')
            }

            userFound.changeRole(roleFound)

            await this.userRepository.save(userFound)

            return right({ user: userFound })
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
