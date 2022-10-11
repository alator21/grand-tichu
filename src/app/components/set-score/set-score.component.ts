import {Component} from '@angular/core';
import {MatButtonToggle, MatButtonToggleChange, MatButtonToggleGroup,} from '@angular/material/button-toggle';
import {Router} from "@angular/router";
import {from} from "rxjs";
import {TeamPlayer} from "../../domain/view/index/TeamPlayer";
import {Team} from "../../domain/view/index/Team";
import {MatSelectChange} from "@angular/material/select";
import {AbstractControl, FormBuilder, FormGroup} from "@angular/forms";
import {PlayerTichu} from "../../domain/view/index/PlayerTichu";

@Component({
	selector: 'app-set-score',
	templateUrl: './set-score.component.html',
	styleUrls: ['./set-score.component.scss'],
})
export class SetScoreComponent {
	viewMethods = new SetScoreViewMethods(this.router);
	validPointsOptions: number[] = this.initializePoints();
	teams: Team[] | undefined = [new Team('1', 'team1'), new Team('2', 'team2')]
	teamPlayersByTeam: Map<string, [TeamPlayer, TeamPlayer]> | undefined = new Map<string, [TeamPlayer, TeamPlayer]>([
		["1", [
			new TeamPlayer('1', '1', 'raf1t1'),
			new TeamPlayer('1', '4', 'raf4t1')
		]],
		["2", [
			new TeamPlayer('2', '2', 'raf2t2'),
			new TeamPlayer('2', '3', 'raf3t2')
		]]
	]);
	scoreByTeam: Map<string, number> | undefined = new Map<string, number>([
		['1', 755],
		['2', 945]
	]);
	scoresForm: FormGroup | undefined = this.formBuilder.group({
		'1': [50],
		'2': [50],
		'finishedFirst': [this.viewMethods.allPlayers(this.teams!, this.teamPlayersByTeam!)[0]]
	});
	oneTwoForm: FormGroup | undefined = this.formBuilder.group({
		'oo': [[]]
	})
	playersTichu: Map<string, PlayerTichu> | undefined;

	constructor(private router: Router, private formBuilder: FormBuilder) {
		const inputData = this.router.getCurrentNavigation()?.extras.state;
		if (inputData === undefined) {
			this.redirectToMain();
			return;
		}
		this.playersTichu = inputData['playersTichu'];
		console.log(inputData);
	}

	private playersOfTeam(teamId: string, teamPlayersByTeam: Map<string, [TeamPlayer, TeamPlayer]>): [TeamPlayer, TeamPlayer] {
		const a: ([TeamPlayer, TeamPlayer] | undefined) = teamPlayersByTeam.get(teamId);
		if (a === undefined) {
			throw  new Error('');
		}
		return a;
	}

	private initializePoints(): number[] {
		const arr: number [] = [];
		const start = -25;
		const end = 125;
		for (let i = start; i <= end; i += 5) {
			arr.push(i);
		}
		return arr;
	}


	private redirectToMain(): void {
		from(this.router
			.navigate(['/']))
			.subscribe();
	}
}

class SetScoreViewMethods {
	constructor(private readonly router: Router) {
	}

	scoreOfTeam(
		teamId: string,
		scoreByTeam: Map<string/*teamId*/, number> | undefined,
		playersTichu: Map<string, PlayerTichu>,
		teamPlayersByTeam: Map<string, [TeamPlayer, TeamPlayer]>,
		scoresForm: FormGroup,
		oneTwoForm: FormGroup
	): number {
		if (scoreByTeam === undefined) {
			throw  new Error('');
		}
		const initialScore: number | undefined = scoreByTeam.get(teamId);
		if (initialScore === undefined) {
			throw new Error('');
		}
		console.log(oneTwoForm.value['oo']);
		const oneTwo: string[] = oneTwoForm.value['oo'];
		let team: string | undefined;
		if (oneTwo.length === 1) {
			team = oneTwo[0];
		}
		if (team != undefined) {

		}


		let currentTurnScore = scoresForm.value[teamId];
		const whoFinishedFirst: TeamPlayer = scoresForm.value['finishedFirst'];

		const teamPlayers = this.playersOfTeam(teamId, teamPlayersByTeam);
		for (const teamPlayer of teamPlayers) {
			const p: PlayerTichu | undefined = playersTichu.get(teamPlayer.playerId);
			if (p === undefined) {
				throw new Error('');
			}
			const playerFinishedFirst = whoFinishedFirst.playerId === teamPlayer.playerId;
			if (p.tichu) {
				if (playerFinishedFirst) {
					currentTurnScore += 100;
				} else {
					currentTurnScore -= 100;
				}
				continue;
			}
			if (p.grandTichu) {
				if (playerFinishedFirst) {
					currentTurnScore += 200;
				} else {
					currentTurnScore -= 200;
				}
			}
		}

		return initialScore + currentTurnScore;
	}

	playersOfTeam(teamId: string, teamPlayersByTeam: Map<string, [TeamPlayer, TeamPlayer]>): [TeamPlayer, TeamPlayer] {
		const a: ([TeamPlayer, TeamPlayer] | undefined) = teamPlayersByTeam.get(teamId);
		if (a === undefined) {
			throw  new Error('');
		}
		return a;
	}

	allPlayers(teams: Team[], teamPlayersByTeam: Map<string, [TeamPlayer, TeamPlayer]>): TeamPlayer[] {
		const players = [];
		for (const team of teams) {
			players.push(...this.playersOfTeam(team.id, teamPlayersByTeam))
		}
		return players;
	}

	toggleChange(event: MatButtonToggleChange, oneTwoForm: FormGroup) {
		const toggle: MatButtonToggle | undefined = event.source;
		if (toggle === undefined) {
			return;
		}
		const group: MatButtonToggleGroup = toggle.buttonToggleGroup;
		const values: string[] = group.value;
		if (values.length > 1) {
			// const playerId = group.name;
			group.value = [toggle.value]; // this is so the ui can only have one option highlighted
			oneTwoForm.value['oo'] = [toggle.value]; // this is for the actual form value
		}
	}

	setScore(): void {
		from(this.router
			.navigate(['/']))
			.subscribe()
	}

	pointsChanged(event: MatSelectChange, teams: Team[], scoresForm: FormGroup) {
		const teamId = event.source.ngControl.name;
		const newTeamScore = event.value;
		const updateOtherTeamScore = () => {
			for (const team of teams) {
				if (team.id === teamId) {
					continue;
				}
				const totalScore = 100;
				const otherTeamScore = totalScore - newTeamScore;
				const a: AbstractControl | null = scoresForm.get(team.id);
				if (a == null) {
					throw new Error('');
				}
				a.setValue(otherTeamScore);
			}
		};
		updateOtherTeamScore();
	}
}
