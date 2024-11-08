import { CreateUserGroupUseCase } from './create-user-group'
import { ValidationError } from '@/shared/errors/entity-errors/validation-error'
import { ResourcesAlreadyExistError } from '@/shared/errors/use-case-errors/resources-already-exist-error'
import { UserGroup } from '@/domain/user-and-permission-management/enterprise/entities/user-group'
import { InMemoryUserGroupRepository } from '@/test/repositories/in-memory/user-and-permission-management/in-memory-user-group-repository'
import { makeUserGroup } from '@/test/factories/user-and-permission-management/make-user-group'

describe('Create user group', () => {
    it('should be able to create user group', async () => {
        const repository = new InMemoryUserGroupRepository()
        const usecase = new CreateUserGroupUseCase(repository)
        const entity = makeUserGroup()

        const result = await usecase.execute({
            name: entity.name,
        })

        expect(result.isRight()).toBe(true)
        const { userGroup } = result.value as { userGroup: UserGroup }
        expect(userGroup.name).toBe(entity.name)

        expect(repository.items).length(1)
        expect(repository.items[0].name).toBe(entity.name)
    })

    it('should return a ValidationError if name be empty', async () => {
        const repository = new InMemoryUserGroupRepository()
        const usecase = new CreateUserGroupUseCase(repository)

        const result = await usecase.execute({
            name: '',
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(ValidationError)
        expect(repository.items).length(0)
    })

    it('should return a ResourcesAlreadyExistError if role name already exists', async () => {
        const repository = new InMemoryUserGroupRepository()
        const usecase = new CreateUserGroupUseCase(repository)
        const entity = makeUserGroup()

        await repository.create(entity)

        const result = await usecase.execute({
            name: entity.name,
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(ResourcesAlreadyExistError)
        expect(repository.items).length(1)
    })
})
