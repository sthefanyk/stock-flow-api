import { Either, left, right } from '@/shared/errors/contracts/either'
import { Permission } from '../../../enterprise/entities/permission'
import { PermissionDAO } from '../../DAO/permission-dao'
import { ValidationError } from '@/shared/errors/entity-errors/validation-error'

// type ListAllPermissionInput = null

type ListAllPermissionOutput = Either<Error, { permissions: Permission[] }>

export class ListAllPermissionUseCase {
    constructor(private permissionRepository: PermissionDAO) {}

    async execute(): Promise<ListAllPermissionOutput> {
        try {
            const permissions = await this.permissionRepository.listAll()

            return right({ permissions })
        } catch (error) {
            if (error instanceof ValidationError) {
                return left(error)
            }
            throw error
        }
    }
}
