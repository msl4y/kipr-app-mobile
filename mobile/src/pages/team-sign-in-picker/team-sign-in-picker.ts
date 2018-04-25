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
import { AlertController } from 'ionic-angular';
import { TeamProvider } from '../../providers/team/team';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the TeamSignInPickerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-team-sign-in-picker',
  templateUrl: 'team-sign-in-picker.html',
})
export class TeamSignInPickerPage {

  competitionID: number;
  teams: Object[];
  group: Object;
  constructor(public params: NavParams, private TeamPrvdr: TeamProvider, private alertCtrl: AlertController, public viewCtrl: ViewController) {
    this.teams = params.get('teams');
    this.group = params.get('group');
    this.competitionID = params.get('compID');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TeamSignInPickerPage');
  }

  //sign team in to be added to competition bracket
  teamSignIn(team) {
    this.TeamPrvdr.getTeamSignIn(team.id, this.competitionID).then(() => {
      let alert = this.alertCtrl.create({
        title: 'Confirmation',
        subTitle: `Team ${team.code} is signed in!`,
        buttons: [
          {
            text: 'Ok',
            handler: (getTeamSignIn) => {
              this.teams.splice(this.teams.indexOf(team), 1);
              this.group[1].splice(this.group[1].indexOf(team), 1);
              console.log('Sign in confirmed');
              if(this.group[1].length <= 0) {
                this.viewCtrl.dismiss();
              }
            }
          },
          {
            text: 'Cancel',
            handler: () => {
              this.cancelSignIn(team);
              console.log('Canceled');
                this.viewCtrl.dismiss();
            }
          }
        ]
      });
      alert.present();

    }).catch((error) => { console.error(error); });
  }

  async cancelSignIn(team) {
    await this.TeamPrvdr.unRegisterATeam(team.id, this.competitionID);
  }

}
