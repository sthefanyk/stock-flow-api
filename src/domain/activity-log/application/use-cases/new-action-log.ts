import { UserDAO } from '@/domain/user-and-permission-management/application/DAO/user-dao'
import { ActionLogDAO } from '../DAO/action-log-dao'
import { UseCaseDAO } from '@/domain/user-and-permission-management/application/DAO/usecase-dao'
import { Either, left, right } from '@/shared/errors/contracts/either'
import { ResourceNotFoundError } from '@/shared/errors/use-case-errors/resource-not-found-error'
import { ActionLog } from '../../enterprise/entities/action-log'
import { Injectable } from '@nestjs/common'

type NewActionLogInput = {
    actionLog: ActionLog
}

type NewActionLogOutput = Either<Error, null>

@Injectable()
export class NewActionLogUseCase {
    constructor(
        private actionLogRepository: ActionLogDAO,
        private userRepository: UserDAO,
        private useCaseRepository: UseCaseDAO,
    ) {}

    async execute({
        actionLog,
    }: NewActionLogInput): Promise<NewActionLogOutput> {
        try {
            const userFound = await this.userRepository.findById(
                actionLog.userWhoExecutedID,
            )

            if (!userFound) {
                throw new ResourceNotFoundError('User not found')
            }

            const useCaseFound = await this.useCaseRepository.findByName(
                actionLog.usecase.toLowerCase(),
            )

            if (!useCaseFound) {
                throw new ResourceNotFoundError('Use case not found')
            }

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
