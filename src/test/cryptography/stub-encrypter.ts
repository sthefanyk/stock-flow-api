import { Encrypter } from '@/domain/user-and-permission-management/application/cryptography/encrypter'

export class StubEncrypter implements Encrypter {
    async encrypt(payload: Record<string, unknown>): Promise<string> {
        return JSON.stringify(payload)
    }
}
