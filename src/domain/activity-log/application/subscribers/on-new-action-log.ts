import { EventHandler } from '@/shared/events/event-handler'
import { DomainEvents } from '@/shared/events/domain-events'
import { NewActionEvent } from '@/domain/activity-log/enterprise/events/new-action-log.event'
import { NewActionLogUseCase } from '../use-cases/new-action-log'
import { Injectable } from '@nestjs/common'

@Injectable()
export class OnNewActionLog implements EventHandler {
    constructor(private newActionLogUseCase: NewActionLogUseCase) {
        this.setupSubscriptions()
    }

    setupSubscriptions(): void {
        DomainEvents.register(
            this.registerNewActionLog.bind(this),
            NewActionEvent.name,
        )
    }

    private async registerNewActionLog({ actionLog }: NewActionEvent) {
        this.newActionLogUseCase.execute({ actionLog })
    }
}
