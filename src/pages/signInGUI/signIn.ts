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
import { IonicPage,NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { TeamProvider } from '../../providers/team/team';
import { SettingsProvider } from '../../providers/settings/settings';
import { ModalController } from 'ionic-angular';
import { TeamSignInPickerPage } from '../team-sign-in-picker/team-sign-in-picker';


@IonicPage()
@Component({
  selector: 'page-signIn',
  templateUrl: 'signIn.html'
})

export class SignInPage {

teams: Object[];
teamName: string;
competitionID: number;
private displayNoResults: Boolean;
private loading: Boolean = true;

//get list of teams in competition
constructor(public navCtrl: NavController, public navParams:NavParams,
  private TeamPrvdr: TeamProvider, private settingsPrvdr: SettingsProvider, public modalCtrl: ModalController){
    this.getTeamsSignedin();
}

async getTeamsSignedin()
{
  this.competitionID = await this.settingsPrvdr.getSignInCompetitionID();
  if(this.competitionID == null) {
    this.teams = [];
    this.loading = false;
    return;
  }
  this.TeamPrvdr.getRegisteredTeamsInComp(this.competitionID).then(val => {
    const map = new Map();
    val.forEach((team) => {
      const key = team.name;
      const collection = map.get(key);
      if(!collection){
        map.set(key, [team]);
      }
    else {
        collection.push(team);
      }
    });

    this.teams = Array.from(map);
    console.log(this.teams);
    if (this.teams.length <= 0) {
      this.displayNoResults = true;
    }
    this.loading = false;
  }).catch(err => {console.error(err);});
}

displayTeamChooser(group) {
  let modal = this.modalCtrl.create(TeamSignInPickerPage, {
    group: group,
    teams: this.teams,
    compID: this.competitionID
  });
  modal.present();
}




ionViewDidLoad() {
    console.log('ionViewDidLoad SignInPage');
  }
}
