// .d. = description
// datatyper skapas med Pascal case  (stor bokstav i början) är rekommenderat

export type CreateAuthorData = {
	name: string,
}

export type CreateBookData = {
	title: string,
	pages: number,
	isbn: string,
	cover?: {
		thumbnail: string,
		large: string,
	},
	publisherId: number,
}

export type CreateUserData = {
	name: string,
	email: string,
	password: string,
}

export type JwtPayload = {
	sub: number,
	name: string,
	iat?: number,
	exp?: number,
}
