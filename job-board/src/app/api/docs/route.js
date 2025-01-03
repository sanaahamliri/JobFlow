import { NextResponse } from 'next/server'
import swaggerJsdoc from 'swagger-jsdoc'

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Job Board API',
      version: '1.0.0',
      description: 'API documentation for the Job Board application',
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
      },
    ],
  },
  apis: ['./src/app/api/**/*.ts'],
}

const swaggerSpec = swaggerJsdoc(options)

export async function GET() {
  return NextResponse.json(swaggerSpec)
}

