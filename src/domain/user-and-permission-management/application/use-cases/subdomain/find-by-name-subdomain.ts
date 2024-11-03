import { Either, left, right } from '@/shared/errors/contracts/either'
import { Subdomain } from '../../../enterprise/entities/subdomain'
import { SubdomainDAO } from '../../DAO/subdomain-dao'
import { ValidationError } from '@/shared/errors/entity-errors/validation-error'

type FindByNameSubdomainInput = {
    name: string
}

type FindByNameSubdomainOutput = Either<Error, { subdomain: Subdomain | null }>

export class FindByNameSubdomainUseCase {
    constructor(private subdomainRepository: SubdomainDAO) {}

    async execute({
        name,
    }: FindByNameSubdomainInput): Promise<FindByNameSubdomainOutput> {
        try {
            const subdomainFound = await this.subdomainRepository.findByName(
                name.toLowerCase(),
            )
            return right({ subdomain: subdomainFound })
        } catch (error) {
            if (error instanceof ValidationError) {
                return left(error)
            }
            throw error
        }
    }
}
