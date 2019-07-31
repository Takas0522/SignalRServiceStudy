import { Component, OnInit } from '@angular/core';
import { SignalRService } from './signal-r.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private readonly signalRService: SignalRService;
  private readonly snackBar: MatSnackBar;
  message: string;

  constructor(signalR: SignalRService, snack: MatSnackBar) {
    this.signalRService = signalR;
    this.snackBar = snack;
  }

  ngOnInit() {
    this.signalRService.init();
    this.signalRService.messages.subscribe(message => {
      console.log(message)
      this.snackBar.open(message);
    });
  }

  send() {
    this.signalRService.send(this.message).subscribe(() => {});
  }
}
