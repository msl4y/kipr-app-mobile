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
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';

/*
  Generated class for the SettingsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SettingsProvider {

  constructor(public http: Http, public storage: Storage) {
    console.log("Starting Settings Provider");
  }

  async getServerName() {
    return await this.storage.get('settings:server_name');
  }

  async getFirstTimeUse() {
    return await this.storage.get('settings:first_time_use');
  }

  async getAuthToken() {
    return await this.storage.get('auth:token');
  }


  async getSignInCompetitionID(){
    return await this.storage.get('signInAuth:competitionID');
  }
  //get the competitionID and return 1 for testing purposes


  async getSignInAuthToken(){
    return await this.storage.get('signInAuth:token');
  }

  //get the competitionID and return 1 for testing purposes


  setDefaults() {
    console.log("Setting Default Values");
    // TODO: Defaults Object
    this.setServerName('https://kipr.ryanowens.info');
    this.setFirstTimeUse('TRUE');
    this.setAuthToken('');
  }

  setFirstTimeUse(val) {
    this.storage.set('settings:first_time_use', val);
  }

  setServerName(name) {
    this.storage.set('settings:server_name', name);
  }

  setAuthToken(token) {
    this.storage.set('auth:token', token);
  }

  setSignInAuthToken(token){
    this.storage.set('signInAuth:token', token);
  }

  setSignInCompetitionID(id){
    this.storage.set('signInAuth:competitionID', id);
  }

  setJudgingCompetitionID(id) {
    this.storage.set('judgingAuth:competitionID', id);
  }
}
