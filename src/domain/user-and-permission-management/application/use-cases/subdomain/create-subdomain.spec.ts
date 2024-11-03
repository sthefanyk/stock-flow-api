import { CreateSubdomainUseCase } from './create-subdomain'
import { ValidationError } from '@/shared/errors/entity-errors/validation-error'
import { ResourcesAlreadyExistError } from '@/shared/errors/use-case-errors/resources-already-exist-error'
import { Subdomain } from '@/domain/user-and-permission-management/enterprise/entities/subdomain'
import { InMemorySubdomainRepository } from '@/infra/repositories/in-memory/user-and-permission-management/in-memory-subdomain-repository'

describe('Create subdomain', () => {
    it('should be able to create subdomain', async () => {
        const repository = new InMemorySubdomainRepository()
        const subdomain = new CreateSubdomainUseCase(repository)

        const result = await subdomain.execute({
            name: 'Subdomain',
        })

        expect(result.isRight()).toBe(true)
        const subdomainsResult = result.value as { subdomain: Subdomain }
        expect(subdomainsResult.subdomain.name).toBe('subdomain')

        expect(repository.items).length(1)
        expect(repository.items[0].name).toBe('subdomain')
    })

    it('should return a ValidationError if name be empty', async () => {
        const repository = new InMemorySubdomainRepository()
        const subdomain = new CreateSubdomainUseCase(repository)

        const result = await subdomain.execute({
            name: '',
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(ValidationError)
        expect(repository.items).length(0)
    })

    it('should return a ResourcesAlreadyExistError if subdomain name already exists', async () => {
        const repository = new InMemorySubdomainRepository()
        const subdomain = new CreateSubdomainUseCase(repository)

        await subdomain.execute({
            name: 'Subdomain',
        })

        const result = await subdomain.execute({
            name: 'Subdomain',
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(ResourcesAlreadyExistError)
        expect(repository.items).length(1)
    })
})
