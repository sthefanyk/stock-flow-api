import { Role } from '../../enterprise/entities/role'

export interface RoleDAO {
    create(entity: Role): Promise<void>
    save(entity: Role): Promise<void>
    delete(entity: Role): Promise<void>
    findByName(name: string): Promise<Role | null>
    listAll(): Promise<Role[]>
}
