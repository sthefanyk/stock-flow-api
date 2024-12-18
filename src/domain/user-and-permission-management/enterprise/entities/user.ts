import { Entity } from '@/shared/entities/entity'
import { Role } from './role'
import { ValidationError } from '@/shared/errors/entity-errors/validation-error'
import { UniqueEntityID } from '@/shared/value-objects/unique-entity-id'
import { UserStatus } from '../enums/user-status'

export interface UserProps {
    name: string
    email: string
    password: string
    role: Role
    status: UserStatus
}

export class User extends Entity<UserProps> {
    get name() {
        return this.props.name
    }

    get email() {
        return this.props.email
    }

    get password() {
        return this.props.password
    }

    get role() {
        return this.props.role
    }

    get status() {
        return this.props.status
    }

    changeStatus(newStatus: string) {
        this.props.status = UserStatus.getUserStatusByName(newStatus)!
    }

    changeRole(newRole: Role) {
        this.props.role = newRole
    }

    public equals(entity: User): boolean {
        if (entity.id === this.id && entity.email === this.email) {
            return true
        }

        return false
    }

    static create(props: UserProps, id?: UniqueEntityID) {
        const userGroup = new User(this.validate(props), id)
        return userGroup
    }

    static validate(props: UserProps) {
        // Validation for the name (should not be empty)
        if (!props.name || props.name.trim() === '') {
            throw new ValidationError('The name cannot be empty.')
        }
        props.name = props.name.toUpperCase()

        // TODO: Validation for the email
        const emailRegex = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/
        if (!props.email || !emailRegex.test(props.email)) {
            throw new ValidationError('The email is invalid.')
        }
        props.email = props.email.toLowerCase()

        // TODO: Validation for the password
        // TODO: Validation for the status
        return props
    }
}
