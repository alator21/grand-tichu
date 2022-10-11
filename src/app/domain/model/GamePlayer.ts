export class GamePlayer {
	private readonly _gameId: string;
	private readonly _playerId: string;
	private readonly _teamId: string;


	constructor(gameId: string, playerId: string, teamId: string) {
		this._gameId = gameId;
		this._playerId = playerId;
		this._teamId = teamId;
	}


	get gameId(): string {
		return this._gameId;
	}

	get playerId(): string {
		return this._playerId;
	}

	get teamId(): string {
		return this._teamId;
	}
}
