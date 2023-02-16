import mongoose, { model, Schema, Document } from "mongoose";

export interface IMovie extends Document{ //=ärver egenskaper från sina föräldrar
	title: string,
	runtime?: number,
	releaseYear?: number,
}

const MovieSchema: Schema = new Schema<IMovie>({
	title: {type: String, required: true},
	runtime: Number, //behöver ej skriva hela objektet på raden ovan då required: false =default
	releaseYear: Number,
})

export const Movie = model<IMovie>('Movie', MovieSchema)


