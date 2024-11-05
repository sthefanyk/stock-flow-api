import { UserGroupDAO } from '@/domain/user-and-permission-management/application/DAO/user-group-dao'
import { UserGroup } from '@/domain/user-and-permission-management/enterprise/entities/user-group'

export class InMemoryUserGroupRepository implements UserGroupDAO {
    async create(entity: UserGroup): Promise<void> {
        this.items.push(entity)
    }

    async save(entity: UserGroup): Promise<void> {
        const itemIndex = this.items.findIndex((item) => item.equals(entity))

        this.items[itemIndex] = entity
    }

    async delete(entity: UserGroup): Promise<void> {
        this.items = this.items.filter((item) => !item.equals(entity))
    }

    async findByName(name: string): Promise<UserGroup | null> {
        return this.items.find((item) => item.name.toString() === name) || null
    }

    async listAll(): Promise<UserGroup[]> {
        return this.items
    }

    public items: UserGroup[] = []
}
