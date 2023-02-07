import { User } from "@prisma/client";
import { JwtPayload } from './../../types.d'

declare global {
	namespace Express {
		export interface Request {
			user: JwtPayload,
		}
	}
}
