import { Role } from '../../enterprise/entities/role'

export abstract class RoleDAO {
    abstract create(entity: Role): Promise<void>
    abstract save(entity: Role): Promise<void>
    abstract delete(entity: Role): Promise<void>
    abstract findByName(name: string): Promise<Role | null>
    abstract listAll(): Promise<Role[]>
}
