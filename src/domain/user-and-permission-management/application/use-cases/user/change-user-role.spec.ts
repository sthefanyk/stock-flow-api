import { InMemoryUserRepository } from '@/infra/repositories/in-memory/user-and-permission-management/in-memory-user-repository'
import { ChangeUserRoleUseCase } from './change-user-role'
import { User } from '@/domain/user-and-permission-management/enterprise/entities/user'
import { makeUser } from '@/test/factories/user-and-permission-management/make-user'
import { UserDAO } from '../../DAO/user-dao'
import { TestContext } from 'vitest'
import { ResourceNotFoundError } from '@/shared/errors/use-case-errors/resource-not-found-error'
import { RoleDAO } from '../../DAO/role-dao'
import { InMemoryRoleRepository } from '@/infra/repositories/in-memory/user-and-permission-management/in-memory-role-repository'
import { makeRole } from '@/test/factories/user-and-permission-management/make-role'
import { Role } from '@/domain/user-and-permission-management/enterprise/entities/role'

interface TestContextWithSut extends TestContext {
    userRepository: UserDAO
    roleRepository: RoleDAO
    role: Role
    entity: User
    sut: ChangeUserRoleUseCase
}

describe('ChangeUserRole', () => {
    beforeEach(async (context: TestContextWithSut) => {
        context.userRepository = new InMemoryUserRepository()
        context.roleRepository = new InMemoryRoleRepository()

        context.sut = new ChangeUserRoleUseCase(
            context.userRepository,
            context.roleRepository,
        )

        context.entity = makeUser()
        context.role = makeRole()

        await context.userRepository.create(context.entity)
        await context.roleRepository.create(context.entity.role)
        await context.roleRepository.create(context.role)
    })

    it('should be able to change user role', async ({
        sut,
        userRepository,
        entity,
        role,
    }: TestContextWithSut) => {
        const result = await sut.execute({
            userID: entity.id.toString(),
            newRole: role.name,
        })

        expect(result.isRight()).toBe(true)
        const { user } = result.value as { user: User }
        expect(user.role).toBe(role)

        const items = await userRepository.listAll()
        expect(items[0].role).toBe(role)
    })

    it('should return a ResourceNotFoundError if the user is not found', async ({
        sut,
        role,
    }: TestContextWithSut) => {
        const result = await sut.execute({
            userID: 'unregistered',
            newRole: role.name,
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(ResourceNotFoundError)

        const { message } = result.value as ResourceNotFoundError
        expect(message).toBe('User not found')
    })

    it('should return a ResourceNotFoundError if the role is not found', async ({
        sut,
        entity,
    }: TestContextWithSut) => {
        const result = await sut.execute({
            userID: entity.id.toString(),
            newRole: 'unregistered',
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(ResourceNotFoundError)

        const { message } = result.value as ResourceNotFoundError
        expect(message).toBe('Role not found')
    })
})
