import { InMemoryUserGroupRepository } from '@/infra/repositories/in-memory/user-and-permission-management/in-memory-user-group-repository'
import { makeUserGroup } from '@/test/factories/user-and-permission-management/make-user-group'
import { UserGroup } from '@/domain/user-and-permission-management/enterprise/entities/user-group'
import { FindByNameUserGroupUseCase } from './find-by-name-user-group'

describe('FindByName user group', () => {
    it('should be able to find by name role', async () => {
        const repository = new InMemoryUserGroupRepository()
        const usecase = new FindByNameUserGroupUseCase(repository)

        const entity = makeUserGroup()

        repository.create(entity)

        const result = await usecase.execute({
            name: entity.name,
        })

        expect(result.isRight()).toBe(true)
        const { userGroup } = result.value as { userGroup: UserGroup }
        expect(userGroup.equals(entity)).toBeTruthy()
    })

    it('should be able to find by name user group that does not exist', async () => {
        const repository = new InMemoryUserGroupRepository()
        const usecase = new FindByNameUserGroupUseCase(repository)

        const result = await usecase.execute({
            name: 'unregistered',
        })

        expect(result.isRight()).toBe(true)
        expect(result.value).toStrictEqual({ userGroup: null })
    })
})
