import { InMemoryUserRepository } from '@/infra/repositories/in-memory/user-and-permission-management/in-memory-user-repository'
import { CreateUserUseCase } from './create-user'
import { ValidationError } from '@/shared/errors/entity-errors/validation-error'
import { ResourcesAlreadyExistError } from '@/shared/errors/use-case-errors/resources-already-exist-error'
import { User } from '@/domain/user-and-permission-management/enterprise/entities/user'
import { makeUser } from '@/test/factories/user-and-permission-management/make-user'
import { InMemoryRoleRepository } from '@/infra/repositories/in-memory/user-and-permission-management/in-memory-role-repository'
import { UserDAO } from '../../DAO/user-dao'
import { RoleDAO } from '../../DAO/role-dao'
import { TestContext } from 'vitest'
import { ResourceNotFoundError } from '@/shared/errors/use-case-errors/resource-not-found-error'

interface TestContextWithSut extends TestContext {
    userRepository: UserDAO
    roleRepository: RoleDAO
    entity: User
    sut: CreateUserUseCase
}

describe('Create user', () => {
    beforeEach(async (context: TestContextWithSut) => {
        context.userRepository = new InMemoryUserRepository()
        context.roleRepository = new InMemoryRoleRepository()

        context.sut = new CreateUserUseCase(
            context.userRepository,
            context.roleRepository,
        )

        context.entity = makeUser()

        await context.roleRepository.create(context.entity.role)
    })

    it('should be able to create user', async ({
        sut,
        userRepository,
        entity,
    }: TestContextWithSut) => {
        const result = await sut.execute({
            name: entity.name,
            email: entity.email,
            password: entity.password,
            role: entity.role.name,
        })

        expect(result.isRight()).toBe(true)
        const { user } = result.value as { user: User }
        expect(user.id).toBeTruthy()

        const items = await userRepository.listAll()
        expect(items).toHaveLength(1)
        expect(items[0].email).toBe(entity.email)
    })

    it('should return a ValidationError if name be empty', async ({
        sut,
        userRepository,
        entity,
    }: TestContextWithSut) => {
        const result = await sut.execute({
            name: '',
            email: entity.email,
            password: entity.password,
            role: entity.role.name,
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(ValidationError)

        const { message } = result.value as ValidationError
        expect(message).toBe('The name cannot be empty.')

        const items = await userRepository.listAll()
        expect(items).toHaveLength(0)
    })

    it('should return a ResourcesAlreadyExistError if user email already exists', async ({
        sut,
        userRepository,
        entity,
    }: TestContextWithSut) => {
        await userRepository.create(makeUser({ email: 'johndoe.example.com' }))

        const user = makeUser({
            email: 'johndoe.example.com',
            role: entity.role,
        })

        const result = await sut.execute({
            name: user.name,
            email: user.email,
            password: user.password,
            role: user.role.name,
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(ResourcesAlreadyExistError)

        const { message } = result.value as ResourcesAlreadyExistError
        expect(message).toBe('This email already exists')

        const items = await userRepository.listAll()
        expect(items).toHaveLength(1)
    })

    it('should return a ResourceNotFoundError if the role is not found', async ({
        sut,
        entity,
        userRepository,
    }: TestContextWithSut) => {
        const result = await sut.execute({
            name: entity.name,
            email: entity.email,
            password: entity.password,
            role: 'unregistered',
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(ResourceNotFoundError)

        const { message } = result.value as ResourceNotFoundError
        expect(message).toBe('Role not found')

        const items = await userRepository.listAll()
        expect(items).length(0)
    })
})
