import { EnvironmentColors } from './EnvironmentColors';


export class EnvironmentsValueClass extends EnvironmentColors { }

/**
 * @experemental
 *
 * @example
 * // from extends
 * declare module 'EnvironmentsValues' {
 *		interface EnvironmentsValueClass {
 *			name: value
 *		}
 * }
 *
 * Object.defineProperty(EnvironmentsValue, 'name', {
 *		...
 * });
 */
export const EnvironmentsValues = new EnvironmentsValueClass


export type EnvironmentsList = Parameters<typeof EnvironmentsValues['safeChangeValue']>[0]

