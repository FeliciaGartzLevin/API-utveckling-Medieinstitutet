import mongoose, { model, Schema, Document } from "mongoose";

export interface IMovie extends Document{ //=ärver egenskaper från sina föräldrar
	title: string,
	runtime?: number,
	releaseYear?: number,
}

const MovieSchema: Schema = new Schema<IMovie>({
	title: {
		type: String,
		required: true,
		trim: true,
		minlength: 3,
		unique: true,
	},
	runtime: {
		type: Number,
		min: 1,
	},
	releaseYear: {
		type: Number,
		min: 1888,
		max: new Date().getFullYear(),
	},
})

export const Movie = model<IMovie>('Movie', MovieSchema)


