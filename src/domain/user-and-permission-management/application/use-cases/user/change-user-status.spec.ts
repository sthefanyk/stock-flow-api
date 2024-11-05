import { InMemoryUserRepository } from '@/infra/repositories/in-memory/user-and-permission-management/in-memory-user-repository'
import { ChangeUserStatusUseCase } from './change-user-status'
import { ValidationError } from '@/shared/errors/entity-errors/validation-error'
import { User } from '@/domain/user-and-permission-management/enterprise/entities/user'
import { makeUser } from '@/test/factories/user-and-permission-management/make-user'
import { UserDAO } from '../../DAO/user-dao'
import { TestContext } from 'vitest'
import { ResourceNotFoundError } from '@/shared/errors/use-case-errors/resource-not-found-error'
import { UserStatus } from '@/domain/user-and-permission-management/enterprise/enums/user-status'

interface TestContextWithSut extends TestContext {
    userRepository: UserDAO
    entity: User
    sut: ChangeUserStatusUseCase
}

describe('ChangeUserStatus', () => {
    beforeEach(async (context: TestContextWithSut) => {
        context.userRepository = new InMemoryUserRepository()

        context.sut = new ChangeUserStatusUseCase(context.userRepository)

        context.entity = makeUser()

        await context.userRepository.create(context.entity)
    })

    it('should be able to change user status', async ({
        sut,
        userRepository,
        entity,
    }: TestContextWithSut) => {
        const result = await sut.execute({
            userID: entity.id.toString(),
            newStatus: 'disabled',
        })

        expect(result.isRight()).toBe(true)
        const { user } = result.value as { user: User }
        expect(user.status).toBe(UserStatus.DISABLED)

        const items = await userRepository.listAll()
        expect(items[0].status).toBe(UserStatus.DISABLED)
    })

    it('should return a ValidationError if status invalid', async ({
        sut,
        entity,
    }: TestContextWithSut) => {
        const result = await sut.execute({
            userID: entity.id.toString(),
            newStatus: 'invalid',
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(ValidationError)

        const { message } = result.value as ValidationError
        expect(message).toBe('User Status invalid')
    })

    it('should return a ResourceNotFoundError if the user is not found', async ({
        sut,
        entity,
    }: TestContextWithSut) => {
        const result = await sut.execute({
            userID: 'unregistered',
            newStatus: entity.status.name,
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(ResourceNotFoundError)

        const { message } = result.value as ResourceNotFoundError
        expect(message).toBe('User not found')
    })
})
