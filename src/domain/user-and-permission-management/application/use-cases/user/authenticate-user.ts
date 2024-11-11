import { Either, left, right } from '@/shared/errors/contracts/either'
import { UserDAO } from '../../DAO/user-dao'
import { HashComparer } from '../../cryptography/hash-comparer'
import { Encrypter } from '../../cryptography/encrypter'
import { WrogCredentialsError } from '@/shared/errors/use-case-errors/wrong-credentials-error'
import { Injectable } from '@nestjs/common'

type AutheticateUserInput = {
    email: string
    password: string
}

type AutheticateUserOutput = Either<
    WrogCredentialsError,
    { accessToken: string }
>

@Injectable()
export class AutheticateUserUseCase {
    constructor(
        private userRepository: UserDAO,
        private hashComparer: HashComparer,
        private encrypter: Encrypter,
    ) {}

    async execute({
        email,
        password,
    }: AutheticateUserInput): Promise<AutheticateUserOutput> {
        try {
            const userFound = await this.userRepository.findByEmail(
                email.toLowerCase(),
            )

            if (!userFound) {
                throw new WrogCredentialsError()
            }

            const isPasswordValid = await this.hashComparer.compare(
                password,
                userFound.password,
            )

            if (!isPasswordValid) {
                throw new WrogCredentialsError()
            }

            const accessToken = await this.encrypter.encrypt({
                sub: userFound.id.toString(),
            })

            return right({ accessToken })
        } catch (error) {
            if (error instanceof WrogCredentialsError) {
                return left(error)
            }
            throw error
        }
    }
}
