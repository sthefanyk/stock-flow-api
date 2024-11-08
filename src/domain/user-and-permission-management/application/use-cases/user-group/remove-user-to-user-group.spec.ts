import { RemoveUserToUserGroupUseCase } from './remove-user-to-user-group'
import { UserGroup } from '@/domain/user-and-permission-management/enterprise/entities/user-group'
import { InMemoryUserGroupRepository } from '@/test/repositories/in-memory/user-and-permission-management/in-memory-user-group-repository'
import { makeUserGroup } from '@/test/factories/user-and-permission-management/make-user-group'
import { TestContext } from 'vitest'
import { UserDAO } from '../../DAO/user-dao'
import { UserGroupDAO } from '../../DAO/user-group-dao'
import { User } from '@/domain/user-and-permission-management/enterprise/entities/user'
import { InMemoryUserRepository } from '@/test/repositories/in-memory/user-and-permission-management/in-memory-user-repository'
import { makeUser } from '@/test/factories/user-and-permission-management/make-user'
import { ResourceNotFoundError } from '@/shared/errors/use-case-errors/resource-not-found-error'
import { UserList } from '@/domain/user-and-permission-management/enterprise/watched-lists/user-list'
import { ResourceNotFoundError as ResourceNotFoundEntityError } from '@/shared/errors/entity-errors/resource-not-found-error'

interface TestContextWithSut extends TestContext {
    userRepository: UserDAO
    userGroupRepository: UserGroupDAO
    user: User
    userGroup: UserGroup
    sut: RemoveUserToUserGroupUseCase
}

describe('RemoveUserToUserGroupUseCase', () => {
    beforeEach(async (context: TestContextWithSut) => {
        context.userGroupRepository = new InMemoryUserGroupRepository()
        context.userRepository = new InMemoryUserRepository()

        context.user = makeUser()
        context.userGroup = makeUserGroup({
            users: new UserList([context.user]),
        })

        context.userGroupRepository.create(context.userGroup)
        context.userRepository.create(context.user)

        context.sut = new RemoveUserToUserGroupUseCase(
            context.userGroupRepository,
            context.userRepository,
        )
    })

    it('should be able to remove user in user group', async ({
        sut,
        user,
        userGroup,
        userGroupRepository,
    }: TestContextWithSut) => {
        const result = await sut.execute({
            nameGroup: userGroup.name.toUpperCase(),
            userID: user.id.toString(),
        })

        expect(result.isRight()).toBe(true)
        const userGroupResult = result.value as { userGroup: UserGroup }
        expect(userGroupResult.userGroup.name).toBe(userGroup.name)

        const items = await userGroupRepository.listAll()

        expect(items[0].users).toHaveLength(0)
    })

    it('should return a ResourceNotFoundError if user not found in user group', async ({
        sut,
        userGroup,
        user,
    }: TestContextWithSut) => {
        await sut.execute({
            nameGroup: userGroup.name.toUpperCase(),
            userID: user.id.toString(),
        })

        const result = await sut.execute({
            nameGroup: userGroup.name,
            userID: user.id.toString(),
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(ResourceNotFoundEntityError)

        const { message } = result.value as ResourceNotFoundEntityError
        expect(message).toBe('User not found in user group')
    })

    it('should return a ResourceNotFoundError if the user group is not found', async ({
        sut,
        user,
        userGroupRepository,
    }: TestContextWithSut) => {
        const result = await sut.execute({
            nameGroup: 'unregistered',
            userID: user.id.toString(),
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(ResourceNotFoundError)

        const { message } = result.value as ResourceNotFoundError
        expect(message).toBe('User group not found')

        const items = await userGroupRepository.listAll()
        expect(items[0].users).length(1)
    })

    it('should return a ResourceNotFoundError if the user is not found', async ({
        sut,
        userGroup,
        userGroupRepository,
    }: TestContextWithSut) => {
        const result = await sut.execute({
            nameGroup: userGroup.name,
            userID: 'unregistered',
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(ResourceNotFoundError)

        const { message } = result.value as ResourceNotFoundError
        expect(message).toBe('User not found')

        const items = await userGroupRepository.listAll()
        expect(items[0].users).length(1)
    })
})
