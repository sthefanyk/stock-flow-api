import { Either, left, right } from '@/shared/errors/contracts/either'
import { Role } from '../../../enterprise/entities/role'
import { RoleDAO } from '../../DAO/role-dao'
import { ValidationError } from '@/shared/errors/entity-errors/validation-error'
import { Injectable } from '@nestjs/common'

// type ListAllRoleInput = null

type ListAllRoleOutput = Either<Error, { roles: Role[] }>

@Injectable()
export class ListAllRoleUseCase {
    constructor(private roleRepository: RoleDAO) {}

    async execute(): Promise<ListAllRoleOutput> {
        try {
            const roles = await this.roleRepository.listAll()

            return right({ roles })
        } catch (error) {
            if (error instanceof ValidationError) {
                return left(error)
            }
            throw error
        }
    }
}
