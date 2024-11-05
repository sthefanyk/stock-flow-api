import { Either, left, right } from '@/shared/errors/contracts/either'
import { User } from '../../../enterprise/entities/user'
import { UserDAO } from '../../DAO/user-dao'
import { ResourcesAlreadyExistError } from '@/shared/errors/use-case-errors/resources-already-exist-error'
import { ValidationError } from '@/shared/errors/entity-errors/validation-error'
import { RoleDAO } from '../../DAO/role-dao'
import { ResourceNotFoundError } from '@/shared/errors/use-case-errors/resource-not-found-error'

type CreateUserInput = {
    name: string
    email: string
    password: string
    role: string
}

type CreateUserOutput = Either<Error, { user: User }>

export class CreateUserUseCase {
    constructor(
        private userRepository: UserDAO,
        private roleRepository: RoleDAO,
    ) {}

    async execute({
        name,
        email,
        password,
        role,
    }: CreateUserInput): Promise<CreateUserOutput> {
        try {
            const userExists = await this.userRepository.findByEmail(
                email.toLowerCase(),
            )

            if (userExists) {
                throw new ResourcesAlreadyExistError(
                    'This email already exists',
                )
            }

            const roleFound = await this.roleRepository.findByName(
                role.toUpperCase(),
            )

            if (!roleFound) {
                throw new ResourceNotFoundError('Role not found')
            }

            const user = User.create({
                name,
                email,
                password,
                role: roleFound,
            })

            await this.userRepository.create(user)

            return right({ user })
        } catch (error) {
            if (
                error instanceof ResourceNotFoundError ||
                error instanceof ResourcesAlreadyExistError ||
                error instanceof ValidationError
            ) {
                return left(error)
            }
            throw error
        }
    }
}
