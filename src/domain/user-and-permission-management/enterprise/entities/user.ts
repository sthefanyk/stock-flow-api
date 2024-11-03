import { Entity } from '@/shared/entities/entity'
import { Role } from './role'

interface UserProps {
    name: string
    email: string
    password: string
    role: Role
}

export class User extends Entity<UserProps> {}
