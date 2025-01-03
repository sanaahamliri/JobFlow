import { ApolloServer } from 'apollo-server-micro'
import { PrismaClient } from '@prisma/client'
import { gql } from 'apollo-server-micro'

const prisma = new PrismaClient()

const typeDefs = gql`
  type Job {
    id: ID!
    title: String!
    company: String!
    location: String!
    type: JobType!
    description: String!
  }

  enum JobType {
    FULL_TIME
    PART_TIME
    CONTRACT
    INTERNSHIP
  }

  type Query {
    jobs(page: Int, search: String, type: JobType): JobsResponse!
    job(id: ID!): Job
  }

  type JobsResponse {
    jobs: [Job!]!
    totalPages: Int!
    currentPage: Int!
  }

  type Mutation {
    applyForJob(jobId: ID!): Application!
  }

  type Application {
    id: ID!
    job: Job!
    status: ApplicationStatus!
  }

  enum ApplicationStatus {
    PENDING
    ACCEPTED
    REJECTED
  }
`

const resolvers = {
  Query: {
    jobs: async (_, { page = 1, search = '', type }) => {
      const where = {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { company: { contains: search, mode: 'insensitive' } },
          { location: { contains: search, mode: 'insensitive' } },
        ],
        ...(type && { type }),
      }

      const size = 10
      const skip = (page - 1) * size

      const [jobs, totalCount] = await Promise.all([
        prisma.job.findMany({
          where,
          skip,
          take: size,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.job.count({ where }),
      ])

      return {
        jobs,
        totalPages: Math.ceil(totalCount / size),
        currentPage: page,
      }
    },
    job: (_, { id }) => prisma.job.findUnique({ where: { id } }),
  },
  Mutation: {
    applyForJob: async (_, { jobId }, { user }) => {
      if (!user) {
        throw new Error('You must be logged in to apply for a job')
      }

      return prisma.application.create({
        data: {
          userId: user.id,
          jobId,
        },
      })
    },
  },
}

const apolloServer = new ApolloServer({ typeDefs, resolvers })

export const config = {
  api: {
    bodyParser: false,
  },
}

export default apolloServer.createHandler({ path: '/api/graphql' })

