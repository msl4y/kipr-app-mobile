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
import { AlertController } from 'ionic-angular';
import { TeamProvider } from '../../providers/team/team';
import { SettingsProvider } from '../../providers/settings/settings';
import { CompetitionProvider } from '../../providers/competition/competition';

@IonicPage()
@Component({
  selector: 'page-competitionInfo',
  templateUrl: 'competitionInfo.html'
})

export class CompetitionInfoPage {

  teams: Object[];
  teamName: string;
  page: number;
  maxPages: number;
  competition: {
    created_at: Date,
    end_date: Date,
    id: number,
    location: String,
    name: String,
    ruleset_id: number,
    start_date: Date,
    updated_at: Date
  };
  competitionID: number;
  teamTotal: number;
  private displayNoResults: Boolean;
  private loading: Boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController,
    private TeamPrvdr: TeamProvider, private settingsPrvdr: SettingsProvider, private compPrvdr: CompetitionProvider) {
    // console.log(navParams);
    this.competition = navParams.get('competition');
    this.competitionID = this.competition.id;
    this.page = 1;
    this.teams = [];
    this.getTeamList();
    this.teamTotal = 0;
  }

  async getTeamList() {
    this.teamName = await this.compPrvdr.getRegisteredTeamsInComp(this.competitionID, this.page);
    this.compPrvdr.getRegisteredTeamsInComp(this.competitionID).then(val => {
      this.teams = this.teams.concat(val.data);
      this.maxPages = val.last_page;
      this.teamTotal = val.total;
      if (this.teams.length <= 0) {
        this.displayNoResults = true;
      }
      this.loading = false;
    }).catch(err => { console.error(err); });
  }

  doInfinite(event) {
    setTimeout(() => {
      if(this.page < this.maxPages) {
        this.page++;
        this.getTeamList();
      }else {
        event.enable(false);
      }
      event.complete();
    }, 500);

  }
}
