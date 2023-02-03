/**
 * Author Services
 */
import { CreateAuthorData } from "../types"
import prisma from "../prisma"

/**
 * Get all authors
 */
export const getAuthors = async () => {
	return await prisma.author.findMany()
}

/**
 * Get a single author
 *
 * @param authorId The id of the author to get
 */
export const getAuthor = async (authorId: number) => {
	return await prisma.author.findUniqueOrThrow({
		where: {
			id: authorId,
		},
		include: {
			books: true
		}
	})

}

/**
 * Create an author
 *
 * @param data
 */
export const createAuthor = async (data: CreateAuthorData) => {
	return await prisma.author.create({
		data: {
			name: data.name,
		}
	})
}

