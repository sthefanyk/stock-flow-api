import { UseCaseError } from '../contracts/use-case-error'

export class NotAllowedError extends Error implements UseCaseError {
    constructor(readonly message = 'Not Allowed') {
        super(message)
    }
}
