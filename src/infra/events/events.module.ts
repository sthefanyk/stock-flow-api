import { OnNewActionLog } from '@/domain/activity-log/application/subscribers/on-new-action-log'
import { NewActionLogUseCase } from '@/domain/activity-log/application/use-cases/new-action-log'
import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'

@Module({
    imports: [DatabaseModule],
    providers: [OnNewActionLog, NewActionLogUseCase],
})
export class EventsModule {}
