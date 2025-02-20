import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MessageDialogComponent } from '../../components/dialogs/message-dialog/message-dialog.component';


@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(private dialog: MatDialog) {}

  openDialog(message: string): void {
    this.dialog.open(MessageDialogComponent, {
      width: '400px',
      data: { message },
    });
  }
}
