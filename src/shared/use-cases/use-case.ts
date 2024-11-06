import { ActionLog } from '@/domain/activity-log/enterprise/entities/action-log'
import { DomainEvents } from '../events/domain-events'

interface LogProps {
    userWhoExecutedID: string
    details?: string
}

export abstract class UseCase {
    private _name: string

    get name() {
        return this._name
    }

    public equals(usecase: UseCase) {
        return usecase === this || usecase.name === this._name
    }

    public log(props: LogProps) {
        const details =
            props.details ||
            `Executed ${this.name} on ${new Date().toISOString()}`

        const actionLog = ActionLog.create({
            details,
            userWhoExecutedID: props.userWhoExecutedID,
            usecase: this.name,
        })

        DomainEvents.dispatchEventsForAggregate(actionLog.id)
        // .catch((error) => {
        //     console.error('Erro ao despachar eventos do log:', error)
        // })
    }

    protected constructor(name: string) {
        this._name = name
    }
}
