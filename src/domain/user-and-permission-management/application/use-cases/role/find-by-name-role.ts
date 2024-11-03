import { Either, left, right } from '@/shared/errors/contracts/either'
import { Role } from '../../../enterprise/entities/role'
import { RoleDAO } from '../../DAO/role-dao'
import { ValidationError } from '@/shared/errors/entity-errors/validation-error'

type FindByNameRoleInput = {
    name: string
}

type FindByNameRoleOutput = Either<Error, { role: Role | null }>

export class FindByNameRoleUseCase {
    constructor(private roleRepository: RoleDAO) {}

    async execute({
        name,
    }: FindByNameRoleInput): Promise<FindByNameRoleOutput> {
        try {
            const roleFound = await this.roleRepository.findByName(
                name.toUpperCase(),
            )
            return right({ role: roleFound })
        } catch (error) {
            if (error instanceof ValidationError) {
                return left(error)
            }
            throw error
        }
    }
}
