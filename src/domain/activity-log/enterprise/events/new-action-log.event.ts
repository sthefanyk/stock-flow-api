import { DomainEvent } from '@/shared/events/domain-event'
import { UniqueEntityID } from '@/shared/value-objects/unique-entity-id'
import { ActionLog } from '../entities/action-log'

export class NewActionEvent implements DomainEvent {
    public ocurredAt: Date
    public actionLog: ActionLog

    constructor(actionLog: ActionLog) {
        this.ocurredAt = new Date()
        this.actionLog = actionLog
    }

    getAggregateId(): UniqueEntityID {
        return this.actionLog.id
    }
}
