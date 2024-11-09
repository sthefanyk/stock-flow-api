import { Subdomain } from '../../enterprise/entities/subdomain'

export abstract class SubdomainDAO {
    abstract create(entity: Subdomain): Promise<void>
    abstract save(entity: Subdomain): Promise<void>
    abstract delete(entity: Subdomain): Promise<void>
    abstract findByName(name: string): Promise<Subdomain | null>
    abstract listAll(): Promise<Subdomain[]>
}
