import * as fs from 'fs'
import * as path from 'path'

const outputPath = path.join(__dirname, 'schema.prisma')

const schemaFiles = [
    path.join(__dirname, 'base_schema.prisma'),
    path.join(__dirname, 'schemas', 'user.prisma'),
    path.join(__dirname, 'schemas', 'action_log.prisma'),
]

function mergeSchemas() {
    let mergedSchema = ''

    schemaFiles.forEach((file) => {
        const schema = fs.readFileSync(file, 'utf-8')
        mergedSchema += schema + '\n'
    })

    fs.writeFileSync(outputPath, mergedSchema)
    console.log('Schemas concatenados em prisma/schema.prisma')
}

mergeSchemas()
