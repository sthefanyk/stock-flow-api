import { Either, left, right } from '@/shared/errors/contracts/either'
import { User } from '../../../enterprise/entities/user'
import { UserDAO } from '../../DAO/user-dao'
import { ResourcesAlreadyExistError } from '@/shared/errors/use-case-errors/resources-already-exist-error'
import { ValidationError } from '@/shared/errors/entity-errors/validation-error'
import { RoleDAO } from '../../DAO/role-dao'
import { ResourceNotFoundError } from '@/shared/errors/use-case-errors/resource-not-found-error'
import { UserStatus } from '@/domain/user-and-permission-management/enterprise/enums/user-status'
import { UseCase } from '@/shared/use-cases/use-case'
import { HashGenerator } from '../../cryptography/hash-generator'
import { Injectable } from '@nestjs/common'

type CreateUserInput = {
    userWhoExecutedID: string
    name: string
    email: string
    password: string
    role: string
    status: string
}

type CreateUserOutput = Either<Error, { user: User }>

@Injectable()
export class CreateUserUseCase extends UseCase {
    constructor(
        private userRepository: UserDAO,
        private roleRepository: RoleDAO,
        private hashGenerator: HashGenerator,
    ) {
        super('create-user')
    }

    async execute({
        userWhoExecutedID,
        name,
        email,
        password,
        role,
        status,
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

            const hashedPassword = await this.hashGenerator.hash(password)

            const user = User.create({
                name,
                email,
                password: hashedPassword,
                role: roleFound,
                status: UserStatus.getUserStatusByName(status)!,
            })

            await this.userRepository.create(user)

            this.log({
                details: `User ${user.id.toString()} criado.`,
                userWhoExecutedID,
            })

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
