import { EventHandler } from '@/shared/events/event-handler'
import { ActionLogDAO } from '../DAO/action-log-dao'
import { UserDAO } from '@/domain/user-and-permission-management/application/DAO/user-dao'
import { UseCaseDAO } from '@/domain/user-and-permission-management/application/DAO/usecase-dao'
import { DomainEvents } from '@/shared/events/domain-events'
import { NewActionEvent } from '@/domain/activity-log/enterprise/events/new-action-log.event'
import { NewActionLogUseCase } from '../use-cases/new-action-log'

export class OnNewActionLog implements EventHandler {
    constructor(
        private actionRepository: ActionLogDAO,
        private userRepository: UserDAO,
        private useCaseRepository: UseCaseDAO,
    ) {
        this.setupSubscriptions()
    }

    setupSubscriptions(): void {
        DomainEvents.register(
            this.registerNewActionLog.bind(this),
            NewActionEvent.name,
        )
    }

    private async registerNewActionLog({ actionLog }: NewActionEvent) {
        const usecase = new NewActionLogUseCase(
            this.actionRepository,
            this.userRepository,
            this.useCaseRepository,
        )

        usecase.execute({ actionLog })
    }
}
