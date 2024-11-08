import { CreatePermissionUseCase } from './create-permission'
import { InMemoryPermissionRepository } from '@/test/repositories/in-memory/user-and-permission-management/in-memory-permission-repository'
import { InMemorySubdomainRepository } from '@/test/repositories/in-memory/user-and-permission-management/in-memory-subdomain-repository'
import { InMemoryUseCaseRepository } from '@/test/repositories/in-memory/user-and-permission-management/in-memory-usecase-repository'
import { makePermission } from '@/test/factories/user-and-permission-management/make-permission'
import { TestContext } from 'vitest'
import { PermissionDAO } from '../../DAO/permission-dao'
import { UseCaseDAO } from '../../DAO/usecase-dao'
import { SubdomainDAO } from '../../DAO/subdomain-dao'
import { Permission } from '@/domain/user-and-permission-management/enterprise/entities/permission'
import { ResourcesAlreadyExistError } from '@/shared/errors/use-case-errors/resources-already-exist-error'
import { ResourceNotFoundError } from '@/shared/errors/use-case-errors/resource-not-found-error'
import { ValidationError } from '@/shared/errors/entity-errors/validation-error'

interface TestContextWithSut extends TestContext {
    permissionRepository: PermissionDAO
    subdomainRepository: SubdomainDAO
    usecaseRepository: UseCaseDAO
    entity: Permission
    sut: CreatePermissionUseCase
}

describe('Create permission', () => {
    beforeEach(async (context: TestContextWithSut) => {
        context.permissionRepository = new InMemoryPermissionRepository()
        context.subdomainRepository = new InMemorySubdomainRepository()
        context.usecaseRepository = new InMemoryUseCaseRepository()

        context.sut = new CreatePermissionUseCase(
            context.permissionRepository,
            context.subdomainRepository,
            context.usecaseRepository,
        )

        context.entity = makePermission({
            subdomain: 'subdomain',
            usecase: 'usecase',
        })

        await context.subdomainRepository.create(context.entity.subdomain)
        await context.usecaseRepository.create(context.entity.usecase)
    })

    it('should be able to create permission', async ({
        sut,
        entity,
        permissionRepository,
    }: TestContextWithSut) => {
        const result = await sut.execute({
            subdomain: entity.subdomain.name,
            usecase: entity.usecase.name,
            accessLevel: 'create',
        })

        expect(result.isRight()).toBe(true)
        const { permission } = result.value as { permission: Permission }
        expect(permission.equals(entity)).toBeTruthy()
        expect(permission.accessLevel.name).toBe('CREATE')

        const items = await permissionRepository.listAll()
        expect(items).toHaveLength(1)
        expect(items[0].equals(entity)).toBeTruthy()
    })

    it('should return a ResourceNotFoundError if the subdomain is not found', async ({
        sut,
        entity,
        permissionRepository,
    }: TestContextWithSut) => {
        const result = await sut.execute({
            subdomain: 'unregistered',
            usecase: entity.usecase.name,
            accessLevel: entity.accessLevel.name,
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(ResourceNotFoundError)

        const { message } = result.value as ResourceNotFoundError
        expect(message).toBe('Subdomain not found')

        const items = await permissionRepository.listAll()
        expect(items).length(0)
    })

    it('should return a ResourceNotFoundError if the use case is not found', async ({
        sut,
        entity,
        permissionRepository,
    }: TestContextWithSut) => {
        const result = await sut.execute({
            subdomain: entity.subdomain.name,
            usecase: 'unregistered',
            accessLevel: entity.accessLevel.name,
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(ResourceNotFoundError)

        const { message } = result.value as ResourceNotFoundError
        expect(message).toBe('Use case not found')

        const items = await permissionRepository.listAll()
        expect(items).length(0)
    })

    it('should return a ValidationError if invalid access level', async ({
        sut,
        entity,
        permissionRepository,
    }: TestContextWithSut) => {
        const result = await sut.execute({
            subdomain: entity.subdomain.name,
            usecase: entity.usecase.name,
            accessLevel: 'invalid',
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(ValidationError)

        const { message } = result.value as ResourceNotFoundError
        expect(message).toBe('Access Level invalid')

        const items = await permissionRepository.listAll()
        expect(items).length(0)
    })

    it('should return a ResourcesAlreadyExistError if permission already exists', async ({
        sut,
        entity,
        permissionRepository,
    }: TestContextWithSut) => {
        await permissionRepository.create(entity)

        const result = await sut.execute({
            subdomain: entity.subdomain.name,
            usecase: entity.usecase.name,
            accessLevel: entity.accessLevel.name,
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(ResourcesAlreadyExistError)

        const items = await permissionRepository.listAll()
        expect(items).length(1)
    })
})
