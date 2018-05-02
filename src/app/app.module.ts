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
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { Network } from '@ionic-native/network';

import { MyApp } from './app.component';
import { CompetitionsPage } from '../pages/competitions/competitions';
import { CompetitionInfoPage } from '../pages/competitionInfo/competitionInfo';
import { HomePage } from '../pages/home/home';
import { JudgingPage } from '../pages/judging/judging';
import { MatchesPage } from '../pages/matches/matches';
import { SettingsPage } from '../pages/settings/settings';
import { SignInPage } from '../pages/signInGUI/signIn';
import { TeamsPage } from '../pages/teams/teams';
import { TeamSignInPickerPage } from '../pages/team-sign-in-picker/team-sign-in-picker';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { OpenNativeSettings } from '@ionic-native/open-native-settings';
import { RemoteServiceProvider } from '../providers/remote-service/remote-service';
import { SettingsProvider } from '../providers/settings/settings';
import { CompetitionProvider } from '../providers/competition/competition';
import { StatusProvider } from '../providers/status/status';
import { TeamProvider } from '../providers/team/team';
import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
import { SocketProvider } from '../providers/socket/socket';
import { MatchProvider } from '../providers/match/match';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    CompetitionsPage,
    CompetitionInfoPage,
    JudgingPage,
    MatchesPage,
    SettingsPage,
    SignInPage,
    TeamsPage,
    TeamSignInPickerPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    CompetitionsPage,
    CompetitionInfoPage,
    HomePage,
    JudgingPage,
    MatchesPage,
    SettingsPage,
    SignInPage,
    TeamsPage,
    TeamSignInPickerPage
  ],
  providers: [
    StatusBar,
    Network,
    SplashScreen,
    OpenNativeSettings,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    BarcodeScanner,
    RemoteServiceProvider,
    SettingsProvider,
    CompetitionProvider,
    StatusProvider,
    TeamProvider,
    SocketProvider,
    MatchProvider
  ]
})
export class AppModule {}
