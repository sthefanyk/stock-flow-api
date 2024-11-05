import { UserDAO } from '@/domain/user-and-permission-management/application/DAO/user-dao'
import { ActionLogDAO } from '../DAO/action-log-dao'
import { UseCaseDAO } from '@/domain/user-and-permission-management/application/DAO/usecase-dao'
import { Either, left, right } from '@/shared/errors/contracts/either'
import { ResourceNotFoundError } from '@/shared/errors/use-case-errors/resource-not-found-error'
import { ActionLog } from '../../enterprise/entities/action-log'

type NewActionLogInput = {
    userID: string
    action: string
    details: string
}

type NewActionLogOutput = Either<Error, null>

export class NewActionLogUseCase {
    constructor(
        private actionLogRepository: ActionLogDAO,
        private userRepository: UserDAO,
        private useCaseRepository: UseCaseDAO,
    ) {}

    async execute({
        userID,
        action,
        details,
    }: NewActionLogInput): Promise<NewActionLogOutput> {
        try {
            const userFound = await this.userRepository.findById(userID)

            if (!userFound) {
                throw new ResourceNotFoundError('User not found')
            }

            const useCaseFound = await this.useCaseRepository.findByName(
                action.toLowerCase(),
            )

            if (!useCaseFound) {
                throw new ResourceNotFoundError('Action not found')
            }

            const actionLog = ActionLog.create({
                user: userFound,
                action: useCaseFound,
                details,
            })

            await this.actionLogRepository.create(actionLog)

            return right(null)
        } catch (error) {
            if (error instanceof ResourceNotFoundError) {
                return left(error)
            }
            throw error
        }
    }
}
