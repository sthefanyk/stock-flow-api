import { Permission } from '../../enterprise/entities/permission'

export interface PermissionDAO {
    create(entity: Permission): Promise<void>
    save(entity: Permission): Promise<void>
    delete(entity: Permission): Promise<void>
    findById(id: string): Promise<Permission | null>
    listAll(): Promise<Permission[]>
}
