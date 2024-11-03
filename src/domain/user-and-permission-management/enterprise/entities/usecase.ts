import { Entity } from '@/shared/entities/entity'

interface UseCaseProps {
    name: string
    description: string
}

export class UseCase extends Entity<UseCaseProps> {}
