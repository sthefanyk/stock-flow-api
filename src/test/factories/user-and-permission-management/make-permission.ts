import { Permission } from '@/domain/user-and-permission-management/enterprise/entities/permission'
import { makeSubdomain } from './make-subdomain'
import { makeUseCase } from './make-usecase'
import { AccessLevel } from '@/domain/user-and-permission-management/enterprise/enums/access-level'
import { CreatePermissionInput } from '@/domain/user-and-permission-management/application/use-cases/permission/create-permission'

export function makePermission(
    override: Partial<CreatePermissionInput> = {},
): Permission {
    const subdomain = makeSubdomain({ name: override.subdomain ?? 'subdomain' })
    const usecase = makeUseCase({ name: override.usecase ?? 'usecase' })

    const permission = Permission.create({
        subdomain,
        usecase,
        accessLevel: AccessLevel.CREATE,
    })

    return permission
}
