import { ActionLog } from '../../enterprise/entities/action-log'

export abstract class ActionLogDAO {
    abstract create(entity: ActionLog): Promise<void>
    abstract delete(entity: ActionLog): Promise<void>
    abstract findById(id: string): Promise<ActionLog | null>
    abstract findByAction(usecase: string): Promise<ActionLog[]>
    abstract findByDateInterval(
        initialDate: Date,
        endDate: Date,
    ): Promise<ActionLog[]>

    abstract searchInDetails(details: string): Promise<ActionLog[]>
    abstract listAll(): Promise<ActionLog[]>
}
