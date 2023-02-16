import mongoose, { model, Schema, Document } from "mongoose";
import { IDirector } from "../director/director.model";

export interface IMovie extends Document{ //=ärver egenskaper från sina föräldrar
	title: string,
	runtime: number | null,
	releaseYear?: number,
	genres: string[],
	watched?: Date,
	director?: IDirector['_id'],
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
		default: null,
		// min: 1,
		validate(value: number){
			// if-satser kan skrivas så också
			if(value < 1 && value !== null){ //if satsen kan göras utan curly brackets
				throw new Error("Just because you thought the movie was bad it shouldn't have a zero or negative runtime.")
			}
		}

	},
	releaseYear: {
		type: Number,
		min: 1888,
		max: new Date().getFullYear(),
	},
	genres: {
		type: [String],
		lowercase: true,
		default: [],
		// enum: ['sci-fi', 'romance', 'comedy']
	},
	watched: {
		type: Date,
		default() { //en funktion eftersom den annars anger tiden när servern senast startades.
			return Date.now()
		},
	},
	director: {
		type: Schema.Types.ObjectId,
		ref: 'Director',
	},
})

export const Movie = model<IMovie>('Movie', MovieSchema)


