import { Either, left, right } from '@/shared/errors/contracts/either'
import { Role } from '../../../enterprise/entities/role'
import { RoleDAO } from '../../DAO/role-dao'
import { ResourcesAlreadyExistError } from '@/shared/errors/use-case-errors/resources-already-exist-error'
import { ValidationError } from '@/shared/errors/entity-errors/validation-error'

type CreateRoleInput = {
    name: string
}

type CreateRoleOutput = Either<Error, { role: Role }>

export class CreateRoleUseCase {
    constructor(private roleRepository: RoleDAO) {}

    async execute({ name }: CreateRoleInput): Promise<CreateRoleOutput> {
        try {
            const roleExists = await this.roleRepository.findByName(
                name.toUpperCase(),
            )

            if (roleExists) {
                throw new ResourcesAlreadyExistError()
            }

            const role = Role.create({
                name,
            })

            await this.roleRepository.create(role)

            return right({ role })
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
