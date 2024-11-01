import { PrismaClient } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import 'dotenv/config'
import { URL } from 'url'
import { execSync } from 'node:child_process'

const prisma = new PrismaClient()

function generateUniqueDatabaseUrl(schemaId: string) {
    if (!process.env.DATABASE_URL) {
        throw new Error('Please provide a DATABASE_URL environment variable.')
    }

    const url = new URL(process.env.DATABASE_URL)
    url.searchParams.set('schema', schemaId)

    return url.toString()
}

const schemaID = randomUUID()

beforeAll(async () => {
    const databaseURL = generateUniqueDatabaseUrl(schemaID)

    process.env.DATABASE_URL = databaseURL

    execSync('npm run prisma:deploy')
})

afterAll(async () => {
    await prisma.$executeRawUnsafe(
        `DROP SCHEMA IF EXISTS "${schemaID}" CASCADE`,
    )

    await prisma.$disconnect()
})
