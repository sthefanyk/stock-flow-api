import { InMemoryRoleRepository } from '@/test/repositories/in-memory/user-and-permission-management/in-memory-role-repository'
import { makeRole } from '@/test/factories/user-and-permission-management/make-role'
import { Role } from '@/domain/user-and-permission-management/enterprise/entities/role'
import { FindByNameRoleUseCase } from './find-by-name-role'

describe('FindByName role', () => {
    it('should be able to find by name role', async () => {
        const repository = new InMemoryRoleRepository()
        const usecase = new FindByNameRoleUseCase(repository)

        repository.create(makeRole({ name: 'ROLE' }))

        const result = await usecase.execute({
            name: 'role',
        })

        expect(result.isRight()).toBe(true)
        const rolesResult = result.value as { role: Role }
        expect(rolesResult.role.name).toBe('ROLE')
    })

    it('should be able to find by name role that does not exist', async () => {
        const repository = new InMemoryRoleRepository()
        const usecase = new FindByNameRoleUseCase(repository)

        const result = await usecase.execute({
            name: 'role',
        })

        expect(result.isRight()).toBe(true)
        expect(result.value).toStrictEqual({ role: null })
    })
})
