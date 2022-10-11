export class Game {
	private readonly _id: string;
	private readonly _winningScore: number;


	constructor(id: string, winningScore: number) {
		this._id = id;
		this._winningScore = winningScore;
	}


	get id(): string {
		return this._id;
	}

	get winningScore(): number {
		return this._winningScore;
	}
}
