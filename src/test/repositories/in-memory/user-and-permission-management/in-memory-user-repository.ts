import { UserDAO } from '@/domain/user-and-permission-management/application/DAO/user-dao'
import { User } from '@/domain/user-and-permission-management/enterprise/entities/user'

export class InMemoryUserRepository implements UserDAO {
    async create(entity: User): Promise<void> {
        this.items.push(entity)
    }

    async save(entity: User): Promise<void> {
        const itemIndex = this.items.findIndex((item) => item.equals(entity))

        this.items[itemIndex] = entity
    }

    async delete(entity: User): Promise<void> {
        this.items = this.items.filter((item) => !item.equals(entity))
    }

    async findById(id: string): Promise<User | null> {
        return this.items.find((item) => item.id.toString() === id) || null
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.items.find((item) => item.email === email) || null
    }

    async listAll(): Promise<User[]> {
        return this.items
    }

    public items: User[] = []
}
