import { InMemorySubdomainRepository } from '@/infra/repositories/in-memory/user-and-permission-management/in-memory-subdomain-repository'
import { DeleteUseCaseUseCase } from './delete-subdomain'
import { ResourceNotFoundError } from '@/shared/errors/use-case-errors/resource-not-found-error'
import { Subdomain } from '@/domain/user-and-permission-management/enterprise/entities/subdomain'
import { makeSubdomain } from '@/test/factories/user-and-permission-management/make-subdomain'

describe('Delete subdomain', () => {
    it('should be able to delete subdomain', async () => {
        const repository = new InMemorySubdomainRepository()
        const subdomain = new DeleteUseCaseUseCase(repository)

        repository.create(makeSubdomain({ name: 'Subdomain' }))

        const result = await subdomain.execute({
            name: 'Subdomain',
        })

        expect(result.isRight()).toBe(true)
        const subdomainsResult = result.value as { subdomain: Subdomain }
        expect(subdomainsResult.subdomain.name).toBe('subdomain')

        expect(repository.items).length(0)
    })

    it('should return a ResourceNotFoundError if subdomain not found', async () => {
        const repository = new InMemorySubdomainRepository()
        const subdomain = new DeleteUseCaseUseCase(repository)

        const result = await subdomain.execute({
            name: 'Subdomain',
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(ResourceNotFoundError)
    })
})
