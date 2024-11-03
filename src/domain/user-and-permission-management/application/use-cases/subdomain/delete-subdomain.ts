import { Either, left, right } from '@/shared/errors/contracts/either'
import { Subdomain } from '../../../enterprise/entities/subdomain'
import { SubdomainDAO } from '../../DAO/subdomain-dao'
import { ResourceNotFoundError } from '@/shared/errors/use-case-errors/resource-not-found-error'

type DeleteUseCaseInput = {
    name: string
}

type DeleteUseCaseOutput = Either<Error, { subdomain: Subdomain }>

export class DeleteUseCaseUseCase {
    constructor(private subdomainRepository: SubdomainDAO) {}

    async execute({ name }: DeleteUseCaseInput): Promise<DeleteUseCaseOutput> {
        try {
            const subdomainFound = await this.subdomainRepository.findByName(
                name.toLowerCase(),
            )

            if (!subdomainFound) {
                throw new ResourceNotFoundError()
            }

            await this.subdomainRepository.delete(subdomainFound)

            return right({ subdomain: subdomainFound })
        } catch (error) {
            if (error instanceof ResourceNotFoundError) {
                return left(error)
            }
            throw error
        }
    }
}
