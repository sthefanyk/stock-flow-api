import { FindPermissionByNameSubdomainUseCase } from './find-permission-by-name-subdomain'
import { InMemoryPermissionRepository } from '@/infra/repositories/in-memory/user-and-permission-management/in-memory-permission-repository'
import { InMemorySubdomainRepository } from '@/infra/repositories/in-memory/user-and-permission-management/in-memory-subdomain-repository'
import { makePermission } from '@/test/factories/user-and-permission-management/make-permission'
import { TestContext } from 'vitest'
import { PermissionDAO } from '../../DAO/permission-dao'
import { SubdomainDAO } from '../../DAO/subdomain-dao'
import { Permission } from '@/domain/user-and-permission-management/enterprise/entities/permission'
import { ResourceNotFoundError } from '@/shared/errors/use-case-errors/resource-not-found-error'
import { makeSubdomain } from '@/test/factories/user-and-permission-management/make-subdomain'

interface TestContextWithSut extends TestContext {
    permissionRepository: PermissionDAO
    subdomainRepository: SubdomainDAO
    sut: FindPermissionByNameSubdomainUseCase
}

describe('FindPermissionBySubdomain', () => {
    beforeEach(async (context: TestContextWithSut) => {
        context.permissionRepository = new InMemoryPermissionRepository()
        context.subdomainRepository = new InMemorySubdomainRepository()

        context.sut = new FindPermissionByNameSubdomainUseCase(
            context.permissionRepository,
            context.subdomainRepository,
        )

        context.subdomainRepository.create(makeSubdomain({ name: 'test' }))
        context.subdomainRepository.create(
            makeSubdomain({ name: 'subdomain-test' }),
        )

        await context.permissionRepository.create(
            makePermission({ subdomain: 'test' }),
        )

        await context.permissionRepository.create(
            makePermission({ subdomain: 'subdomain-test' }),
        )

        await context.permissionRepository.create(
            makePermission({ subdomain: 'subdomain-test' }),
        )
    })

    it('should be able to find permission by name subdomain', async ({
        sut,
    }: TestContextWithSut) => {
        const result = await sut.execute({ name: 'subdomain-test' })

        expect(result.isRight()).toBe(true)
        const { permissions } = result.value as { permissions: Permission[] }
        expect(permissions).toHaveLength(2)
        expect(permissions[0].subdomain.name).toBe('subdomain-test')
    })

    it('should return a ResourceNotFoundError if the subdomain is not found', async ({
        sut,
    }: TestContextWithSut) => {
        const result = await sut.execute({ name: 'subdomain-unregistered' })

        expect(result.isLeft()).toBeTruthy()
        expect(result.value).toBeInstanceOf(ResourceNotFoundError)

        const { message } = result.value as ResourceNotFoundError
        expect(message).toBe('Subdomain not found')
    })
})
