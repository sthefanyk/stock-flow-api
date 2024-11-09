import { Permission } from '../../enterprise/entities/permission'
import { Subdomain } from '../../enterprise/entities/subdomain'
import { UseCase } from '../../enterprise/entities/usecase'

export abstract class PermissionDAO {
    abstract create(entity: Permission): Promise<void>
    abstract save(entity: Permission): Promise<void>
    abstract delete(entity: Permission): Promise<void>
    abstract find(entity: Permission): Promise<Permission | null>
    abstract findByUsecaseAndSubdomain(
        usecase: string,
        subdomain: string,
    ): Promise<Permission | null>

    abstract findByUsecase(usecase: UseCase): Promise<Permission[]>
    abstract findBySubdomain(subdomain: Subdomain): Promise<Permission[]>
    abstract listAll(): Promise<Permission[]>
}
