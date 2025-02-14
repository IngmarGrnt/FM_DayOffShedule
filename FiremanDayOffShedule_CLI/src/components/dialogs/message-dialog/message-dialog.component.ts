import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaterialModule } from '../../../material.module';

@Component({
  selector: 'app-message-dialog',
  standalone: true,
  templateUrl: './message-dialog.component.html',
  styleUrls: ['./message-dialog.component.css'],
  imports: [MaterialModule],
})
export class MessageDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<MessageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string }
  ) {}

  closeDialog(): void {
    this.dialogRef.close();
  }
}
