import { InMemoryUserRepository } from '@/test/repositories/in-memory/user-and-permission-management/in-memory-user-repository'
import { AutheticateUserUseCase } from './authenticate-user'
import { User } from '@/domain/user-and-permission-management/enterprise/entities/user'
import { makeUser } from '@/test/factories/user-and-permission-management/make-user'
import { UserDAO } from '../../DAO/user-dao'
import { TestContext } from 'vitest'
import { HashGenerator } from '../../cryptography/hash-generator'
import { StubHasher } from '@/test/cryptography/stub-hasher'
import { Encrypter } from '../../cryptography/encrypter'
import { StubEncrypter } from '@/test/cryptography/stub-encrypter'
import { HashComparer } from '../../cryptography/hash-comparer'
import { WrogCredentialsError } from '@/shared/errors/use-case-errors/wrong-credentials-error'

interface TestContextWithSut extends TestContext {
    userRepository: UserDAO
    hasher: HashGenerator & HashComparer
    encrypter: Encrypter
    entity: User
    sut: AutheticateUserUseCase
}

describe('AutheticateUser', () => {
    beforeEach(async (context: TestContextWithSut) => {
        context.userRepository = new InMemoryUserRepository()
        context.hasher = new StubHasher()
        context.encrypter = new StubEncrypter()

        context.sut = new AutheticateUserUseCase(
            context.userRepository,
            context.hasher,
            context.encrypter,
        )

        context.entity = makeUser({
            password: await context.hasher.hash('123456'),
        })

        await context.userRepository.create(context.entity)
    })

    it('should be able to authenticate a user', async ({
        sut,
        entity,
    }: TestContextWithSut) => {
        const result = await sut.execute({
            email: entity.email,
            password: '123456',
        })

        expect(result.isRight()).toBe(true)
        expect(result.value).toEqual({
            accessToken: expect.any(String),
        })
    })

    it('should return a WrogCredentialsError if the user email is not found', async ({
        sut,
    }: TestContextWithSut) => {
        const result = await sut.execute({
            email: 'unregistered',
            password: '123456',
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(WrogCredentialsError)

        const { message } = result.value as WrogCredentialsError
        expect(message).toBe('Credentials are not valid')
    })

    it('should return a WrogCredentialsError if the user password is invalid', async ({
        sut,
        entity,
    }: TestContextWithSut) => {
        const result = await sut.execute({
            email: entity.email,
            password: 'invalid',
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(WrogCredentialsError)

        const { message } = result.value as WrogCredentialsError
        expect(message).toBe('Credentials are not valid')
    })
})
