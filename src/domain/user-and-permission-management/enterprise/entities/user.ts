import { Entity } from '@/shared/entities/entity'
import { Role } from './role'
import { ValidationError } from '@/shared/errors/entity-errors/validation-error'
import { UniqueEntityID } from '@/shared/value-objects/unique-entity-id'

export interface UserProps {
    name: string
    email: string
    password: string
    role: Role
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
        // TODO: Validation for the password
        return props
    }
}
