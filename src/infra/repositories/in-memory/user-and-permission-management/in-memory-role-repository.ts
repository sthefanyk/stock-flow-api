import { RoleDAO } from '@/domain/user-and-permission-management/application/DAO/role-dao'
import { Role } from '@/domain/user-and-permission-management/enterprise/entities/role'

export class InMemoryRoleRepository implements RoleDAO {
    async create(entity: Role): Promise<void> {
        this.items.push(entity)
    }

    async save(entity: Role): Promise<void> {
        const itemIndex = this.items.findIndex(
            (item) => item.name === entity.name,
        )

        this.items[itemIndex] = entity
    }

    async delete(entity: Role): Promise<void> {
        this.items = this.items.filter((item) => item.equals(entity))
    }

    async findByName(name: string): Promise<Role | null> {
        return this.items.find((item) => item.name.toString() === name) || null
    }

    async listAll(): Promise<Role[]> {
        return this.items
    }

    public items: Role[] = []
}
