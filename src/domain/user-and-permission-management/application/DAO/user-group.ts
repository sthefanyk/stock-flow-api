import { UserGroup } from '../../enterprise/entities/user-group'

export interface UserGroupDAO {
    create(entity: UserGroup): Promise<void>
    save(entity: UserGroup): Promise<void>
    delete(entity: UserGroup): Promise<void>
    findByName(name: string): Promise<UserGroup | null>
    listAll(): Promise<UserGroup[]>
}
