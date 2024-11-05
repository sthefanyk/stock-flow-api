import { InMemoryUserGroupRepository } from '@/infra/repositories/in-memory/user-and-permission-management/in-memory-user-group-repository'
import { ListAllUserGroupUseCase } from './list-all-user-group'
import { makeUserGroup } from '@/test/factories/user-and-permission-management/make-user-group'
import { UserGroup } from '@/domain/user-and-permission-management/enterprise/entities/user-group'

describe('List all user group', () => {
    it('should be able to list all userGroups', async () => {
        const repository = new InMemoryUserGroupRepository()
        const usecase = new ListAllUserGroupUseCase(repository)

        const entity = makeUserGroup()

        repository.create(entity)
        repository.create(makeUserGroup())

        const result = await usecase.execute()

        expect(result.isRight()).toBe(true)
        const userGroupsResult = result.value as { userGroups: UserGroup[] }
        expect(userGroupsResult.userGroups).toHaveLength(2)

        expect(repository.items).length(2)
        expect(repository.items[0].equals(entity)).toBeTruthy()
    })
})
