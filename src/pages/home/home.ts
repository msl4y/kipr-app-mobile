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
import { Platform } from 'ionic-angular';
import { Component } from '@angular/core';
import { Network } from '@ionic-native/network';
import { AlertController } from 'ionic-angular';
import { Subscription } from 'rxjs/Subscription';
import { OpenNativeSettings } from '@ionic-native/open-native-settings';
import { CompetitionProvider } from '../../providers/competition/competition';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SettingsPage } from '../settings/settings';
import { CompetitionsPage } from '../competitions/competitions';
import { TeamsPage } from '../teams/teams';
import { MatchesPage } from '../matches/matches';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  private competitions: Array<Object> = [];
  private apiError: Boolean = false;
  private displayNoResults: Boolean;
  private noNetwork: Boolean = false;
  private connected: Subscription;
  private disconnected: Subscription;
  private alert: any = null;
  private loading: Boolean = true;

  hpbuttons: Array<{title: string, link: any}>;

  constructor(private competitionProvider: CompetitionProvider, private network: Network, private platform: Platform,
    private alertCtrl: AlertController, private openNativeSettings: OpenNativeSettings, public navCtrl: NavController) {
    this.hpbuttons = [
      // {title: 'Judging Sign In', link: SettingsPage},
      {title: "Competitions", link: CompetitionsPage},
      {title: 'Tournament Bracket', link: CompetitionsPage},
      {title: 'Competition Documents', link: SettingsPage},
      {title: 'Matches', link: MatchesPage},
      {title: 'Table Times', link: SettingsPage},
      {title: 'Teams', link: TeamsPage}
    ];

    this.noNetwork = !this.hasNetwork();
    if (!this.noNetwork) {
      this.getData();
    }
    this.loading = false;
  }

  buttonSelected(page){
    this.navCtrl.push(page.link);
  }

  ionViewDidEnter() {
    this.connected = this.network.onConnect().subscribe(data => {
      console.log(data);
      this.noNetwork = false;
      if (this.alert != null) {
        this.alert.dismiss();
        this.alert = null;
        this.getData();
      }
    }, error => {
      console.error(error);
    });

    this.disconnected = this.network.onDisconnect().subscribe(data => {
      console.log(data);
      this.noNetwork = true;
      this.loading = false;
      if (this.alert == null) {
        this.alert = this.alertCtrl.create({
          title: "Network Disconnected",
          subTitle: "You are offline, please connect to continue.",
          buttons: [{
            text: 'Open Network Settings',
            handler: () => {
              this.openNativeSettings.open('wifi');
            }
          }]
        });
        this.alert.present();
      }
    }, error => {
      console.error(error);
    });
  }

  ionViewWillLeave() {
    this.connected.unsubscribe();
    this.disconnected.unsubscribe();
  }

  private getData() {
    // TODO Clean up
    this.competitionProvider.getCompetitions().then(val => {
      this.competitions = val;
      if (this.competitions.length <= 0) {
        this.displayNoResults = true;
      }
      this.loading = false;
    }).catch(err => {
      console.error(err);
      this.apiError = true;
      this.alert = this.alertCtrl.create({
        title: 'Network Error',
        message: 'If you are connected to a local network, please enter the local server address.',
        inputs: [
          {
            name: 'address',
            placeholder: 'http://127.0.0.1'
          }
        ],
        buttons: [
          {
            text: 'Cancel',
            handler: () => {
              console.log('Canceled Address enter');
            }
          }, {
            text: 'Submit',
            handler: () => {

          }
            }
        ]
      });
    this.alert.present();
  });
}

  private hasNetwork() {
  let type = this.network.type;
  return this.platform.is('core') || type == "ethernet" || type == "wifi" || type == "2g" || type == "3g" || type == "4g" || type == "cellular";
}

  private isMobile() {
  return this.platform.is('cordova') || this.platform.is('android') ||
    this.platform.is('ios') || this.platform.is('mobile') ||
    this.platform.is('mobile') || this.platform.is('phablet') ||
    this.platform.is('tablet');
}

}
