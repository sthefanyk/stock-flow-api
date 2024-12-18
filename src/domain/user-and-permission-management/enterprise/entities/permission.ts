import { Entity } from '@/shared/entities/entity'
import { AccessLevel } from '../enums/access-level'
import { Subdomain } from './subdomain'
import { UseCase } from './usecase'

export interface PermissionProps {
    subdomain: Subdomain
    usecase: UseCase
    accessLevel: AccessLevel
}

export class Permission extends Entity<PermissionProps> {
    get subdomain() {
        return this.props.subdomain
    }

    get usecase() {
        return this.props.usecase
    }

    get accessLevel() {
        return this.props.accessLevel
    }

    public equals(entity: Permission): boolean {
        if (
            this.subdomain.equals(entity.subdomain) &&
            this.usecase.equals(entity.usecase) &&
            this.accessLevel === entity.accessLevel
        ) {
            return true
        }

        return false
    }

    static create(props: PermissionProps) {
        const permission = new Permission(this.validate(props))
        return permission
    }

    static validate(props: PermissionProps) {
        return props
    }
}
