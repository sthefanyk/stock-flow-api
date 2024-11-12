import { config } from 'dotenv'

import { PrismaClient } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import 'dotenv/config'
import { URL } from 'url'
import { execSync } from 'node:child_process'
import Redis from 'ioredis'
import { envSchema } from '@/infra/env/env'
import { DomainEvents } from '@/shared/events/domain-events'

config({ path: '.env', override: true })
config({ path: '.env.test', override: true })

const env = envSchema.parse(process.env)

const prisma = new PrismaClient()
const redis = new Redis({
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
    db: env.REDIS_DB,
})

function generateUniqueDatabaseUrl(schemaId: string) {
    if (!env.DATABASE_URL) {
        throw new Error('Please provide a DATABASE_URL environment variable.')
    }

    const url = new URL(env.DATABASE_URL)

    url.searchParams.set('schema', schemaId)

    return url.toString()
}

const schemaID = randomUUID()

beforeAll(async () => {
    const databaseURL = generateUniqueDatabaseUrl(schemaID)

    process.env.DATABASE_URL = databaseURL

    DomainEvents.shouldRun = false

    await redis.flushdb()

    execSync('npm run prisma:deploy')
})

afterAll(async () => {
    await prisma.$executeRawUnsafe(
        `DROP SCHEMA IF EXISTS "${schemaID}" CASCADE`,
    )

    await prisma.$disconnect()
})
