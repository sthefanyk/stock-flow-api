import { UseCase } from '../../enterprise/entities/usecase'

export abstract class UseCaseDAO {
    abstract create(entity: UseCase): Promise<void>
    abstract save(entity: UseCase): Promise<void>
    abstract delete(entity: UseCase): Promise<void>
    abstract findByName(name: string): Promise<UseCase | null>
    abstract listAll(): Promise<UseCase[]>
}
