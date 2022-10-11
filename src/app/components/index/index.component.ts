import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatButtonToggle, MatButtonToggleChange, MatButtonToggleGroup} from "@angular/material/button-toggle";
import {from, fromEvent, Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";
import {MatDialog} from "@angular/material/dialog";
import {ChangePlayerDialogComponent} from "./change-player-dialog/change-player-dialog.component";
import {TeamPlayer} from "../../domain/view/index/TeamPlayer";
import {Team} from "../../domain/view/index/Team";
import {Router} from "@angular/router";
import {PlayerTichu} from "../../domain/view/index/PlayerTichu";
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
	selector: 'app-index',
	templateUrl: './index.component.html',
	styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit, OnDestroy {
	private readonly browserHistorySubject: Subject<void>;

	teams: Team[] = [new Team('1', 'team1'), new Team('2', 'team2')]
	scoreByTeam: Map<string/*teamId*/, number> = new Map<string, number>([
		['1', 755],
		['2', 945]
	]);
	teamPlayersByTeam: Map<string, [TeamPlayer, TeamPlayer]> = new Map<string, [TeamPlayer, TeamPlayer]>([
		["1", [
			new TeamPlayer('1', '1', 'raf1t1'),
			new TeamPlayer('1', '4', 'raf4t1')
		]],
		["2", [
			new TeamPlayer('2', '2', 'raf2t2'),
			new TeamPlayer('2', '3', 'raf3t2')
		]]
	]);

	playerWhoDeals: string = '1';

	tichuForm: FormGroup = this.formBuilder.group({
		'1': [[]],
		'2': [[]],
		'3': [[]],
		'4': [[]]
	});


	// TODO truncate player names
	constructor(
		private dialog: MatDialog,
		private router: Router,
		private formBuilder: FormBuilder
	) {
		this.browserHistorySubject = new Subject<void>();
	}

	ngOnInit(): void {
		this.removeBackButtonFunctionality();
	}

	ngOnDestroy(): void {
		this.browserHistorySubject.next();
		this.browserHistorySubject.complete();
	}

	openDialog(): void {
		const dialogRef = this.dialog.open(ChangePlayerDialogComponent, {
			data: {},
			restoreFocus: false
		});
	}

	toggleChange(event: MatButtonToggleChange) {
		const toggle: MatButtonToggle | undefined = event.source;
		if (toggle === undefined) {
			return;
		}
		const group: MatButtonToggleGroup = toggle.buttonToggleGroup;
		const values: string[] = group.value;
		if (values.length > 1) {
			const playerId = group.name;
			group.value = [toggle.value]; // this is so the ui can only have one option highlighted
			this.tichuForm.value[playerId] = [toggle.value]; // this is for the actual form value
		}
	}


	setScore(): void {
		const values = this.tichuForm.value;
		const playersTichu = new Map();
		for (const [_, players] of this.teamPlayersByTeam) {
			for (const player of players) {
				const playerValues: string[] = values[player.playerId];
				if (playerValues.length === 0) {
					playersTichu.set(player.playerId, new PlayerTichu(player.playerId, false, false));
					continue;
				}
				if (playerValues.length === 1) {
					const value = playerValues[0];
					if (value === 't') {
						playersTichu.set(player.playerId, new PlayerTichu(player.playerId, true, false));
						continue;
					}
					if (value === 'g') {
						playersTichu.set(player.playerId, new PlayerTichu(player.playerId, false, true));
						continue;
					}
				}
			}
		}
		from(this.router
			.navigate(['set-score'], {
				state: {
					playersTichu
				}
			})
		)
			.subscribe();
	}

	private removeBackButtonFunctionality(): void {
		history.pushState(null, '');
		fromEvent(window, 'popstate').pipe(
			takeUntil(this.browserHistorySubject)
		).subscribe((_) => {
			history.pushState(null, '');
		});
	}

	viewMethods = new IndexViewMethods();
}

class IndexViewMethods {
	scoreOfTeam(teamId: string, scoreByTeam: Map<string, number>): number {
		const score: number | undefined = scoreByTeam.get(teamId);
		if (score === undefined) {
			throw  new Error('');
		}
		return score;
	}

	allPlayers(teams: Team[], teamPlayersByTeam: Map<string, [TeamPlayer, TeamPlayer]>): TeamPlayer[] {
		const players = [];
		for (const team of teams!) {
			players.push(...this.playersOfTeam(team.id, teamPlayersByTeam))
		}
		return players;
	}

	private playersOfTeam(teamId: string, teamPlayersByTeam: Map<string, [TeamPlayer, TeamPlayer]>): [TeamPlayer, TeamPlayer] {
		const a: ([TeamPlayer, TeamPlayer] | undefined) = teamPlayersByTeam.get(teamId);
		if (a === undefined) {
			throw  new Error('');
		}
		return a;
	}
}
