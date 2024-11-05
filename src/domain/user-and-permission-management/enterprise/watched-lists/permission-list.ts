import { WatchedList } from '@/shared/entities/watched-list'
import { Permission } from '../entities/permission'

export class PermissionList extends WatchedList<Permission> {
    compareItems(a: Permission, b: Permission): boolean {
        return a.equals(b)
    }
}
