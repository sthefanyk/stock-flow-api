import { Subdomain } from '../../enterprise/entities/subdomain'

export interface SubdomainDAO {
    create(entity: Subdomain): Promise<void>
    save(entity: Subdomain): Promise<void>
    delete(entity: Subdomain): Promise<void>
    findByName(name: string): Promise<Subdomain | null>
    listAll(): Promise<Subdomain[]>
}
