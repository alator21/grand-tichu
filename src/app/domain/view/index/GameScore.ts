export class GameScore {
	private readonly _scoreByTeam: Map<string/*teamId*/, number>;


	constructor(scoreByTeam: Map<string, number>) {
		this._scoreByTeam = scoreByTeam;
	}


	get scoreByTeam(): Map<string, number> {
		return this._scoreByTeam;
	}
}
