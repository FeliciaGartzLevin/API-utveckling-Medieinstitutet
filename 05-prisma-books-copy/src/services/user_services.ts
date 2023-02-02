
/*
**User Service
*/

import prisma from "../prisma"

/**
 *  Get user by email
 *
 * @param email
 * @returns
 */
export const getUserByEmail = async (email: string) => {
	return await prisma.user.findUnique({ // vill INTE använda findUniqueOrThrow eftersom vi inte vill få ett fel, utan den ska vara unique.
		where: {
			email: email, //kan skrivas bara 'email' när key och value är samma
		}
	})
}
