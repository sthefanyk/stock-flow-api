import { InMemoryUseCaseRepository } from '@/infra/repositories/in-memory/user-and-permission-management/in-memory-usecase-repository'
import { DeleteUseCaseUseCase } from './delete-usecase'
import { ResourceNotFoundError } from '@/shared/errors/use-case-errors/resource-not-found-error'
import { UseCase } from '@/domain/user-and-permission-management/enterprise/entities/usecase'
import { makeUseCase } from '@/test/factories/user-and-permission-management/make-usecase'

describe('Delete usecase', () => {
    it('should be able to delete use case', async () => {
        const repository = new InMemoryUseCaseRepository()
        const usecase = new DeleteUseCaseUseCase(repository)

        repository.create(makeUseCase({ name: 'Usecase' }))

        const result = await usecase.execute({
            name: 'Usecase',
        })

        expect(result.isRight()).toBe(true)
        const usecasesResult = result.value as { usecase: UseCase }
        expect(usecasesResult.usecase.name).toBe('usecase')

        expect(repository.items).length(0)
    })

    it('should return a ResourceNotFoundError if usecase not found', async () => {
        const repository = new InMemoryUseCaseRepository()
        const usecase = new DeleteUseCaseUseCase(repository)

        const result = await usecase.execute({
            name: 'Usecase',
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(ResourceNotFoundError)
    })
})
