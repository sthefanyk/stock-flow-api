import { UserGroup } from '../../enterprise/entities/user-group'

export abstract class UserGroupDAO {
    abstract create(entity: UserGroup): Promise<void>
    abstract save(entity: UserGroup): Promise<void>
    abstract delete(entity: UserGroup): Promise<void>
    abstract findByName(name: string): Promise<UserGroup | null>
    abstract listAll(): Promise<UserGroup[]>
}
