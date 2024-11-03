import { Either, left, right } from '@/shared/errors/contracts/either'
import { Role } from '../../../enterprise/entities/role'
import { RoleDAO } from '../../DAO/role-dao'
import { ResourceNotFoundError } from '@/shared/errors/use-case-errors/resource-not-found-error'

type DeleteRoleInput = {
    name: string
}

type DeleteRoleOutput = Either<Error, { role: Role }>

export class DeleteRoleUseCase {
    constructor(private roleRepository: RoleDAO) {}

    async execute({ name }: DeleteRoleInput): Promise<DeleteRoleOutput> {
        try {
            const roleFound = await this.roleRepository.findByName(
                name.toUpperCase(),
            )

            if (!roleFound) {
                throw new ResourceNotFoundError()
            }

            await this.roleRepository.delete(roleFound)

            return right({ role: roleFound })
        } catch (error) {
            if (error instanceof ResourceNotFoundError) {
                return left(error)
            }
            throw error
        }
    }
}
