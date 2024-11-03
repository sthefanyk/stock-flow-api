import { UseCase } from '../../enterprise/entities/usecase'

export interface UseCaseDAO {
    create(entity: UseCase): Promise<void>
    save(entity: UseCase): Promise<void>
    delete(entity: UseCase): Promise<void>
    findByName(name: string): Promise<UseCase | null>
    listAll(): Promise<UseCase[]>
}
