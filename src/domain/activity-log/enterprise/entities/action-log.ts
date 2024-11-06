import { NewActionEvent } from '@/domain/activity-log/enterprise/events/new-action-log.event'
import { AggregateRoot } from '@/shared/entities/aggregate-root'
import { Optional } from '@/shared/types/optional'
import { UniqueEntityID } from '@/shared/value-objects/unique-entity-id'

export interface ActionLogProps {
    userWhoExecutedID: string
    usecase: string
    details: string
    date: Date
}

export class ActionLog extends AggregateRoot<ActionLogProps> {
    get userWhoExecutedID() {
        return this.props.userWhoExecutedID
    }

    get usecase() {
        return this.props.usecase
    }

    get details() {
        return this.props.details
    }

    get date() {
        return this.props.date
    }

    public equals(entity: ActionLog) {
        return this.id.equals(entity.id)
    }

    static create(
        props: Optional<ActionLogProps, 'date'>,
        id?: UniqueEntityID,
    ) {
        const actionLog = new ActionLog(
            this.validate({
                date: new Date(),
                ...props,
            }),
            id,
        )

        const isNewActionLog = !id
        if (isNewActionLog) {
            actionLog.addDomainEvent(new NewActionEvent(actionLog))
        }

        return actionLog
    }

    static validate(props: ActionLogProps) {
        return props
    }
}
