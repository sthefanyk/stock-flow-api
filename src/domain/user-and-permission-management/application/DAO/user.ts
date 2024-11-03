import { User } from '../../enterprise/entities/user'

export interface UserDAO {
    create(entity: User): Promise<void>
    save(entity: User): Promise<void>
    delete(entity: User): Promise<void>
    findByName(name: string): Promise<User | null>
    listAll(): Promise<User[]>
}
