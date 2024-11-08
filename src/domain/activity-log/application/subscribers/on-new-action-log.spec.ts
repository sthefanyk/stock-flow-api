import { InMemoryActionLogRepository } from '@/test/repositories/in-memory/activity-log/in-memory-action-log-repository'
import { OnNewActionLog } from './on-new-action-log'
import { InMemoryUseCaseRepository } from '@/test/repositories/in-memory/user-and-permission-management/in-memory-usecase-repository'
import { InMemoryUserRepository } from '@/test/repositories/in-memory/user-and-permission-management/in-memory-user-repository'
import { makeUser } from '@/test/factories/user-and-permission-management/make-user'
import { DomainEvents } from '@/shared/events/domain-events'
import { ActionLog } from '../../enterprise/entities/action-log'
import { makeUseCase } from '@/test/factories/user-and-permission-management/make-usecase'
import { waitFor } from '@/test/utils/wait-for'
import { ActionLogDAO } from '../DAO/action-log-dao'
import { UserDAO } from '@/domain/user-and-permission-management/application/DAO/user-dao'
import { UseCaseDAO } from '@/domain/user-and-permission-management/application/DAO/usecase-dao'
import { MockInstance, TestContext } from 'vitest'

interface TestContextWithSut extends TestContext {
    actionRepository: ActionLogDAO
    userRepository: UserDAO
    useCaseRepository: UseCaseDAO
    actionCreatedSpy: MockInstance
}

describe('OnNewActionLog', () => {
    beforeEach(async (context: TestContextWithSut) => {
        context.actionRepository = new InMemoryActionLogRepository()
        context.userRepository = new InMemoryUserRepository()
        context.useCaseRepository = new InMemoryUseCaseRepository()

        await context.userRepository.create(makeUser({}, 'test'))
        await context.useCaseRepository.create(makeUseCase({ name: 'test' }))

        new OnNewActionLog(
            context.actionRepository,
            context.userRepository,
            context.useCaseRepository,
        )

        context.actionCreatedSpy = vi.spyOn(context.actionRepository, 'create')
    })

    it('should be able to ...', async ({
        actionCreatedSpy,
        actionRepository,
    }: TestContextWithSut) => {
        const aggregate = ActionLog.create({
            userWhoExecutedID: 'test',
            usecase: 'test',
            details: 'test',
        })
        expect(aggregate.domainEvents).toHaveLength(1)
        DomainEvents.dispatchEventsForAggregate(aggregate.id)

        await waitFor(async () => {
            expect(actionCreatedSpy).toHaveBeenCalled()

            const items = await actionRepository.listAll()
            expect(items).toHaveLength(1)
            expect(items[0].id).toBe(aggregate.id)
        })

    })
})
