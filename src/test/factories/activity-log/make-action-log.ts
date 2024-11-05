import { faker } from '@faker-js/faker'
import {
    ActionLog,
    ActionLogProps,
} from '@/domain/activity-log/enterprise/entities/action-log'
import { makeUseCase } from '../user-and-permission-management/make-usecase'
import { makeUser } from '../user-and-permission-management/make-user'

export function makeActionLog(
    override: Partial<ActionLogProps> = {},
): ActionLog {
    const user = makeUser()
    const usecase = makeUseCase()

    const permission = ActionLog.create({
        user,
        action: usecase,
        details: faker.lorem.sentences(),
        ...override,
    })

    return permission
}
