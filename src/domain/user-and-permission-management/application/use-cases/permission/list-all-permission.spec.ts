import { InMemoryPermissionRepository } from '@/infra/repositories/in-memory/user-and-permission-management/in-memory-permission-repository'
import { ListAllPermissionUseCase } from './list-all-permission'
import { makePermission } from '@/test/factories/user-and-permission-management/make-permission'
import { Permission } from '@/domain/user-and-permission-management/enterprise/entities/permission'

describe('List all permission', () => {
    it('should be able to list all permissions', async () => {
        const repository = new InMemoryPermissionRepository()
        const usecase = new ListAllPermissionUseCase(repository)

        repository.create(makePermission({ subdomain: 'test' }))
        repository.create(makePermission())

        const result = await usecase.execute()

        expect(result.isRight()).toBe(true)
        const permissionsResult = result.value as { permissions: Permission[] }
        expect(permissionsResult.permissions).toHaveLength(2)

        expect(repository.items).length(2)
        expect(repository.items[0].subdomain.name).toBe('test')
    })
})
