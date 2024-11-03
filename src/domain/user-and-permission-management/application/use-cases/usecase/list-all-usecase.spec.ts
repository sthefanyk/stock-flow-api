import { InMemoryUseCaseRepository } from '@/infra/repositories/in-memory/user-and-permission-management/in-memory-usecase-repository'
import { ListAllUseCaseUseCase } from './list-all-usecase'
import { makeUseCase } from '@/test/factories/user-and-permission-management/make-usecase'
import { UseCase } from '@/domain/user-and-permission-management/enterprise/entities/usecase'

describe('List all use case', () => {
    it('should be able to list all use cases', async () => {
        const repository = new InMemoryUseCaseRepository()
        const usecase = new ListAllUseCaseUseCase(repository)

        repository.create(makeUseCase({ name: 'USECASE' }))
        repository.create(makeUseCase())

        const result = await usecase.execute()

        expect(result.isRight()).toBe(true)
        const usecasesResult = result.value as { usecases: UseCase[] }
        expect(usecasesResult.usecases).toHaveLength(2)

        expect(repository.items).length(2)
        expect(repository.items[0].name).toBe('usecase')
    })
})
