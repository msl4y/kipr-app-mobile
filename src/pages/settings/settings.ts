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
import { StatusProvider } from '../../providers/status/status';
import { IonicPage } from 'ionic-angular';//, NavController, NavParams
import { SettingsProvider } from '../../providers/settings/settings';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';//, BarcodeScannerOptions
import { Events } from 'ionic-angular';

/**
 * Generated class for the JudgingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  serverName: String = '';
  judgingAuthToken: String = '';
  signInAuthToken: String = '';
  judgingEnabled: boolean = false;
  signInEnabled: boolean = false;

constructor(private settingsProvider: SettingsProvider, private status: StatusProvider, private barcodeScanner: BarcodeScanner, private alertCtrl: AlertController, public events: Events){
    this.getSettings();
  }

  async getSettings() {
    this.serverName = await this.settingsProvider.getServerName();
    this.judgingAuthToken = await this.settingsProvider.getAuthToken();
    this.signInAuthToken = await this.settingsProvider.getSignInAuthToken();

    if(this.judgingAuthToken == '' || this.judgingAuthToken == null) {
      this.judgingEnabled = false;
    }else {
      this.judgingEnabled = true;
    }
    console.log("Judging Enabled", this.judgingEnabled);
    if(this.signInAuthToken == '' || this.signInAuthToken == null) {
      this.signInEnabled = false;
    }else {
      this.signInEnabled = true;
    }
    console.log("SignIn Enabled", this.signInEnabled);
  }


disableSignIn() {
  this.signInEnabled = false;
  this.settingsProvider.setAuthToken(null);
  this.settingsProvider.setSignInCompetitionID(null);
  this.judgingAuthToken = "";
  this.events.publish('authentication:signin', false);
}

disableJudging() {
  this.judgingEnabled = false;
  this.settingsProvider.setSignInAuthToken(null);
  this.judgingAuthToken = "";
  this.events.publish('authentication:judging', false);
}

async scanForAuthToken(){
  this.barcodeScanner.scan().then(async (barcodeData) => {
    console.log(barcodeData.text);
    let valid = this.status.validateJudgingAuthToken(barcodeData.text, this.serverName);
    let splitArray = barcodeData.text.split("|");

    if(valid) {
      this.judgingAuthToken = splitArray[0];
      this.settingsProvider.setAuthToken(splitArray[0]);
      this.settingsProvider.setJudgingCompetitionID(splitArray[1]);
      this.judgingEnabled = true;
      this.events.publish('authentication:judging', true);
    }else {
      this.judgingAuthToken = '';
      this.judgingEnabled = false;
      this.settingsProvider.setAuthToken('');
      let alert = this.alertCtrl.create({
        title: 'Authorization Error',
        subTitle: 'Unable to authenticate with the server. Please try again.',
        buttons: ['OK']
      });
      alert.present();
    }
  }, (err) => {
    let alert = this.alertCtrl.create({
      title: 'Authorization Error',
      subTitle: 'Unable to read the QR code. Please try again.',
      buttons: ['OK']
    });
    alert.present();
    console.log(err);
    this.judgingEnabled = false;
    this.events.publish('authentication:judging', false);
  });
}

async scanForSignInAuthToken(){
  this.barcodeScanner.scan().then(async (barcodeData) => {
    console.log(barcodeData.text);
    let valid = this.status.validateSignInAuthToken(barcodeData.text, this.serverName);
    let splitArray = barcodeData.text.split("|");

    if(valid) {
      this.signInAuthToken = splitArray[0];
      this.settingsProvider.setSignInAuthToken(splitArray[0]);
      this.settingsProvider.setSignInCompetitionID(splitArray[1]);
      this.signInEnabled = true;
      this.events.publish('authentication:signin', true);
    }else {
      this.signInAuthToken = '';
      this.signInEnabled = false;
      this.settingsProvider.setSignInAuthToken('');
      this.settingsProvider.setSignInCompetitionID('');
      let alert = this.alertCtrl.create({
        title: 'Authorization Error',
        subTitle: 'Unable to authenticate with the server. Please try again.',
        buttons: ['OK']
      });
      alert.present();
    }
  }, (err) => {
    let alert = this.alertCtrl.create({
      title: 'Authorization Error',
      subTitle: 'Unable to read the QR code. Please try again.',
      buttons: ['OK']
    });
    alert.present();
    console.log(err);
    this.signInEnabled = false;
    this.events.publish('authentication:signin', false);
  });
}
  ionViewDidLoad() {
    console.log('Loaded');
  }
}
