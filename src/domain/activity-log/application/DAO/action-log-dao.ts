import { UseCase } from '@/domain/user-and-permission-management/enterprise/entities/usecase'
import { ActionLog } from '../../enterprise/entities/action-log'

export interface ActionLogDAO {
    create(entity: ActionLog): Promise<void>
    delete(entity: ActionLog): Promise<void>
    findById(id: string): Promise<ActionLog | null>
    findByAction(action: UseCase): Promise<ActionLog[]>
    findByDateInterval(initialDate: Date, endDate: Date): Promise<ActionLog[]>
    searchInDetails(details: string): Promise<ActionLog[]>
    listAll(): Promise<ActionLog[]>
}
