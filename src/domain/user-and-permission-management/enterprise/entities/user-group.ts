import { Entity } from '@/shared/entities/entity'
import { Permission } from './permission'
import { User } from './user'

interface UserGroupProps {
    name: string
    permissions: Permission[]
    users: User[]
}

export class UserGroup extends Entity<UserGroupProps> {}
