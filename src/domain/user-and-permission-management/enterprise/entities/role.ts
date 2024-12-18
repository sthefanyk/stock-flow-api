import { Entity } from '@/shared/entities/entity'
import { ValidationError } from '@/shared/errors/entity-errors/validation-error'

export interface RoleProps {
    name: string
}

export class Role extends Entity<RoleProps> {
    get name() {
        return this.props.name
    }

    public equals(entity: Role): boolean {
        if (entity.name === this.name) {
            return true
        }

        return false
    }

    static create(props: RoleProps) {
        const role = new Role(this.validate(props))
        return role
    }

    static validate(props: RoleProps) {
        // Validation for the name (should not be empty)
        if (!props.name || props.name.trim() === '') {
            throw new ValidationError('The name cannot be empty.')
        }
        props.name = props.name.toUpperCase()

        return props
    }
}
