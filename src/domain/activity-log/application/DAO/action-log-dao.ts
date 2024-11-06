import { ActionLog } from '../../enterprise/entities/action-log'

export interface ActionLogDAO {
    create(entity: ActionLog): Promise<void>
    delete(entity: ActionLog): Promise<void>
    findById(id: string): Promise<ActionLog | null>
    findByAction(usecase: string): Promise<ActionLog[]>
    findByDateInterval(initialDate: Date, endDate: Date): Promise<ActionLog[]>
    searchInDetails(details: string): Promise<ActionLog[]>
    listAll(): Promise<ActionLog[]>
}
