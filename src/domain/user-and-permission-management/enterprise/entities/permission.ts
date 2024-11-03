import { Entity } from '@/shared/entities/entity'
import { AccessLevel } from '../enums/access-level'
import { Subdomain } from './subdomain'
import { UseCase } from './usecase'

interface PermissionProps {
    subdomain: Subdomain
    usecase: UseCase
    accessLevel: AccessLevel
}

export class Permission extends Entity<PermissionProps> {}
