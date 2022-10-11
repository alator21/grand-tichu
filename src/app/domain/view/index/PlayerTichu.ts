export class PlayerTichu {
	private readonly _playerId: string;
	private readonly _tichu: boolean;
	private readonly _grandTichu: boolean;

	constructor(playerId: string, tichu: boolean, grandTichu: boolean) {
		this._playerId = playerId;
		this._tichu = tichu;
		this._grandTichu = grandTichu;
	}

	get playerId(): string {
		return this._playerId;
	}

	get tichu(): boolean {
		return this._tichu;
	}

	get grandTichu(): boolean {
		return this._grandTichu;
	}
}
