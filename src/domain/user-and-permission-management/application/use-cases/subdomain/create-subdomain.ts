import { Either, left, right } from '@/shared/errors/contracts/either'
import { Subdomain } from '../../../enterprise/entities/subdomain'
import { SubdomainDAO } from '../../DAO/subdomain-dao'
import { ResourcesAlreadyExistError } from '@/shared/errors/use-case-errors/resources-already-exist-error'
import { ValidationError } from '@/shared/errors/entity-errors/validation-error'

type CreateSubdomainInput = {
    name: string
    description?: string
}

type CreateSubdomainOutput = Either<Error, { subdomain: Subdomain }>

export class CreateSubdomainUseCase {
    constructor(private subdomainRepository: SubdomainDAO) {}

    async execute({
        name,
        description,
    }: CreateSubdomainInput): Promise<CreateSubdomainOutput> {
        try {
            const subdomainExists = await this.subdomainRepository.findByName(
                name.toLowerCase(),
            )

            if (subdomainExists) {
                throw new ResourcesAlreadyExistError()
            }

            const subdomain = Subdomain.create({
                name,
                description,
            })

            await this.subdomainRepository.create(subdomain)

            return right({ subdomain })
        } catch (error) {
            if (
                error instanceof ResourcesAlreadyExistError ||
                error instanceof ValidationError
            ) {
                return left(error)
            }
            throw error
        }
    }
}
