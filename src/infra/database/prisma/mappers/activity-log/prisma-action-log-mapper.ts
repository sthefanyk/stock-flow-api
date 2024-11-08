import { ActionLog } from '@/domain/activity-log/enterprise/entities/action-log'
import { ActionLog as PrismaActionLog, Prisma } from '@prisma/client'

export class PrismaActionLogMapper {
    static toEntity(raw: PrismaActionLog): ActionLog {
        return ActionLog.create({
            userWhoExecutedID: raw.user_who_executed_id,
            usecase: raw.use_case_name,
            details: raw.details,
            date: raw.date,
        })
    }

    static toPrisma(entity: ActionLog): Prisma.ActionLogUncheckedCreateInput {
        return {
            user_who_executed_id: entity.userWhoExecutedID,
            use_case_name: entity.usecase,
            details: entity.details,
            date: entity.date,
        }
    }
}
