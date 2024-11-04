import { PermissionDAO } from '@/domain/user-and-permission-management/application/DAO/permission-dao'
import { Permission } from '@/domain/user-and-permission-management/enterprise/entities/permission'
import { Subdomain } from '@/domain/user-and-permission-management/enterprise/entities/subdomain'
import { UseCase } from '@/domain/user-and-permission-management/enterprise/entities/usecase'

export class InMemoryPermissionRepository implements PermissionDAO {
    async create(entity: Permission): Promise<void> {
        this.items.push(entity)
    }

    async save(entity: Permission): Promise<void> {
        const itemIndex = this.items.findIndex((item) => item.equals(entity))

        this.items[itemIndex] = entity
    }

    async delete(entity: Permission): Promise<void> {
        this.items = this.items.filter((item) => !item.equals(entity))
    }

    async find(entity: Permission): Promise<Permission | null> {
        return this.items.find((item) => item.equals(entity)) || null
    }

    async findByUsecase(usecase: UseCase): Promise<Permission[]> {
        return this.items.filter((item) => item.usecase.equals(usecase))
    }

    async findBySubdomain(subdomain: Subdomain): Promise<Permission[]> {
        return this.items.filter((item) => item.subdomain.equals(subdomain))
    }

    async listAll(): Promise<Permission[]> {
        return this.items
    }

    public items: Permission[] = []
}
