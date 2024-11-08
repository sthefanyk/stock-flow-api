import { InMemoryRoleRepository } from '@/test/repositories/in-memory/user-and-permission-management/in-memory-role-repository'
import { DeleteRoleUseCase } from './delete-role'
import { makeRole } from '@/test/factories/user-and-permission-management/make-role'
import { ResourceNotFoundError } from '@/shared/errors/use-case-errors/resource-not-found-error'
import { Role } from '@/domain/user-and-permission-management/enterprise/entities/role'

describe('Delete role', () => {
    it('should be able to delete role', async () => {
        const repository = new InMemoryRoleRepository()
        const usecase = new DeleteRoleUseCase(repository)

        repository.create(makeRole({ name: 'ROLE' }))

        const result = await usecase.execute({
            name: 'role',
        })

        expect(result.isRight()).toBe(true)
        const rolesResult = result.value as { role: Role }
        expect(rolesResult.role.name).toBe('ROLE')

        expect(repository.items).length(0)
    })

    it('should return a ResourceNotFoundError if role not found', async () => {
        const repository = new InMemoryRoleRepository()
        const usecase = new DeleteRoleUseCase(repository)

        const result = await usecase.execute({
            name: 'ROLE',
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(ResourceNotFoundError)
    })
})
