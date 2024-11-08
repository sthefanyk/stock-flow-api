import { FindPermissionByNameUsecaseUseCase } from './find-permission-by-name-usecase'
import { InMemoryPermissionRepository } from '@/test/repositories/in-memory/user-and-permission-management/in-memory-permission-repository'
import { InMemoryUseCaseRepository } from '@/test/repositories/in-memory/user-and-permission-management/in-memory-usecase-repository'
import { makePermission } from '@/test/factories/user-and-permission-management/make-permission'
import { TestContext } from 'vitest'
import { PermissionDAO } from '../../DAO/permission-dao'
import { UseCaseDAO } from '../../DAO/usecase-dao'
import { Permission } from '@/domain/user-and-permission-management/enterprise/entities/permission'
import { ResourceNotFoundError } from '@/shared/errors/use-case-errors/resource-not-found-error'
import { makeUseCase } from '@/test/factories/user-and-permission-management/make-usecase'

interface TestContextWithSut extends TestContext {
    permissionRepository: PermissionDAO
    usecaseRepository: UseCaseDAO
    sut: FindPermissionByNameUsecaseUseCase
}

describe('FindPermissionByUsecase', () => {
    beforeEach(async (context: TestContextWithSut) => {
        context.permissionRepository = new InMemoryPermissionRepository()
        context.usecaseRepository = new InMemoryUseCaseRepository()

        context.sut = new FindPermissionByNameUsecaseUseCase(
            context.permissionRepository,
            context.usecaseRepository,
        )

        context.usecaseRepository.create(makeUseCase({ name: 'test' }))
        context.usecaseRepository.create(makeUseCase({ name: 'usecase-test' }))

        await context.permissionRepository.create(
            makePermission({ usecase: 'test' }),
        )

        await context.permissionRepository.create(
            makePermission({ usecase: 'usecase-test' }),
        )

        await context.permissionRepository.create(
            makePermission({ usecase: 'usecase-test' }),
        )
    })

    it('should be able to find permission by name use case', async ({
        sut,
    }: TestContextWithSut) => {
        const result = await sut.execute({ name: 'usecase-test' })

        expect(result.isRight()).toBe(true)
        const { permissions } = result.value as { permissions: Permission[] }
        expect(permissions).toHaveLength(2)
        expect(permissions[0].usecase.name).toBe('usecase-test')
    })

    it('should return a ResourceNotFoundError if the use case is not found', async ({
        sut,
    }: TestContextWithSut) => {
        const result = await sut.execute({ name: 'usecase-unregistered' })

        expect(result.isLeft()).toBeTruthy()
        expect(result.value).toBeInstanceOf(ResourceNotFoundError)

        const { message } = result.value as ResourceNotFoundError
        expect(message).toBe('Use case not found')
    })
})
