import { EnvironmentsList, EnvironmentsValues } from '.';





export class EnvironmentSnapshots extends Map<EnvironmentsList, any> {

	protected parent?: EnvironmentSnapshots

	public override get<P extends EnvironmentsList>(key: P): typeof EnvironmentsValues[P] {
		if (this.has(key)) return this.get(key);
		if (this.parent) return this.parent.get(key);

		return EnvironmentsValues[key]
	}


	public createSnapshots(): () => void {
		this.parent = EnvironmentsValues.environmentSnapshots instanceof EnvironmentSnapshots ? EnvironmentsValues.environmentSnapshots : undefined;
		let cancelEnvStorage: ((() => void) | void)[] = [];
		this.forEach((value, key) => cancelEnvStorage.push(EnvironmentsValues.safeChangeValue(key, value)))

		EnvironmentsValues.environmentSnapshots = this;

		return () => { EnvironmentsValues.environmentSnapshots = this.parent; for (let item of cancelEnvStorage) item?.() }
	}
}

export interface EnvironmentSnapshots extends Map<EnvironmentsList, any> {
	set<P extends EnvironmentsList>(key: P, value: NonNullable<typeof EnvironmentsValues[P]>): this
}