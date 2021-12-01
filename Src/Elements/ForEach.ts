import type { Arrays as ObservedArrays } from "../Data/Observed"


export function ForEach<T>(data: T[] | ObservedArrays<T>): <U>(callback: (data: T, index: number) => U) => U[] {
	return callback => data.map((v, i) => callback(v, i))
}