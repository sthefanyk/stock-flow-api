import { faker } from '@faker-js/faker'
import {
    Subdomain,
    SubdomainProps,
} from '@/domain/user-and-permission-management/enterprise/entities/subdomain'

export function makeSubdomain(
    override: Partial<SubdomainProps> = {},
): Subdomain {
    const subdomain = Subdomain.create({
        name: faker.word.noun(),
        description: faker.lorem.sentences(),
        ...override,
    })

    return subdomain
}
