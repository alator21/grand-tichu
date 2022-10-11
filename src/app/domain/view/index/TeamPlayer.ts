export class TeamPlayer {
	private readonly _teamId: string;
	private readonly _playerId: string;
	private readonly _playerName: string;


	constructor(teamId: string, playerId: string, playerName: string) {
		this._teamId = teamId;
		this._playerId = playerId;
		this._playerName = playerName;
	}


	get teamId(): string {
		return this._teamId;
	}

	get playerId(): string {
		return this._playerId;
	}

	get playerName(): string {
		return this._playerName;
	}
}
