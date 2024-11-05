import { Entity } from '@/shared/entities/entity'
import { ValidationError } from '@/shared/errors/entity-errors/validation-error'
import { Optional } from '@/shared/types/optional'
import { PermissionList } from '../watched-lists/permission-list'
import { UserList } from '../watched-lists/user-list'
import { User } from './user'
import { ResourcesAlreadyExistError } from '@/shared/errors/entity-errors/resources-already-exist-error'
import { Permission } from './permission'
import { ResourceNotFoundError } from '@/shared/errors/entity-errors/resource-not-found-error'

export interface UserGroupProps {
    name: string
    permissions: PermissionList
    users: UserList
}

export class UserGroup extends Entity<UserGroupProps> {
    get name() {
        return this.props.name
    }

    get users() {
        return this.props.users.currentItems
    }

    get permissions() {
        return this.props.permissions.currentItems
    }

    addUser(user: User) {
        if (this.props.users.exists(user)) {
            throw new ResourcesAlreadyExistError(
                'User already exist in user group',
            )
        }

        this.props.users.add(user)
    }

    addPermission(permission: Permission) {
        if (this.props.permissions.exists(permission)) {
            throw new ResourcesAlreadyExistError(
                'Permission already exist in user group',
            )
        }

        this.props.permissions.add(permission)
    }

    removeUser(user: User) {
        if (!this.props.users.exists(user)) {
            throw new ResourceNotFoundError('User not found in user group')
        }

        this.props.users.remove(user)
    }

    removePermission(permission: Permission) {
        if (!this.props.permissions.exists(permission)) {
            throw new ResourceNotFoundError(
                'Permission not found in user group',
            )
        }

        this.props.permissions.remove(permission)
    }

    public equals(entity: UserGroup): boolean {
        if (entity.name === this.name) {
            return true
        }

        return false
    }

    static create(props: Optional<UserGroupProps, 'permissions' | 'users'>) {
        const userGroup = new UserGroup({
            users: props.users ?? new UserList(),
            permissions: props.permissions ?? new PermissionList(),
            ...this.validate(props),
        })
        return userGroup
    }

    static validate(props: Optional<UserGroupProps, 'permissions' | 'users'>) {
        // Validation for the name (should not be empty)
        if (!props.name || props.name.trim() === '') {
            throw new ValidationError('The name cannot be empty.')
        }
        props.name = props.name.toUpperCase()

        return props
    }
}
