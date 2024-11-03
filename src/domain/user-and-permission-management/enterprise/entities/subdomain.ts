import { Entity } from '@/shared/entities/entity'

interface SubdomainProps {
    name: string
    description: string
}

export class Subdomain extends Entity<SubdomainProps> {}
