import { Permission } from '../../enterprise/entities/permission'
import { Subdomain } from '../../enterprise/entities/subdomain'
import { UseCase } from '../../enterprise/entities/usecase'

export interface PermissionDAO {
    create(entity: Permission): Promise<void>
    save(entity: Permission): Promise<void>
    delete(entity: Permission): Promise<void>
    find(entity: Permission): Promise<Permission | null>
    findById(id: string): Promise<Permission | null>
    findByUsecase(usecase: UseCase): Promise<Permission[]>
    findBySubdomain(subdomain: Subdomain): Promise<Permission[]>
    listAll(): Promise<Permission[]>
}
