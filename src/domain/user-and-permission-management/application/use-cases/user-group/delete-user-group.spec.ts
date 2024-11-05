import { InMemoryUserGroupRepository } from '@/infra/repositories/in-memory/user-and-permission-management/in-memory-user-group-repository'
import { DeleteUserGroupUseCase } from './delete-user-group'
import { makeUserGroup } from '@/test/factories/user-and-permission-management/make-user-group'
import { ResourceNotFoundError } from '@/shared/errors/use-case-errors/resource-not-found-error'
import { UserGroup } from '@/domain/user-and-permission-management/enterprise/entities/user-group'

describe('Delete user group', () => {
    it('should be able to delete user group', async () => {
        const repository = new InMemoryUserGroupRepository()
        const usecase = new DeleteUserGroupUseCase(repository)

        const entity = makeUserGroup()

        repository.create(entity)

        const result = await usecase.execute({
            name: entity.name,
        })

        expect(result.isRight()).toBe(true)
        const { userGroup } = result.value as { userGroup: UserGroup }
        expect(userGroup.equals(entity)).toBeTruthy()

        expect(repository.items).length(0)
    })

    it('should return a ResourceNotFoundError if user group not found', async () => {
        const repository = new InMemoryUserGroupRepository()
        const usecase = new DeleteUserGroupUseCase(repository)

        const result = await usecase.execute({
            name: 'unregistered',
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(ResourceNotFoundError)

        const { message } = result.value as ResourceNotFoundError
        expect(message).toBe('User group with this name not found')
    })
})
