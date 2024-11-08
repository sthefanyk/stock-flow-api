import { Entity } from '@/shared/entities/entity'
import { ValidationError } from '@/shared/errors/entity-errors/validation-error'

export interface UseCaseProps {
    name: string
    description?: string | null
}

export class UseCase extends Entity<UseCaseProps> {
    get name() {
        return this.props.name
    }

    get description() {
        return this.props.description
    }

    public equals(entity: UseCase): boolean {
        if (entity.name === this.name) {
            return true
        }

        return false
    }

    static create(props: UseCaseProps) {
        const usecase = new UseCase(this.validate(props))
        return usecase
    }

    static validate(props: UseCaseProps) {
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
