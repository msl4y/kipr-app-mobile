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


import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { SettingsProvider } from '../providers/settings/settings';

import { CompetitionsPage } from '../pages/competitions/competitions';
import { CompetitionInfoPage } from '../pages/competitionInfo/competitionInfo';
import { HomePage } from '../pages/home/home';
import { JudgingPage } from '../pages/judging/judging'
import { MatchesPage } from '../pages/matches/matches';
import { SettingsPage } from '../pages/settings/settings';
import { SignInPage } from '../pages/signInGUI/signIn';
import { Events } from 'ionic-angular';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  pages: Array<{ title: string, component: any }>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public settings: SettingsProvider, public events: Events) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'Competitions', component: CompetitionsPage},
      { title: 'Matches', component: MatchesPage },
      { title: 'Settings', component: SettingsPage }
    ];

    this.maybeAddAuthenticatedPages();

    events.subscribe('authentication:judging', (enabled) => {
      if(enabled) {
        this.pages.push({ title: 'Judging', component: JudgingPage });
      }else {
        let index = this.pages.indexOf({ title: 'Judging', component: JudgingPage });
        if(index) {
          this.pages.splice(index, 1);
        }
      }
    });

    events.subscribe('authentication:signin', (enabled) => {
      if(enabled) {
        this.pages.push({ title: 'Team Sign In', component: SignInPage });
      }else {
        let index = this.pages.indexOf({ title: 'Team Sign In', component: SignInPage });
        if(index) {
          this.pages.splice(index, 1);
        }
      }
    })
  }

  async maybeAddAuthenticatedPages() {
    let signInToken = await this.settings.getSignInAuthToken();
    let judgingToken = await this.settings.getAuthToken();

    if(signInToken != null && signInToken != "") {
      this.pages.push({ title: 'Team Sign In', component: SignInPage });
    }

    if(judgingToken != null && judgingToken != "") {
      this.pages.push({ title: 'Judging', component: JudgingPage });
    }

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // App Startup

      this.settings.getFirstTimeUse().then(val => {
        if (val != 'TRUE') {
          this.firstTimeUse();
        }
        this.statusBar.styleDefault();
        this.splashScreen.hide();
      });

    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  checkForJudging(page?) {
    if(page != null){
      if(page.title != 'JudgingPage') {
        return true;
      }
    }

    if(this.judgingAuthenticated()) {
      return true;
    }

    return false;
  }

 judgingAuthenticated() {
   // some logic to check for authentication...
   //let token = this.settings.getAuthToken().then(val => {});
   //if(true){//check text? add judging page to menu
     this.pages.push({title: 'Judging', component: JudgingPage});
     console.log('Judge Authenticated');
     return true;
   //}
   //return false;
  }

  firstTimeUse() {
    console.log('First Time Use');
    this.settings.setDefaults();
  }
}
