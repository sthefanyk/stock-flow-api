import { TestContext } from 'vitest'
import { ActionLogDAO } from '../DAO/action-log-dao'
import { UserDAO } from '@/domain/user-and-permission-management/application/DAO/user-dao'
import { UseCaseDAO } from '@/domain/user-and-permission-management/application/DAO/usecase-dao'
import { NewActionLogUseCase } from './new-action-log'
import { ActionLog } from '../../enterprise/entities/action-log'
import { InMemoryActionLogRepository } from '@/test/repositories/in-memory/activity-log/in-memory-action-log-repository'
import { InMemoryUserRepository } from '@/test/repositories/in-memory/user-and-permission-management/in-memory-user-repository'
import { InMemoryUseCaseRepository } from '@/test/repositories/in-memory/user-and-permission-management/in-memory-usecase-repository'
import { makeActionLog } from '@/test/factories/activity-log/make-action-log'
import { ResourceNotFoundError } from '@/shared/errors/use-case-errors/resource-not-found-error'
import { makeUseCase } from '@/test/factories/user-and-permission-management/make-usecase'
import { makeUser } from '@/test/factories/user-and-permission-management/make-user'

interface TestContextWithSut extends TestContext {
    actionLogRepository: ActionLogDAO
    userRepository: UserDAO
    useCaseRepository: UseCaseDAO

    entity: ActionLog

    sut: NewActionLogUseCase
}

describe('NewActionLog', () => {
    beforeEach(async (context: TestContextWithSut) => {
        context.actionLogRepository = new InMemoryActionLogRepository()
        context.userRepository = new InMemoryUserRepository()
        context.useCaseRepository = new InMemoryUseCaseRepository()

        context.sut = new NewActionLogUseCase(
            context.actionLogRepository,
            context.userRepository,
            context.useCaseRepository,
        )

        context.entity = makeActionLog()

        context.useCaseRepository.create(
            makeUseCase({
                name: context.entity.usecase.toLowerCase(),
            }),
        )
        context.userRepository.create(
            makeUser({}, context.entity.userWhoExecutedID),
        )
    })

    it('should be able to create new action log', async ({
        sut,
        entity,
        actionLogRepository,
    }: TestContextWithSut) => {
        const result = await sut.execute({
            actionLog: entity,
        })

        expect(result.isRight()).toBeTruthy()

        const items = await actionLogRepository.listAll()
        expect(items).toHaveLength(1)

        expect(items[0].userWhoExecutedID).toBe(entity.userWhoExecutedID)
        expect(items[0].usecase).toBe(entity.usecase)
        expect(items[0].details).toBe(entity.details)
        expect(items[0].date).toBeTruthy()
    })

    it('should return a ResourceNotFoundError if the user is not found', async ({
        sut,
        entity,
        actionLogRepository,
    }: TestContextWithSut) => {
        const result = await sut.execute({
            actionLog: ActionLog.create({
                userWhoExecutedID: 'unregistered',
                details: entity.details,
                usecase: entity.usecase,
            }),
        })

        expect(result.isLeft()).toBeTruthy()

        const { message } = result.value as ResourceNotFoundError
        expect(message).toBe('User not found')

        const items = await actionLogRepository.listAll()
        expect(items).toHaveLength(0)
    })

    it('should return a ResourceNotFoundError if the action is not found', async ({
        sut,
        entity,
        actionLogRepository,
    }: TestContextWithSut) => {
        const result = await sut.execute({
            actionLog: ActionLog.create({
                userWhoExecutedID: entity.userWhoExecutedID,
                details: entity.details,
                usecase: 'unregistered',
            }),
        })

        expect(result.isLeft()).toBeTruthy()

        const { message } = result.value as ResourceNotFoundError
        expect(message).toBe('Use case not found')

        const items = await actionLogRepository.listAll()
        expect(items).toHaveLength(0)
    })
})
