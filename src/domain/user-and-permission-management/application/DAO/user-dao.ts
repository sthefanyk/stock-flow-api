import { User } from '../../enterprise/entities/user'

export abstract class UserDAO {
    abstract create(entity: User): Promise<void>
    abstract save(entity: User): Promise<void>
    abstract delete(entity: User): Promise<void>
    abstract findByEmail(email: string): Promise<User | null>
    abstract findById(id: string): Promise<User | null>
    abstract listAll(): Promise<User[]>
}
