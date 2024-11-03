import { Either, left, right } from '@/shared/errors/contracts/either'
import { Subdomain } from '../../../enterprise/entities/subdomain'
import { SubdomainDAO } from '../../DAO/subdomain-dao'
import { ValidationError } from '@/shared/errors/entity-errors/validation-error'

// type ListAllSubdomainInput = null

type ListAllSubdomainOutput = Either<Error, { subdomains: Subdomain[] }>

export class ListAllUseCaseUseCase {
    constructor(private subdomainRepository: SubdomainDAO) {}

    async execute(): Promise<ListAllSubdomainOutput> {
        try {
            const subdomains = await this.subdomainRepository.listAll()

            return right({ subdomains })
        } catch (error) {
            if (error instanceof ValidationError) {
                return left(error)
            }
            throw error
        }
    }
}
