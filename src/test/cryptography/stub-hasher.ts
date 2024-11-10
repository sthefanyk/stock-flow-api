import { HashComparer } from '@/domain/user-and-permission-management/application/cryptography/hash-comparer'
import { HashGenerator } from '@/domain/user-and-permission-management/application/cryptography/hash-generator'

export class StubHasher implements HashGenerator, HashComparer {
    async hash(plain: string): Promise<string> {
        return plain.concat('-hashed')
    }

    async compare(plain: string, hash: string): Promise<boolean> {
        return plain.concat('-hashed') === hash
    }
}
