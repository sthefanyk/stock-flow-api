import { InMemoryRoleRepository } from '@/test/repositories/in-memory/user-and-permission-management/in-memory-role-repository'
import { CreateRoleUseCase } from './create-role'
import { ValidationError } from '@/shared/errors/entity-errors/validation-error'
import { ResourcesAlreadyExistError } from '@/shared/errors/use-case-errors/resources-already-exist-error'
import { Role } from '@/domain/user-and-permission-management/enterprise/entities/role'
import { makeRole } from '@/test/factories/user-and-permission-management/make-role'

describe('Create role', () => {
    it('should be able to create role', async () => {
        const repository = new InMemoryRoleRepository()
        const usecase = new CreateRoleUseCase(repository)

        const result = await usecase.execute({
            name: 'role',
        })

        expect(result.isRight()).toBe(true)
        const rolesResult = result.value as { role: Role }
        expect(rolesResult.role.name).toBe('ROLE')

        expect(repository.items).length(1)
        expect(repository.items[0].name).toBe('ROLE')
    })

    it('should return a ValidationError if name be empty', async () => {
        const repository = new InMemoryRoleRepository()
        const usecase = new CreateRoleUseCase(repository)

        const result = await usecase.execute({
            name: '',
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(ValidationError)
        expect(repository.items).length(0)
    })

    it('should return a ResourcesAlreadyExistError if role name already exists', async () => {
        const repository = new InMemoryRoleRepository()
        const usecase = new CreateRoleUseCase(repository)

        await repository.create(makeRole({ name: 'ROLE' }))

        const result = await usecase.execute({
            name: 'role',
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(ResourcesAlreadyExistError)
        expect(repository.items).length(1)
    })
})
