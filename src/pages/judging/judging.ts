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
import { Slides } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { ViewChild } from '@angular/core';
import { MatchesPage } from '../matches/matches';
import { RemoteServiceProvider } from '../../providers/remote-service/remote-service';
import { SocketProvider } from '../../providers/socket/socket';
import { Observable } from 'rxjs/Observable';

/**
 * Generated class for the JudgingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-judging',
  templateUrl: 'judging.html',
})

export class JudgingPage {

  @ViewChild(Slides) slides: Slides;

  rules: Array<{value:number,min:number, max:number, title:string, description:string, img:string}>;
  teamName: string;
  match: {title:string, teamA:string, teamB:string};
  opponent: string;
  judgedOpponent: boolean;
  jsonRules = [];
  jsonEvents = [];
  waiting: boolean = true;

  constructor(private alertCtrl:AlertController,private remoteService:RemoteServiceProvider,public navCtrl: NavController, public navParams: NavParams, public socket: SocketProvider) {
    this.rules=[];
    socket.connect();
    console.log(socket);
    this.match = {title: "", teamA: "", teamB: ""};

    this.getMatch().subscribe((channel) => {
      let data = (event as MessageEvent).data;
      data = JSON.parse(data.slice(data.indexOf(`"match"`) -1, data.length - 1));
      this.match.teamA = data.match.team_a.name;
      this.match.teamB = data.match.team_b.name;
      this.teamName = data.match.team_a.name;
      this.opponent = data.match.team_b.name;
      if(data.match.competition.ruleset) {
        this.jsonRules = data.match.competition.ruleset.rules;
        this.jsonEvents = data.match.competition.ruleset.events;
        console.log(this.jsonRules);
        console.log(this.jsonEvents);
        let aRules = [];
        let bRules = [];
        this.jsonEvents.forEach((rule) => {
          aRules.push({
            value: <number> rule.min,
            min: <number> rule.min,
            max: <number> rule.max,
            title: <string> rule.title,
            description: <string> rule.description,
            img: <string> rule.imgA
          });
          bRules.push({
            value: <number> rule.min,
            min: <number> rule.min,
            max: <number> rule.max,
            title: <string> rule.title,
            description: <string> rule.description,
            img: <string> rule.imgB
          });
        });
        this.rules = aRules.concat(bRules);
        this.waiting = false;
      }
    });
  }

  getMatch() {
    let observable = new Observable(observer => {
      this.socket.on('KIPR\\Events\\MatchSentToTable', (channel) => {
        observer.next(channel);
      });
    })
    return observable;
  }

  slideChanged() {
    let currentIndex = this.slides.getActiveIndex();
    console.log('Current index is', currentIndex);
  }

  increment(i){
    let item = this.rules[i];
    if(item.value < item.max){
      item.value = Number(item.value) + 1;
    }
  }

  decrement(i){
    let item = this.rules[i];
    if(item.value > item.min){
      item.value = Number(item.value) - 1;
    }
  }

  dq(){
    let alert = this.alertCtrl.create({
      title: 'Confirm DQ',
      message: 'Are you sure this team is disqualified?',
      buttons:[
        {
          text:'No',
          role:'cancel',
          handler: () => {
            console.log('No Score Canceled');
          }
        },
        {
          text:'Yes',
          handler: () => {
            for(var _i; _i < this.rules.length; _i++){
                this.rules[_i].value = 0;
            }

            let length = this.slides.length();
            this.slides.slideTo(length);
            console.log('No Score Confirmed');
          }
        }
      ]
    });
    alert.present();
  }

  noScore(){
    let alert = this.alertCtrl.create({
      title: 'Confirm No Score',
      message: 'Are you sure this team scored no points?',
      buttons:[
        {
          text:'No',
          role:'cancel',
          handler: () => {
            console.log('No Score Canceled');
          }
        },
        {
          text:'Yes',
          handler: () => {
            for(var _i; _i < this.rules.length; _i++){
                this.rules[_i].value = 0;
            }

            let length = this.slides.length();
            this.slides.slideTo(length);
            console.log('No Score Confirmed');
          }
        }
      ]
    });
    alert.present();
  }

  nextClicked(name,match){
    //need to send score to JSON before judging next team
    //push to self
    this.navCtrl.push(JudgingPage,
      {
        name: name,
        match: match,
        judgedOpponent: true
      }
    );
  }

  matches(){
    //need to send score to JSON before leaving page

    this.navCtrl.setRoot(MatchesPage);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad JudgingPage');
  }

}
