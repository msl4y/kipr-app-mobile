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
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TeamProvider } from '../../providers/team/team';

/**
 * Generated class for the TeamsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-teams',
  templateUrl: 'teams.html',
})
export class TeamsPage {

  teams: Object[] = [];
  search: String = "";
  page: number = 1;
  maxTeams: number = 1;
  maxPages: number = 1;
  constructor(public navParams: NavParams, public teamProvider: TeamProvider) {
    this.getTeams();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TeamsPage');
  }

  doInfinite(event) {
    setTimeout(() => {
      if(this.page < this.maxPages) {
        this.page++;
        this.getTeams();
      }else {
        event.enable(false);
      }
      event.complete();
    }, 500);
  }

  searchForTeams(event) {
    this.search = event.target.value;
    this.page = 1;
    this.teams = [];
    let is = document.getElementsByTagName("ion-infinite-scroll-content")[0];
    is.setAttribute('state', "enabled");
    this.getTeams();
  }

  async getTeams() {
    let response = await this.teamProvider.getAllTeams(this.search, this.page);
    this.teams = this.teams.concat(response.json().data);
    this.maxTeams = response.json().total;
    this.maxPages = response.json().last_page;
  }

}
