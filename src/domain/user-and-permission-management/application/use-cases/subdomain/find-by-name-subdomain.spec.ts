import { InMemorySubdomainRepository } from '@/infra/repositories/in-memory/user-and-permission-management/in-memory-subdomain-repository'
import { FindByNameSubdomainUseCase } from './find-by-name-subdomain'
import { makeSubdomain } from '@/test/factories/user-and-permission-management/make-subdomain'
import { Subdomain } from '@/domain/user-and-permission-management/enterprise/entities/subdomain'

describe('FindByName subdomain', () => {
    it('should be able to find by name subdomain', async () => {
        const repository = new InMemorySubdomainRepository()
        const subdomain = new FindByNameSubdomainUseCase(repository)

        repository.create(makeSubdomain({ name: 'SUBDOMAIN' }))

        const result = await subdomain.execute({
            name: 'subdomain',
        })

        expect(result.isRight()).toBe(true)
        const subdomainsResult = result.value as { subdomain: Subdomain }
        expect(subdomainsResult.subdomain.name).toBe('subdomain')
    })

    it('should be able to find by name subdomain that does not exist', async () => {
        const repository = new InMemorySubdomainRepository()
        const subdomain = new FindByNameSubdomainUseCase(repository)

        const result = await subdomain.execute({
            name: 'subdomain',
        })

        expect(result.isRight()).toBe(true)
        expect(result.value).toStrictEqual({ subdomain: null })
    })
})
