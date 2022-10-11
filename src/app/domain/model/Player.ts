export class Player {
	private readonly _id: string;
	private _name: string;


	constructor(id: string, name: string) {
		this._id = id;
		this._name = name;
	}


	get id(): string {
		return this._id;
	}

	get name(): string {
		return this._name;
	}

	changeName(name: string): void {
		this._name = name;
	}
}
