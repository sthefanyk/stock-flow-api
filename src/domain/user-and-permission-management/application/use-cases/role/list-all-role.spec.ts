import { InMemoryRoleRepository } from '@/infra/repositories/in-memory/user-and-permission-management/in-memory-role-repository'
import { ListAllRoleUseCase } from './list-all-role'
import { makeRole } from '@/test/factories/user-and-permission-management/make-role'
import { Role } from '@/domain/user-and-permission-management/enterprise/entities/role'

describe('List all role', () => {
    it('should be able to list all roles', async () => {
        const repository = new InMemoryRoleRepository()
        const usecase = new ListAllRoleUseCase(repository)

        repository.create(makeRole({ name: 'ROLE' }))
        repository.create(makeRole())

        const result = await usecase.execute()

        expect(result.isRight()).toBe(true)
        const rolesResult = result.value as { roles: Role[] }
        expect(rolesResult.roles).toHaveLength(2)

        expect(repository.items).length(2)
        expect(repository.items[0].name).toBe('ROLE')
    })
})
