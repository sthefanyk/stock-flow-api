import { Entity } from '@/shared/entities/entity'
import { ValidationError } from '@/shared/errors/entity-errors/validation-error'

export interface SubdomainProps {
    name: string
    description?: string
}

export class Subdomain extends Entity<SubdomainProps> {
    get name() {
        return this.props.name
    }

    get description() {
        return this.props.description
    }

    public equals(entity: Subdomain): boolean {
        if (entity.name === this.name) {
            return true
        }

        return false
    }

    static create(props: SubdomainProps) {
        const subdomain = new Subdomain(this.validate(props))
        return subdomain
    }

    static validate(props: SubdomainProps) {
        // Validation for the name (should not be empty)
        if (!props.name || props.name.trim() === '') {
            throw new ValidationError('The name cannot be empty.')
        }
        props.name = props.name.toLowerCase()

        // Set description to an empty string if it is not provided
        props.description = props.description ?? ''

        return props
    }
}
