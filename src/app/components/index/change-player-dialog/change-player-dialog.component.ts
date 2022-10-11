import {Component, Inject, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatButtonToggleChange} from "@angular/material/button-toggle";
import {ActivatedRoute} from "@angular/router";
import {tap} from "rxjs/operators";

@Component({
	selector: 'dialog-overview-example-dialog',
	templateUrl: 'change-player-dialog.component.html',
	styleUrls: ['change-player-dialog.component.scss']
})
export class ChangePlayerDialogComponent {
	players: string[] = ['Raf', 'Really long name13123', 'Rouf'];

	constructor(
		public dialogRef: MatDialogRef<ChangePlayerDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
	) {
	}

	onNoClick(): void {
		this.dialogRef.close();
	}

	pickPlayer(event: MatButtonToggleChange) {
		const value = event.value;
		console.log(value);
		this.dialogRef.close({
			player: value
		})
	}


}
