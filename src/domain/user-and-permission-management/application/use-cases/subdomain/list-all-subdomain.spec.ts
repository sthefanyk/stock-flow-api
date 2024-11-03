import { InMemorySubdomainRepository } from '@/infra/repositories/in-memory/user-and-permission-management/in-memory-subdomain-repository'
import { ListAllUseCaseUseCase } from './list-all-subdomain'
import { Subdomain } from '@/domain/user-and-permission-management/enterprise/entities/subdomain'
import { makeSubdomain } from '@/test/factories/user-and-permission-management/make-subdomain'

describe('List all subdomain', () => {
    it('should be able to list all subdomains', async () => {
        const repository = new InMemorySubdomainRepository()
        const subdomain = new ListAllUseCaseUseCase(repository)

        repository.create(makeSubdomain({ name: 'Subdomain' }))
        repository.create(makeSubdomain())

        const result = await subdomain.execute()

        expect(result.isRight()).toBe(true)
        const subdomainsResult = result.value as { subdomains: Subdomain[] }
        expect(subdomainsResult.subdomains).toHaveLength(2)

        expect(repository.items).length(2)
        expect(repository.items[0].name).toBe('subdomain')
    })
})
