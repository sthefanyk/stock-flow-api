import { Either, left, right } from '@/shared/errors/contracts/either'
import { User } from '../../../enterprise/entities/user'
import { UserDAO } from '../../DAO/user-dao'
import { ValidationError } from '@/shared/errors/entity-errors/validation-error'
import { ResourceNotFoundError } from '@/shared/errors/use-case-errors/resource-not-found-error'

type ChangeUserStatusInput = {
    userID: string
    newStatus: string
}

type ChangeUserStatusOutput = Either<Error, { user: User }>

export class ChangeUserStatusUseCase {
    constructor(private userRepository: UserDAO) {}

    async execute({
        userID,
        newStatus,
    }: ChangeUserStatusInput): Promise<ChangeUserStatusOutput> {
        try {
            const userFound = await this.userRepository.findById(userID)

            if (!userFound) {
                throw new ResourceNotFoundError('User not found')
            }

            userFound.changeStatus(newStatus)

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
