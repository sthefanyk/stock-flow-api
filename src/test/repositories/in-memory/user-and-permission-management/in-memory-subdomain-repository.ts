import { SubdomainDAO } from '@/domain/user-and-permission-management/application/DAO/subdomain-dao'
import { Subdomain } from '@/domain/user-and-permission-management/enterprise/entities/subdomain'

export class InMemorySubdomainRepository implements SubdomainDAO {
    async create(entity: Subdomain): Promise<void> {
        this.items.push(entity)
    }

    async save(entity: Subdomain): Promise<void> {
        const itemIndex = this.items.findIndex(
            (item) => item.name === entity.name,
        )

        this.items[itemIndex] = entity
    }

    async delete(entity: Subdomain): Promise<void> {
        this.items = this.items.filter((item) => !item.equals(entity))
    }

    async findByName(name: string): Promise<Subdomain | null> {
        return this.items.find((item) => item.name.toString() === name) || null
    }

    async listAll(): Promise<Subdomain[]> {
        return this.items
    }

    public items: Subdomain[] = []
}
