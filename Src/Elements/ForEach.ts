import type { Observed } from "../Data/Observed"


export function ForEach<T>(data: T[] | Observed.Arrays<T>): <U>(callback: (data: T, index: number) => U) => U[] {
	return callback => data.map((v, i) => callback(v, i))
}