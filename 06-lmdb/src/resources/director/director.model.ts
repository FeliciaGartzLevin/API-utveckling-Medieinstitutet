import mongoose, { model, Schema, Document } from "mongoose";

export interface IDirector extends Document{ //extends=ärver egenskaper från sina föräldrar
	name: string,
	country: string,
	birthdate?: Date,
}

const DirectorSchema: Schema = new Schema<IDirector>({
	name: {
		type: String,
		required: true,
		trim: true,
		minlength: 5,
		unique: true,
	},

	birthdate: {
		type: Date,
		trim: true,
	},


})

export const Director = model<IDirector>('Director', DirectorSchema)


