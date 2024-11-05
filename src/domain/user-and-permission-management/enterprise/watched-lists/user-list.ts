import { WatchedList } from '@/shared/entities/watched-list'
import { User } from '../entities/user'

export class UserList extends WatchedList<User> {
    compareItems(a: User, b: User): boolean {
        return a.equals(b)
    }
}
