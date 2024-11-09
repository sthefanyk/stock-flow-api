import { Role } from '@/domain/user-and-permission-management/enterprise/entities/role'

export class HttpRolePresenter {
    static toHTTP(entity: Role) {
        return {
            name: entity.name,
        }
    }
}
