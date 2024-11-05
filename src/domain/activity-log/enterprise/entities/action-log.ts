import { UseCase } from '@/domain/user-and-permission-management/enterprise/entities/usecase'
import { User } from '@/domain/user-and-permission-management/enterprise/entities/user'
import { Entity } from '@/shared/entities/entity'
import { Optional } from '@/shared/types/optional'
import { UniqueEntityID } from '@/shared/value-objects/unique-entity-id'

export interface ActionLogProps {
    user: User
    action: UseCase
    details: string
    date: Date
}

export class ActionLog extends Entity<ActionLogProps> {
    get user() {
        return this.props.user
    }

    get action() {
        return this.props.action
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
        return actionLog
    }

    static validate(props: ActionLogProps) {
        return props
    }
}
