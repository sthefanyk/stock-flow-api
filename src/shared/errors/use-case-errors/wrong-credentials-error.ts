import { UseCaseError } from '../contracts/use-case-error'

export class WrogCredentialsError extends Error implements UseCaseError {
    constructor(readonly message = 'Credentials are not valid') {
        super(message)
    }
}
