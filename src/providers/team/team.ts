// Copyright (c) 2018 KISS Institute for Practical Robotics
//
// BSD v3 License
//
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
// * Redistributions of source code must retain the above copyright notice, this
//   list of conditions and the following disclaimer.
//
// * Redistributions in binary form must reproduce the above copyright notice,
//   this list of conditions and the following disclaimer in the documentation
//   and/or other materials provided with the distribution.
//
// * Neither the name of KIPR Scoring App nor the names of its
//   contributors may be used to endorse or promote products derived from
//   this software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
// DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
// FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
// DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
// SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
// CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
// OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { SettingsProvider } from '../settings/settings';

/*
  Generated class for the TeamProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class TeamProvider {

  constructor(public http: Http, public settings: SettingsProvider) {
    console.log('Hello TeamProvider Provider');
  }
//sign team into competition with their assigned teamID and compID
  async getTeamSignIn(teamID, compID) {
    let serverName = await this.settings.getServerName();
    if (serverName == null) {
      serverName = 'https://kipr.ryanowens.info'; // TODO: set default value
    }
    let headers = new Headers();
    let token = await this.settings.getSignInAuthToken();
    headers.append('Authorization', 'Bearer ' + token);
    return this.http.post(serverName + "/api/competition/" + compID + " /team/" + teamID + "/signin", '', {headers : headers})
      .map(res => res.json().data)
      .toPromise();
  }
//list all teams in a competition
  async getRegisteredTeamsInComp(compID, page = 1){
    let serverName = await this.settings.getServerName();
    if (serverName == null) {
      serverName = 'https://kipr.ryanowens.info'; // TODO: set default value
    }
    return this.http.get(serverName + "/api/competition/" + compID + "/team?signed_in=0&page=" + page)
    .map(res => res.json())
    .toPromise();
  }

  async unRegisterATeam(teamID, compID) {
    let serverName = await this.settings.getServerName();
    if (serverName == null) {
      serverName = 'https://kipr.ryanowens.info'; // TODO: set default value
    }
    let headers = new Headers();
    let token = await this.settings.getSignInAuthToken();
    headers.append('Authorization', 'Bearer ' + token);
    let url = serverName + "/api/competition/" + compID + "/team/" + teamID + "/signin";
    return await this.http.delete(url,  {headers : headers})
      .map(res => res.json().data)
      .toPromise();
  }

  async getAllTeams(search, page = 1) {
    let serverName = await this.settings.getServerName();
    if (serverName == null) {
      serverName = 'https://kipr.ryanowens.info'; // TODO: set default value
    }
    let url = serverName + "/api/team?page=" + page;
    url = (search != "")? url + "&name=" + search : url;
    return await this.http.get(url)
                     .toPromise();
  }
}
