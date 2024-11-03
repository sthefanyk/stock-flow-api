import { UseCaseDAO } from '@/domain/user-and-permission-management/application/DAO/usecase-dao'
import { UseCase } from '@/domain/user-and-permission-management/enterprise/entities/usecase'

export class InMemoryUseCaseRepository implements UseCaseDAO {
    async create(entity: UseCase): Promise<void> {
        this.items.push(entity)
    }

    async save(entity: UseCase): Promise<void> {
        const itemIndex = this.items.findIndex(
            (item) => item.name === entity.name,
        )

        this.items[itemIndex] = entity
    }

    async delete(entity: UseCase): Promise<void> {
        this.items = this.items.filter((item) => !item.equals(entity))
    }

    async findByName(name: string): Promise<UseCase | null> {
        return this.items.find((item) => item.name.toString() === name) || null
    }

    async listAll(): Promise<UseCase[]> {
        return this.items
    }

    public items: UseCase[] = []
}
