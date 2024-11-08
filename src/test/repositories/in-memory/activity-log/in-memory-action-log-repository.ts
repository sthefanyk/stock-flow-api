import { ActionLogDAO } from '@/domain/activity-log/application/DAO/action-log-dao'
import { ActionLog } from '@/domain/activity-log/enterprise/entities/action-log'

export class InMemoryActionLogRepository implements ActionLogDAO {
    async create(entity: ActionLog): Promise<void> {
        this.items.push(entity)
    }

    async delete(entity: ActionLog): Promise<void> {
        this.items = this.items.filter((item) => !item.equals(entity))
    }

    async findById(id: string): Promise<ActionLog | null> {
        return this.items.find((item) => item.id.toString() === id) || null
    }

    async findByAction(usecase: string): Promise<ActionLog[]> {
        return this.items.filter((item) => item.usecase === usecase)
    }

    async findByDateInterval(
        initialDate: Date,
        endDate: Date,
    ): Promise<ActionLog[]> {
        return this.items.filter(
            (item) => item.date >= initialDate && item.date <= endDate,
        )
    }

    async searchInDetails(details: string): Promise<ActionLog[]> {
        return this.items.filter((item) =>
            item.details.toLowerCase().includes(details.toLowerCase()),
        )
    }

    async listAll(): Promise<ActionLog[]> {
        return this.items
    }

    public items: ActionLog[] = []
}
