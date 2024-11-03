import { CreateUseCaseUseCase } from './create-usecase'
import { ValidationError } from '@/shared/errors/entity-errors/validation-error'
import { ResourcesAlreadyExistError } from '@/shared/errors/use-case-errors/resources-already-exist-error'
import { UseCase } from '@/domain/user-and-permission-management/enterprise/entities/usecase'
import { InMemoryUseCaseRepository } from '@/infra/repositories/in-memory/user-and-permission-management/in-memory-usecase-repository'

describe('Create usecase', () => {
    it('should be able to create use case', async () => {
        const repository = new InMemoryUseCaseRepository()
        const usecase = new CreateUseCaseUseCase(repository)

        const result = await usecase.execute({
            name: 'Usecase',
        })

        expect(result.isRight()).toBe(true)
        const usecasesResult = result.value as { usecase: UseCase }
        expect(usecasesResult.usecase.name).toBe('usecase')

        expect(repository.items).length(1)
        expect(repository.items[0].name).toBe('usecase')
    })

    it('should return a ValidationError if name be empty', async () => {
        const repository = new InMemoryUseCaseRepository()
        const usecase = new CreateUseCaseUseCase(repository)

        const result = await usecase.execute({
            name: '',
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(ValidationError)
        expect(repository.items).length(0)
    })

    it('should return a ResourcesAlreadyExistError if usecase name already exists', async () => {
        const repository = new InMemoryUseCaseRepository()
        const usecase = new CreateUseCaseUseCase(repository)

        await usecase.execute({
            name: 'Usecase',
        })

        const result = await usecase.execute({
            name: 'Usecase',
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(ResourcesAlreadyExistError)
        expect(repository.items).length(1)
    })
})
