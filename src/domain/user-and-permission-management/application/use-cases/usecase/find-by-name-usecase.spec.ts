import { InMemoryUseCaseRepository } from '@/infra/repositories/in-memory/user-and-permission-management/in-memory-usecase-repository'
import { makeUseCase } from '@/test/factories/user-and-permission-management/make-usecase'
import { UseCase } from '@/domain/user-and-permission-management/enterprise/entities/usecase'
import { FindByNameUseCaseUseCase } from './find-by-name-usecase'

describe('FindByName use case', () => {
    it('should be able to find by name use case', async () => {
        const repository = new InMemoryUseCaseRepository()
        const usecase = new FindByNameUseCaseUseCase(repository)

        repository.create(makeUseCase({ name: 'USECASE' }))

        const result = await usecase.execute({
            name: 'usecase',
        })

        expect(result.isRight()).toBe(true)
        const usecasesResult = result.value as { usecase: UseCase }
        expect(usecasesResult.usecase.name).toBe('usecase')
    })

    it('should be able to find by name use case that does not exist', async () => {
        const repository = new InMemoryUseCaseRepository()
        const usecase = new FindByNameUseCaseUseCase(repository)

        const result = await usecase.execute({
            name: 'usecase',
        })

        expect(result.isRight()).toBe(true)
        expect(result.value).toStrictEqual({ usecase: null })
    })
})
