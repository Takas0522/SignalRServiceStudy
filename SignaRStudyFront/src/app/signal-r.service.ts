import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HubConnection } from '@aspnet/signalr';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SignalRConnectionInfo } from './signalr-connection-info.model';
import * as signalR from '@aspnet/signalr';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {

  private readonly http: HttpClient;
  private readonly baseUrl = 'http://localhost:7071/api/';
  private hubConnection: HubConnection;
  messages: BehaviorSubject<string> = new BehaviorSubject('');

  constructor(
    private httpClient: HttpClient
  ) {
    this.http = httpClient;
  }

  private getConnectionInfo(): Observable<SignalRConnectionInfo> {
    const requestUrl = `${this.baseUrl}negotiate`;
    return this.http.get<SignalRConnectionInfo>(requestUrl);
  }

  init() {
    this.getConnectionInfo().subscribe(info => {
        const options = {
            accessTokenFactory: () => info.accessToken
        };

        this.hubConnection = new signalR.HubConnectionBuilder()
            .withUrl(info.url, options)
            .configureLogging(signalR.LogLevel.Information)
            .build();

        this.hubConnection.start().catch(err => console.error(err.toString()));

        this.hubConnection.on('notify', (data: any) => {
            this.messages.next(data);
        });
    });
  }

  send(message: string): Observable<void> {
    const requestUrl = `${this.baseUrl}message`;
    return this.http.post(requestUrl, message).pipe(map((result: any) => { }));
  }

}
