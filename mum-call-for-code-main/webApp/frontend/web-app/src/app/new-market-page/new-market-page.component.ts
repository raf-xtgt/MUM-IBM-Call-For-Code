import { Component, OnInit, ViewChild} from '@angular/core';
import { ConfigService } from '../config.service';
import { ConfigServiceV2 } from '../configV2';
import { BuyEnergyRequest } from '../classes';
import {Router} from '@angular/router';
import { SendDataService } from '../send-data.service';
import { JWTService } from '../userAuth.service';
import {map, Subscription, timer} from 'rxjs';  
import Swal from 'sweetalert2'


// imports required for the pagination
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import {  energyRequests } from '../classes';

@Component({
  selector: 'app-new-market-page',
  templateUrl: './new-market-page.component.html',
  styleUrls: ['./new-market-page.component.css']
})
export class NewMarketPageComponent implements OnInit {

  constructor(private _configV2:ConfigServiceV2, private _config:ConfigService, private router: Router, private reqData: SendDataService, private _jwtServ:JWTService) { }

  
  public allOpenBuyRequests:Array<BuyEnergyRequest>=[];
  public allClosedBuyRequests:Array<BuyEnergyRequest>=[];
  public noOpenBuyRequests: boolean = true;
  public noClosedBuyRequests: boolean = true;
  private requestForBid :BuyEnergyRequest = new BuyEnergyRequest("", 0, 0, false, "","") // this will hold the buy energy request data on which the prosumer makes a bid

  public buyerId: string = ""
  public message: string = "";
  private _loggedInUserId : string = "" //id of the user that is logged in
  public timerSubscription: Subscription|any; 


  // for the pagination of closed buy requests
  closedRequestDisplayedCols: string[] = ['reqId', 'energy', 'price', 'type' ]
  closesRequestDataSource = new MatTableDataSource<energyRequests>(allClosedRequests)
    // add the paginator
    @ViewChild(MatPaginator) closedReqPaginator: MatPaginator | any




  async ngOnInit(): Promise<void> {

    // timer(0, 10000) call the function immediately and every 10 seconds 
    this.timerSubscription = timer(1800*1000).pipe( 
      map(async () => { 
        console.log("This is run every 10s now")
        await this._configV2.getCMData().subscribe(async data => {
          let responseCMData = JSON.parse(JSON.stringify(data))
          console.log("CM Data", responseCMData)
         
          // await this._configV2.runCM(responseCMData.Data).subscribe(async data=> {
          //   let responseCM = JSON.parse(JSON.stringify(data))
          //   console.log("Response after running cm", responseCM)
          let bdata = [
            {
             "Index": 0,
             "Data": [
              {
               "UserID": "",
               "Money": 0,
               "Energy": 0,
               "Price": 0
              }
             ],
             "Hash": "20fdf64da3cd2c78ec3c033d2ac628bacf701711fa99435ee37bef0304800dc5",
             "PrevHash": "Genesis",
             "TNBMoney": 0,
             "TNBEnergy": 0,
             "LeaderID": ""
            },
            {
             "Index": 1,
             "Data": [
              {
               "UserID": "",
               "Money": 1.28,
               "Energy": -3.37,
               "Price": 0.38
              },
              {
               "UserID": "",
               "Money": 6.36,
               "Energy": -21.93,
               "Price": 0.29
              },
              {
               "UserID": "",
               "Money": -10.12,
               "Energy": 25.29,
               "Price": 0.4
              },
              {
               "UserID": "",
               "Money": -9.64,
               "Energy": 23.52,
               "Price": 0.41
              },
              {
               "UserID": "",
               "Money": 2.98,
               "Energy": -8.29,
               "Price": 0.36
              },
              {
               "UserID": "",
               "Money": 1.72,
               "Energy": -5.56,
               "Price": 0.31
              },
              {
               "UserID": "",
               "Money": 2.8,
               "Energy": -9.65,
               "Price": 0.29
              }
             ],
             "Hash": "fc2aa4de560cc42da79ea259a07c73d822c6998971f5d7bf6c2c2777be1ed406",
             "PrevHash": "20fdf64da3cd2c78ec3c033d2ac628bacf701711fa99435ee37bef0304800dc5",
             "TNBMoney": 4.62,
             "TNBEnergy": -0.01,
             "LeaderID": ""
            },
            {
             "Index": 2,
             "Data": [
              {
               "UserID": "SH StRXhNFWZkX0ZcKACzSt",
               "Money": -5254.39,
               "Energy": 39.017120480537415,
               "Price": 0
              },
              {
               "UserID": "SH nebqhYpyQu1GZ49eSqAm",
               "Money": -7542.9,
               "Energy": 70.6356235742569,
               "Price": 0
              }
             ],
             "Hash": "ade4f02574f138696daff3bdd3de84181651aa045401513ec744859927b2fdc9",
             "PrevHash": "91b4d142823f7d20c5f08df69122de43f35f057a988d9619f6d3138485c9a203",
             "TNBMoney": 12797.29,
             "TNBEnergy": -109.65,
             "LeaderID": ""
            },
            {
             "Index": 3,
             "Data": [
              {
               "UserID": "SH StRXhNFWZkX0ZcKACzSt",
               "Money": -5254.39,
               "Energy": 39.017120480537415,
               "Price": 0
              },
              {
               "UserID": "SH nebqhYpyQu1GZ49eSqAm",
               "Money": -7542.9,
               "Energy": 70.6356235742569,
               "Price": 0
              }
             ],
             "Hash": "ade4f02574f138696daff3bdd3de84181651aa045401513ec744859927b2fdc9",
             "PrevHash": "91b4d142823f7d20c5f08df69122de43f35f057a988d9619f6d3138485c9a203",
             "TNBMoney": 12797.29,
             "TNBEnergy": -109.65,
             "LeaderID": ""
            },
            {
             "Index": 1,
             "Data": [
              {
               "UserID": "SH StRXhNFWZkX0ZcKACzSt",
               "Money": -5254.39,
               "Energy": 39.017120480537415,
               "Price": 0
              },
              {
               "UserID": "SH nebqhYpyQu1GZ49eSqAm",
               "Money": -7542.9,
               "Energy": 70.6356235742569,
               "Price": 0
              }
             ],
             "Hash": "ade4f02574f138696daff3bdd3de84181651aa045401513ec744859927b2fdc9",
             "PrevHash": "91b4d142823f7d20c5f08df69122de43f35f057a988d9619f6d3138485c9a203",
             "TNBMoney": 12797.29,
             "TNBEnergy": -109.65,
             "LeaderID": ""
            },
            {
             "Index": 1,
             "Data": [
              {
               "UserID": "SH StRXhNFWZkX0ZcKACzSt",
               "Money": -5254.39,
               "Energy": 39.017120480537415,
               "Price": 0
              },
              {
               "UserID": "SH nebqhYpyQu1GZ49eSqAm",
               "Money": -7542.9,
               "Energy": 70.6356235742569,
               "Price": 0
              }
             ],
             "Hash": "ade4f02574f138696daff3bdd3de84181651aa045401513ec744859927b2fdc9",
             "PrevHash": "91b4d142823f7d20c5f08df69122de43f35f057a988d9619f6d3138485c9a203",
             "TNBMoney": 12797.29,
             "TNBEnergy": -109.65,
             "LeaderID": ""
            },
            {
             "Index": 1,
             "Data": [
              {
               "UserID": "SH StRXhNFWZkX0ZcKACzSt",
               "Money": -5254.39,
               "Energy": 39.017120480537415,
               "Price": 0
              },
              {
               "UserID": "SH nebqhYpyQu1GZ49eSqAm",
               "Money": -7542.9,
               "Energy": 70.6356235742569,
               "Price": 0
              }
             ],
             "Hash": "ade4f02574f138696daff3bdd3de84181651aa045401513ec744859927b2fdc9",
             "PrevHash": "91b4d142823f7d20c5f08df69122de43f35f057a988d9619f6d3138485c9a203",
             "TNBMoney": 12797.29,
             "TNBEnergy": -109.65,
             "LeaderID": ""
            },
            {
             "Index": 1,
             "Data": [
              {
               "UserID": "SH StRXhNFWZkX0ZcKACzSt",
               "Money": -5254.39,
               "Energy": 39.017120480537415,
               "Price": 0
              },
              {
               "UserID": "SH nebqhYpyQu1GZ49eSqAm",
               "Money": -7542.9,
               "Energy": 70.6356235742569,
               "Price": 0
              }
             ],
             "Hash": "ade4f02574f138696daff3bdd3de84181651aa045401513ec744859927b2fdc9",
             "PrevHash": "91b4d142823f7d20c5f08df69122de43f35f057a988d9619f6d3138485c9a203",
             "TNBMoney": 12797.29,
             "TNBEnergy": -109.65,
             "LeaderID": ""
            },
            {
             "Index": 1,
             "Data": [
              {
               "UserID": "SH StRXhNFWZkX0ZcKACzSt",
               "Money": -5254.39,
               "Energy": 39.017120480537415,
               "Price": 0
              },
              {
               "UserID": "SH nebqhYpyQu1GZ49eSqAm",
               "Money": -7542.9,
               "Energy": 70.6356235742569,
               "Price": 0
              }
             ],
             "Hash": "ade4f02574f138696daff3bdd3de84181651aa045401513ec744859927b2fdc9",
             "PrevHash": "91b4d142823f7d20c5f08df69122de43f35f057a988d9619f6d3138485c9a203",
             "TNBMoney": 12797.29,
             "TNBEnergy": -109.65,
             "LeaderID": ""
            },
            {
             "Index": 1,
             "Data": [
              {
               "UserID": "SH StRXhNFWZkX0ZcKACzSt",
               "Money": -5254.39,
               "Energy": 39.017120480537415,
               "Price": 0
              },
              {
               "UserID": "SH nebqhYpyQu1GZ49eSqAm",
               "Money": -7542.9,
               "Energy": 70.6356235742569,
               "Price": 0
              }
             ],
             "Hash": "ade4f02574f138696daff3bdd3de84181651aa045401513ec744859927b2fdc9",
             "PrevHash": "91b4d142823f7d20c5f08df69122de43f35f057a988d9619f6d3138485c9a203",
             "TNBMoney": 12797.29,
             "TNBEnergy": -109.65,
             "LeaderID": ""
            },
            {
             "Index": 1,
             "Data": [
              {
               "UserID": "SH StRXhNFWZkX0ZcKACzSt",
               "Money": -5254.39,
               "Energy": 39.017120480537415,
               "Price": 0
              },
              {
               "UserID": "SH nebqhYpyQu1GZ49eSqAm",
               "Money": -7542.9,
               "Energy": 70.6356235742569,
               "Price": 0
              }
             ],
             "Hash": "ade4f02574f138696daff3bdd3de84181651aa045401513ec744859927b2fdc9",
             "PrevHash": "91b4d142823f7d20c5f08df69122de43f35f057a988d9619f6d3138485c9a203",
             "TNBMoney": 12797.29,
             "TNBEnergy": -109.65,
             "LeaderID": ""
            },
            {
             "Index": 1,
             "Data": [
              {
               "UserID": "SH StRXhNFWZkX0ZcKACzSt",
               "Money": -5254.39,
               "Energy": 39.017120480537415,
               "Price": 0
              },
              {
               "UserID": "SH nebqhYpyQu1GZ49eSqAm",
               "Money": -7542.9,
               "Energy": 70.6356235742569,
               "Price": 0
              }
             ],
             "Hash": "ade4f02574f138696daff3bdd3de84181651aa045401513ec744859927b2fdc9",
             "PrevHash": "91b4d142823f7d20c5f08df69122de43f35f057a988d9619f6d3138485c9a203",
             "TNBMoney": 12797.29,
             "TNBEnergy": -109.65,
             "LeaderID": ""
            },
            {
             "Index": 1,
             "Data": [
              {
               "UserID": "SH StRXhNFWZkX0ZcKACzSt",
               "Money": -5254.39,
               "Energy": 39.017120480537415,
               "Price": 0
              },
              {
               "UserID": "SH nebqhYpyQu1GZ49eSqAm",
               "Money": -7542.9,
               "Energy": 70.6356235742569,
               "Price": 0
              }
             ],
             "Hash": "ade4f02574f138696daff3bdd3de84181651aa045401513ec744859927b2fdc9",
             "PrevHash": "91b4d142823f7d20c5f08df69122de43f35f057a988d9619f6d3138485c9a203",
             "TNBMoney": 12797.29,
             "TNBEnergy": -109.65,
             "LeaderID": ""
            },
            {
             "Index": 1,
             "Data": [
              {
               "UserID": "SH StRXhNFWZkX0ZcKACzSt",
               "Money": -5254.39,
               "Energy": 39.017120480537415,
               "Price": 0
              },
              {
               "UserID": "SH nebqhYpyQu1GZ49eSqAm",
               "Money": -7542.9,
               "Energy": 70.6356235742569,
               "Price": 0
              }
             ],
             "Hash": "ade4f02574f138696daff3bdd3de84181651aa045401513ec744859927b2fdc9",
             "PrevHash": "91b4d142823f7d20c5f08df69122de43f35f057a988d9619f6d3138485c9a203",
             "TNBMoney": 12797.29,
             "TNBEnergy": -109.65,
             "LeaderID": ""
            },
            {
             "Index": 1,
             "Data": [
              {
               "UserID": "SH StRXhNFWZkX0ZcKACzSt",
               "Money": -5254.39,
               "Energy": 39.017120480537415,
               "Price": 0
              },
              {
               "UserID": "SH nebqhYpyQu1GZ49eSqAm",
               "Money": -7542.9,
               "Energy": 70.6356235742569,
               "Price": 0
              }
             ],
             "Hash": "ade4f02574f138696daff3bdd3de84181651aa045401513ec744859927b2fdc9",
             "PrevHash": "91b4d142823f7d20c5f08df69122de43f35f057a988d9619f6d3138485c9a203",
             "TNBMoney": 12797.29,
             "TNBEnergy": -109.65,
             "LeaderID": ""
            },
            {
             "Index": 1,
             "Data": [
              {
               "UserID": "SH StRXhNFWZkX0ZcKACzSt",
               "Money": -5254.39,
               "Energy": 39.017120480537415,
               "Price": 0
              },
              {
               "UserID": "SH nebqhYpyQu1GZ49eSqAm",
               "Money": -7542.9,
               "Energy": 70.6356235742569,
               "Price": 0
              }
             ],
             "Hash": "ade4f02574f138696daff3bdd3de84181651aa045401513ec744859927b2fdc9",
             "PrevHash": "91b4d142823f7d20c5f08df69122de43f35f057a988d9619f6d3138485c9a203",
             "TNBMoney": 12797.29,
             "TNBEnergy": -109.65,
             "LeaderID": ""
            },
            {
             "Index": 1,
             "Data": [
              {
               "UserID": "SH StRXhNFWZkX0ZcKACzSt",
               "Money": -5254.39,
               "Energy": 39.017120480537415,
               "Price": 0
              },
              {
               "UserID": "SH nebqhYpyQu1GZ49eSqAm",
               "Money": -7542.9,
               "Energy": 70.6356235742569,
               "Price": 0
              }
             ],
             "Hash": "bde3cd47020dc7996f634949dccc4c436f993816fa1d304e5237866f633eb9c1",
             "PrevHash": "2812f40c35facdace2e12657d409ab0ef2f61707f45ba9e87a9e743c3e70bc2c",
             "TNBMoney": 12797.29,
             "TNBEnergy": -109.65,
             "LeaderID": ""
            },
            {
             "Index": 1,
             "Data": [
              {
               "UserID": "SH StRXhNFWZkX0ZcKACzSt",
               "Money": -5254.39,
               "Energy": 39.017120480537415,
               "Price": 0
              },
              {
               "UserID": "SH nebqhYpyQu1GZ49eSqAm",
               "Money": -7542.9,
               "Energy": 70.6356235742569,
               "Price": 0
              }
             ],
             "Hash": "bde3cd47020dc7996f634949dccc4c436f993816fa1d304e5237866f633eb9c1",
             "PrevHash": "2812f40c35facdace2e12657d409ab0ef2f61707f45ba9e87a9e743c3e70bc2c",
             "TNBMoney": 12797.29,
             "TNBEnergy": -109.65,
             "LeaderID": ""
            },
            {
             "Index": 1,
             "Data": [
              {
               "UserID": "SH StRXhNFWZkX0ZcKACzSt",
               "Money": -5254.39,
               "Energy": 39.017120480537415,
               "Price": 0
              },
              {
               "UserID": "SH nebqhYpyQu1GZ49eSqAm",
               "Money": -7542.9,
               "Energy": 70.6356235742569,
               "Price": 0
              }
             ],
             "Hash": "bde3cd47020dc7996f634949dccc4c436f993816fa1d304e5237866f633eb9c1",
             "PrevHash": "2812f40c35facdace2e12657d409ab0ef2f61707f45ba9e87a9e743c3e70bc2c",
             "TNBMoney": 12797.29,
             "TNBEnergy": -109.65,
             "LeaderID": ""
            },
            {
             "Index": 1,
             "Data": [
              {
               "UserID": "SH StRXhNFWZkX0ZcKACzSt",
               "Money": -5254.39,
               "Energy": 39.017120480537415,
               "Price": 0
              },
              {
               "UserID": "SH nebqhYpyQu1GZ49eSqAm",
               "Money": -7542.9,
               "Energy": 70.6356235742569,
               "Price": 0
              }
             ],
             "Hash": "bde3cd47020dc7996f634949dccc4c436f993816fa1d304e5237866f633eb9c1",
             "PrevHash": "2812f40c35facdace2e12657d409ab0ef2f61707f45ba9e87a9e743c3e70bc2c",
             "TNBMoney": 12797.29,
             "TNBEnergy": -109.65,
             "LeaderID": ""
            },
            {
             "Index": 1,
             "Data": [
              {
               "UserID": "SH StRXhNFWZkX0ZcKACzSt",
               "Money": -5254.39,
               "Energy": 39.017120480537415,
               "Price": 0
              },
              {
               "UserID": "SH nebqhYpyQu1GZ49eSqAm",
               "Money": -7542.9,
               "Energy": 70.6356235742569,
               "Price": 0
              }
             ],
             "Hash": "bde3cd47020dc7996f634949dccc4c436f993816fa1d304e5237866f633eb9c1",
             "PrevHash": "2812f40c35facdace2e12657d409ab0ef2f61707f45ba9e87a9e743c3e70bc2c",
             "TNBMoney": 12797.29,
             "TNBEnergy": -109.65,
             "LeaderID": ""
            },
            {
             "Index": 1,
             "Data": [
              {
               "UserID": "SH StRXhNFWZkX0ZcKACzSt",
               "Money": -5254.39,
               "Energy": 39.017120480537415,
               "Price": 0
              },
              {
               "UserID": "SH nebqhYpyQu1GZ49eSqAm",
               "Money": -7542.9,
               "Energy": 70.6356235742569,
               "Price": 0
              }
             ],
             "Hash": "bde3cd47020dc7996f634949dccc4c436f993816fa1d304e5237866f633eb9c1",
             "PrevHash": "2812f40c35facdace2e12657d409ab0ef2f61707f45ba9e87a9e743c3e70bc2c",
             "TNBMoney": 12797.29,
             "TNBEnergy": -109.65,
             "LeaderID": ""
            },
            {
             "Index": 1,
             "Data": [
              {
               "UserID": "SH StRXhNFWZkX0ZcKACzSt",
               "Money": -5254.39,
               "Energy": 39.017120480537415,
               "Price": 0
              },
              {
               "UserID": "SH nebqhYpyQu1GZ49eSqAm",
               "Money": -7542.9,
               "Energy": 70.6356235742569,
               "Price": 0
              }
             ],
             "Hash": "bde3cd47020dc7996f634949dccc4c436f993816fa1d304e5237866f633eb9c1",
             "PrevHash": "2812f40c35facdace2e12657d409ab0ef2f61707f45ba9e87a9e743c3e70bc2c",
             "TNBMoney": 12797.29,
             "TNBEnergy": -109.65,
             "LeaderID": ""
            },
            {
             "Index": 1,
             "Data": [
              {
               "UserID": "SH StRXhNFWZkX0ZcKACzSt",
               "Money": -631.28,
               "Energy": 29.1540447473526,
               "Price": 0
              },
              {
               "UserID": "SH nebqhYpyQu1GZ49eSqAm",
               "Money": -1690.81,
               "Energy": 70.6356235742569,
               "Price": 0
              },
              {
               "UserID": "SH nebqhYpyQu1GZ49eSqAm",
               "Money": -1690.81,
               "Energy": 70.6356235742569,
               "Price": 0
              },
              {
               "UserID": "SH nebqhYpyQu1GZ49eSqAm",
               "Money": -1690.81,
               "Energy": 70.6356235742569,
               "Price": 0
              },
              {
               "UserID": "SH nebqhYpyQu1GZ49eSqAm",
               "Money": -1690.81,
               "Energy": 70.6356235742569,
               "Price": 0
              }
             ],
             "Hash": "db7afe0e0eafde4cd62e5a076c85dd983cad1a341e7194ba4560821dceabce10",
             "PrevHash": "2812f40c35facdace2e12657d409ab0ef2f61707f45ba9e87a9e743c3e70bc2c",
             "TNBMoney": 7394.52,
             "TNBEnergy": -311.7,
             "LeaderID": ""
            },
            {
             "Index": 1,
             "Data": [
              {
               "UserID": "SH StRXhNFWZkX0ZcKACzSt",
               "Money": -631.28,
               "Energy": 29.1540447473526,
               "Price": 0
              },
              {
               "UserID": "SH nebqhYpyQu1GZ49eSqAm",
               "Money": -1690.81,
               "Energy": 70.6356235742569,
               "Price": 0
              },
              {
               "UserID": "SH nebqhYpyQu1GZ49eSqAm",
               "Money": -1690.81,
               "Energy": 70.6356235742569,
               "Price": 0
              },
              {
               "UserID": "SH nebqhYpyQu1GZ49eSqAm",
               "Money": -1690.81,
               "Energy": 70.6356235742569,
               "Price": 0
              },
              {
               "UserID": "SH nebqhYpyQu1GZ49eSqAm",
               "Money": -1690.81,
               "Energy": 70.6356235742569,
               "Price": 0
              }
             ],
             "Hash": "db7afe0e0eafde4cd62e5a076c85dd983cad1a341e7194ba4560821dceabce10",
             "PrevHash": "2812f40c35facdace2e12657d409ab0ef2f61707f45ba9e87a9e743c3e70bc2c",
             "TNBMoney": 7394.52,
             "TNBEnergy": -311.7,
             "LeaderID": ""
            },
            {
             "Index": 1,
             "Data": [
              {
               "UserID": "SH StRXhNFWZkX0ZcKACzSt",
               "Money": -631.28,
               "Energy": 29.1540447473526,
               "Price": 0
              },
              {
               "UserID": "SH nebqhYpyQu1GZ49eSqAm",
               "Money": -1690.81,
               "Energy": 70.6356235742569,
               "Price": 0
              },
              {
               "UserID": "SH nebqhYpyQu1GZ49eSqAm",
               "Money": -1690.81,
               "Energy": 70.6356235742569,
               "Price": 0
              },
              {
               "UserID": "SH nebqhYpyQu1GZ49eSqAm",
               "Money": -1690.81,
               "Energy": 70.6356235742569,
               "Price": 0
              },
              {
               "UserID": "SH nebqhYpyQu1GZ49eSqAm",
               "Money": -1690.81,
               "Energy": 70.6356235742569,
               "Price": 0
              }
             ],
             "Hash": "db7afe0e0eafde4cd62e5a076c85dd983cad1a341e7194ba4560821dceabce10",
             "PrevHash": "2812f40c35facdace2e12657d409ab0ef2f61707f45ba9e87a9e743c3e70bc2c",
             "TNBMoney": 7394.52,
             "TNBEnergy": -311.7,
             "LeaderID": ""
            },
            {
             "Index": 1,
             "Data": [
              {
               "UserID": "SH StRXhNFWZkX0ZcKACzSt",
               "Money": -631.28,
               "Energy": 29.1540447473526,
               "Price": 0
              },
              {
               "UserID": "SH nebqhYpyQu1GZ49eSqAm",
               "Money": -1690.81,
               "Energy": 70.6356235742569,
               "Price": 0
              },
              {
               "UserID": "SH nebqhYpyQu1GZ49eSqAm",
               "Money": -1690.81,
               "Energy": 70.6356235742569,
               "Price": 0
              },
              {
               "UserID": "SH nebqhYpyQu1GZ49eSqAm",
               "Money": -1690.81,
               "Energy": 70.6356235742569,
               "Price": 0
              },
              {
               "UserID": "SH nebqhYpyQu1GZ49eSqAm",
               "Money": -1690.81,
               "Energy": 70.6356235742569,
               "Price": 0
              }
             ],
             "Hash": "db7afe0e0eafde4cd62e5a076c85dd983cad1a341e7194ba4560821dceabce10",
             "PrevHash": "2812f40c35facdace2e12657d409ab0ef2f61707f45ba9e87a9e743c3e70bc2c",
             "TNBMoney": 7394.52,
             "TNBEnergy": -311.7,
             "LeaderID": ""
            },
            {
             "Index": 1,
             "Data": [
              {
               "UserID": "SH StRXhNFWZkX0ZcKACzSt",
               "Money": -631.28,
               "Energy": 29.1540447473526,
               "Price": 0
              },
              {
               "UserID": "SH nebqhYpyQu1GZ49eSqAm",
               "Money": -1690.81,
               "Energy": 70.6356235742569,
               "Price": 0
              },
              {
               "UserID": "SH nebqhYpyQu1GZ49eSqAm",
               "Money": -1690.81,
               "Energy": 70.6356235742569,
               "Price": 0
              },
              {
               "UserID": "SH nebqhYpyQu1GZ49eSqAm",
               "Money": -1690.81,
               "Energy": 70.6356235742569,
               "Price": 0
              },
              {
               "UserID": "SH nebqhYpyQu1GZ49eSqAm",
               "Money": -1690.81,
               "Energy": 70.6356235742569,
               "Price": 0
              }
             ],
             "Hash": "db7afe0e0eafde4cd62e5a076c85dd983cad1a341e7194ba4560821dceabce10",
             "PrevHash": "2812f40c35facdace2e12657d409ab0ef2f61707f45ba9e87a9e743c3e70bc2c",
             "TNBMoney": 7394.52,
             "TNBEnergy": -311.7,
             "LeaderID": ""
            },
            {
             "Index": 1,
             "Data": [
              {
               "UserID": "SH StRXhNFWZkX0ZcKACzSt",
               "Money": -631.28,
               "Energy": 29.1540447473526,
               "Price": 0
              },
              {
               "UserID": "SH nebqhYpyQu1GZ49eSqAm",
               "Money": -1690.81,
               "Energy": 70.6356235742569,
               "Price": 0
              },
              {
               "UserID": "SH nebqhYpyQu1GZ49eSqAm",
               "Money": -1690.81,
               "Energy": 70.6356235742569,
               "Price": 0
              },
              {
               "UserID": "SH nebqhYpyQu1GZ49eSqAm",
               "Money": -1690.81,
               "Energy": 70.6356235742569,
               "Price": 0
              },
              {
               "UserID": "SH nebqhYpyQu1GZ49eSqAm",
               "Money": -1690.81,
               "Energy": 70.6356235742569,
               "Price": 0
              }
             ],
             "Hash": "db7afe0e0eafde4cd62e5a076c85dd983cad1a341e7194ba4560821dceabce10",
             "PrevHash": "2812f40c35facdace2e12657d409ab0ef2f61707f45ba9e87a9e743c3e70bc2c",
             "TNBMoney": 7394.52,
             "TNBEnergy": -311.7,
             "LeaderID": ""
            },
            {
             "Index": 1,
             "Data": [
              {
               "UserID": "SH StRXhNFWZkX0ZcKACzSt",
               "Money": -631.28,
               "Energy": 29.1540447473526,
               "Price": 0
              },
              {
               "UserID": "SH nebqhYpyQu1GZ49eSqAm",
               "Money": -1690.81,
               "Energy": 70.6356235742569,
               "Price": 0
              },
              {
               "UserID": "SH nebqhYpyQu1GZ49eSqAm",
               "Money": -1690.81,
               "Energy": 70.6356235742569,
               "Price": 0
              },
              {
               "UserID": "SH nebqhYpyQu1GZ49eSqAm",
               "Money": -1690.81,
               "Energy": 70.6356235742569,
               "Price": 0
              },
              {
               "UserID": "SH nebqhYpyQu1GZ49eSqAm",
               "Money": -1690.81,
               "Energy": 70.6356235742569,
               "Price": 0
              }
             ],
             "Hash": "db7afe0e0eafde4cd62e5a076c85dd983cad1a341e7194ba4560821dceabce10",
             "PrevHash": "2812f40c35facdace2e12657d409ab0ef2f61707f45ba9e87a9e743c3e70bc2c",
             "TNBMoney": 7394.52,
             "TNBEnergy": -311.7,
             "LeaderID": ""
            },
            {
             "Index": 1,
             "Data": [
              {
               "UserID": "SH StRXhNFWZkX0ZcKACzSt",
               "Money": -631.28,
               "Energy": 29.1540447473526,
               "Price": 0
              },
              {
               "UserID": "SH nebqhYpyQu1GZ49eSqAm",
               "Money": -1690.81,
               "Energy": 70.6356235742569,
               "Price": 0
              },
              {
               "UserID": "SH nebqhYpyQu1GZ49eSqAm",
               "Money": -1690.81,
               "Energy": 70.6356235742569,
               "Price": 0
              },
              {
               "UserID": "SH nebqhYpyQu1GZ49eSqAm",
               "Money": -1690.81,
               "Energy": 70.6356235742569,
               "Price": 0
              },
              {
               "UserID": "SH nebqhYpyQu1GZ49eSqAm",
               "Money": -1690.81,
               "Energy": 70.6356235742569,
               "Price": 0
              }
             ],
             "Hash": "db7afe0e0eafde4cd62e5a076c85dd983cad1a341e7194ba4560821dceabce10",
             "PrevHash": "2812f40c35facdace2e12657d409ab0ef2f61707f45ba9e87a9e743c3e70bc2c",
             "TNBMoney": 7394.52,
             "TNBEnergy": -311.7,
             "LeaderID": ""
            },
            {
             "Index": 1,
             "Data": [
              {
               "UserID": "SH TbUfwYdQ8JkKEWfK4dJQ",
               "Money": 42.16,
               "Energy": -3.247054696083069,
               "Price": 0
              },
              {
               "UserID": "SH StRXhNFWZkX0ZcKACzSt",
               "Money": -594.74,
               "Energy": 36.38291156291962,
               "Price": 0
              },
              {
               "UserID": "SH nebqhYpyQu1GZ49eSqAm",
               "Money": -2152.13,
               "Energy": 70.6356235742569,
               "Price": 0
              },
              {
               "UserID": "SH nebqhYpyQu1GZ49eSqAm",
               "Money": -2152.13,
               "Energy": 70.6356235742569,
               "Price": 0
              }
             ],
             "Hash": "3eee1a5f353fa4444ef96a3d044912312d2b1b19f644b0293df6ee15368eb0d2",
             "PrevHash": "2812f40c35facdace2e12657d409ab0ef2f61707f45ba9e87a9e743c3e70bc2c",
             "TNBMoney": 4856.84,
             "TNBEnergy": -174.41,
             "LeaderID": ""
            },
            {
             "Index": 1,
             "Data": [
              {
               "UserID": "SH TbUfwYdQ8JkKEWfK4dJQ",
               "Money": 42.16,
               "Energy": -3.247054696083069,
               "Price": 0
              },
              {
               "UserID": "SH StRXhNFWZkX0ZcKACzSt",
               "Money": -594.74,
               "Energy": 36.38291156291962,
               "Price": 0
              },
              {
               "UserID": "SH nebqhYpyQu1GZ49eSqAm",
               "Money": -2152.13,
               "Energy": 70.6356235742569,
               "Price": 0
              },
              {
               "UserID": "SH nebqhYpyQu1GZ49eSqAm",
               "Money": -2152.13,
               "Energy": 70.6356235742569,
               "Price": 0
              }
             ],
             "Hash": "3eee1a5f353fa4444ef96a3d044912312d2b1b19f644b0293df6ee15368eb0d2",
             "PrevHash": "2812f40c35facdace2e12657d409ab0ef2f61707f45ba9e87a9e743c3e70bc2c",
             "TNBMoney": 4856.84,
             "TNBEnergy": -174.41,
             "LeaderID": ""
            },
            {
             "Index": 1,
             "Data": [
              {
               "UserID": "SH TbUfwYdQ8JkKEWfK4dJQ",
               "Money": 42.16,
               "Energy": -3.247054696083069,
               "Price": 0
              },
              {
               "UserID": "SH StRXhNFWZkX0ZcKACzSt",
               "Money": -594.74,
               "Energy": 36.38291156291962,
               "Price": 0
              },
              {
               "UserID": "SH nebqhYpyQu1GZ49eSqAm",
               "Money": -2152.13,
               "Energy": 70.6356235742569,
               "Price": 0
              },
              {
               "UserID": "SH nebqhYpyQu1GZ49eSqAm",
               "Money": -2152.13,
               "Energy": 70.6356235742569,
               "Price": 0
              }
             ],
             "Hash": "3eee1a5f353fa4444ef96a3d044912312d2b1b19f644b0293df6ee15368eb0d2",
             "PrevHash": "2812f40c35facdace2e12657d409ab0ef2f61707f45ba9e87a9e743c3e70bc2c",
             "TNBMoney": 4856.84,
             "TNBEnergy": -174.41,
             "LeaderID": ""
            },
            {
             "Index": 1,
             "Data": [
              {
               "UserID": "SH TbUfwYdQ8JkKEWfK4dJQ",
               "Money": 42.16,
               "Energy": -3.247054696083069,
               "Price": 0
              },
              {
               "UserID": "SH StRXhNFWZkX0ZcKACzSt",
               "Money": -594.74,
               "Energy": 36.38291156291962,
               "Price": 0
              },
              {
               "UserID": "SH nebqhYpyQu1GZ49eSqAm",
               "Money": -2152.13,
               "Energy": 70.6356235742569,
               "Price": 0
              },
              {
               "UserID": "SH nebqhYpyQu1GZ49eSqAm",
               "Money": -2152.13,
               "Energy": 70.6356235742569,
               "Price": 0
              }
             ],
             "Hash": "3eee1a5f353fa4444ef96a3d044912312d2b1b19f644b0293df6ee15368eb0d2",
             "PrevHash": "2812f40c35facdace2e12657d409ab0ef2f61707f45ba9e87a9e743c3e70bc2c",
             "TNBMoney": 4856.84,
             "TNBEnergy": -174.41,
             "LeaderID": ""
            },
            {
             "Index": 1,
             "Data": [
              {
               "UserID": "SH TbUfwYdQ8JkKEWfK4dJQ",
               "Money": 42.16,
               "Energy": -3.247054696083069,
               "Price": 0
              },
              {
               "UserID": "SH StRXhNFWZkX0ZcKACzSt",
               "Money": -594.74,
               "Energy": 36.38291156291962,
               "Price": 0
              },
              {
               "UserID": "SH nebqhYpyQu1GZ49eSqAm",
               "Money": -2152.13,
               "Energy": 70.6356235742569,
               "Price": 0
              },
              {
               "UserID": "SH nebqhYpyQu1GZ49eSqAm",
               "Money": -2152.13,
               "Energy": 70.6356235742569,
               "Price": 0
              }
             ],
             "Hash": "3eee1a5f353fa4444ef96a3d044912312d2b1b19f644b0293df6ee15368eb0d2",
             "PrevHash": "2812f40c35facdace2e12657d409ab0ef2f61707f45ba9e87a9e743c3e70bc2c",
             "TNBMoney": 4856.84,
             "TNBEnergy": -174.41,
             "LeaderID": ""
            },
            {
             "Index": 1,
             "Data": [
              {
               "UserID": "SH TbUfwYdQ8JkKEWfK4dJQ",
               "Money": 42.16,
               "Energy": -3.247054696083069,
               "Price": 0
              },
              {
               "UserID": "SH StRXhNFWZkX0ZcKACzSt",
               "Money": -594.74,
               "Energy": 36.38291156291962,
               "Price": 0
              },
              {
               "UserID": "SH nebqhYpyQu1GZ49eSqAm",
               "Money": -2152.13,
               "Energy": 70.6356235742569,
               "Price": 0
              },
              {
               "UserID": "SH nebqhYpyQu1GZ49eSqAm",
               "Money": -2152.13,
               "Energy": 70.6356235742569,
               "Price": 0
              }
             ],
             "Hash": "3eee1a5f353fa4444ef96a3d044912312d2b1b19f644b0293df6ee15368eb0d2",
             "PrevHash": "2812f40c35facdace2e12657d409ab0ef2f61707f45ba9e87a9e743c3e70bc2c",
             "TNBMoney": 4856.84,
             "TNBEnergy": -174.41,
             "LeaderID": ""
            },
            {
             "Index": 1,
             "Data": [
              {
               "UserID": "SH TbUfwYdQ8JkKEWfK4dJQ",
               "Money": 42.16,
               "Energy": -3.247054696083069,
               "Price": 0
              },
              {
               "UserID": "SH StRXhNFWZkX0ZcKACzSt",
               "Money": -594.74,
               "Energy": 36.38291156291962,
               "Price": 0
              },
              {
               "UserID": "SH nebqhYpyQu1GZ49eSqAm",
               "Money": -2152.13,
               "Energy": 70.6356235742569,
               "Price": 0
              },
              {
               "UserID": "SH nebqhYpyQu1GZ49eSqAm",
               "Money": -2152.13,
               "Energy": 70.6356235742569,
               "Price": 0
              }
             ],
             "Hash": "3eee1a5f353fa4444ef96a3d044912312d2b1b19f644b0293df6ee15368eb0d2",
             "PrevHash": "2812f40c35facdace2e12657d409ab0ef2f61707f45ba9e87a9e743c3e70bc2c",
             "TNBMoney": 4856.84,
             "TNBEnergy": -174.41,
             "LeaderID": ""
            },
            {
             "Index": 1,
             "Data": [
              {
               "UserID": "SH TbUfwYdQ8JkKEWfK4dJQ",
               "Money": 42.16,
               "Energy": -3.247054696083069,
               "Price": 0
              },
              {
               "UserID": "SH StRXhNFWZkX0ZcKACzSt",
               "Money": -594.74,
               "Energy": 36.38291156291962,
               "Price": 0
              },
              {
               "UserID": "SH nebqhYpyQu1GZ49eSqAm",
               "Money": -2152.13,
               "Energy": 70.6356235742569,
               "Price": 0
              },
              {
               "UserID": "SH nebqhYpyQu1GZ49eSqAm",
               "Money": -2152.13,
               "Energy": 70.6356235742569,
               "Price": 0
              }
             ],
             "Hash": "3eee1a5f353fa4444ef96a3d044912312d2b1b19f644b0293df6ee15368eb0d2",
             "PrevHash": "2812f40c35facdace2e12657d409ab0ef2f61707f45ba9e87a9e743c3e70bc2c",
             "TNBMoney": 4856.84,
             "TNBEnergy": -174.41,
             "LeaderID": ""
            },
            {
             "Index": 1,
             "Data": [
              {
               "UserID": "SH TbUfwYdQ8JkKEWfK4dJQ",
               "Money": 42.16,
               "Energy": -3.247054696083069,
               "Price": 0
              },
              {
               "UserID": "SH StRXhNFWZkX0ZcKACzSt",
               "Money": -594.74,
               "Energy": 36.38291156291962,
               "Price": 0
              },
              {
               "UserID": "SH nebqhYpyQu1GZ49eSqAm",
               "Money": -2152.13,
               "Energy": 70.6356235742569,
               "Price": 0
              },
              {
               "UserID": "SH nebqhYpyQu1GZ49eSqAm",
               "Money": -2152.13,
               "Energy": 70.6356235742569,
               "Price": 0
              }
             ],
             "Hash": "3eee1a5f353fa4444ef96a3d044912312d2b1b19f644b0293df6ee15368eb0d2",
             "PrevHash": "2812f40c35facdace2e12657d409ab0ef2f61707f45ba9e87a9e743c3e70bc2c",
             "TNBMoney": 4856.84,
             "TNBEnergy": -174.41,
             "LeaderID": ""
            },
            {
             "Index": 1,
             "Data": [
              {
               "UserID": "SH TbUfwYdQ8JkKEWfK4dJQ",
               "Money": 42.16,
               "Energy": -3.247054696083069,
               "Price": 0
              },
              {
               "UserID": "SH StRXhNFWZkX0ZcKACzSt",
               "Money": -594.74,
               "Energy": 36.38291156291962,
               "Price": 0
              },
              {
               "UserID": "SH nebqhYpyQu1GZ49eSqAm",
               "Money": -2152.13,
               "Energy": 70.6356235742569,
               "Price": 0
              },
              {
               "UserID": "SH nebqhYpyQu1GZ49eSqAm",
               "Money": -2152.13,
               "Energy": 70.6356235742569,
               "Price": 0
              }
             ],
             "Hash": "3eee1a5f353fa4444ef96a3d044912312d2b1b19f644b0293df6ee15368eb0d2",
             "PrevHash": "2812f40c35facdace2e12657d409ab0ef2f61707f45ba9e87a9e743c3e70bc2c",
             "TNBMoney": 4856.84,
             "TNBEnergy": -174.41,
             "LeaderID": ""
            },
            {
             "Index": 1,
             "Data": [
              {
               "UserID": "SH TbUfwYdQ8JkKEWfK4dJQ",
               "Money": 42.16,
               "Energy": -3.247054696083069,
               "Price": 0
              },
              {
               "UserID": "SH StRXhNFWZkX0ZcKACzSt",
               "Money": -594.74,
               "Energy": 36.38291156291962,
               "Price": 0
              },
              {
               "UserID": "SH nebqhYpyQu1GZ49eSqAm",
               "Money": -2152.13,
               "Energy": 70.6356235742569,
               "Price": 0
              },
              {
               "UserID": "SH nebqhYpyQu1GZ49eSqAm",
               "Money": -2152.13,
               "Energy": 70.6356235742569,
               "Price": 0
              }
             ],
             "Hash": "3eee1a5f353fa4444ef96a3d044912312d2b1b19f644b0293df6ee15368eb0d2",
             "PrevHash": "2812f40c35facdace2e12657d409ab0ef2f61707f45ba9e87a9e743c3e70bc2c",
             "TNBMoney": 4856.84,
             "TNBEnergy": -174.41,
             "LeaderID": ""
            },
            {
             "Index": 1,
             "Data": [
              {
               "UserID": "SH TbUfwYdQ8JkKEWfK4dJQ",
               "Money": 42.16,
               "Energy": -3.247054696083069,
               "Price": 0
              },
              {
               "UserID": "SH StRXhNFWZkX0ZcKACzSt",
               "Money": -594.74,
               "Energy": 36.38291156291962,
               "Price": 0
              },
              {
               "UserID": "SH nebqhYpyQu1GZ49eSqAm",
               "Money": -2152.13,
               "Energy": 70.6356235742569,
               "Price": 0
              },
              {
               "UserID": "SH nebqhYpyQu1GZ49eSqAm",
               "Money": -2152.13,
               "Energy": 70.6356235742569,
               "Price": 0
              }
             ],
             "Hash": "3eee1a5f353fa4444ef96a3d044912312d2b1b19f644b0293df6ee15368eb0d2",
             "PrevHash": "2812f40c35facdace2e12657d409ab0ef2f61707f45ba9e87a9e743c3e70bc2c",
             "TNBMoney": 4856.84,
             "TNBEnergy": -174.41,
             "LeaderID": ""
            }
           ]
            let blockchain ={
              data: bdata.slice(0,25)
            }
            

            await this._configV2.writeToBlockchain(blockchain).subscribe(data => {
              let blockchainResp = JSON.parse(JSON.stringify(data))
              if (blockchainResp.Success){
                Swal.fire('Round of Customer Matching complete ', '', 'success')
              }
              
            })


          // })
        })
      }) 
    ).subscribe(); 



    // check if the jwt is stored in local storage or not
    if (this._jwtServ.checkToken()){
      this._jwtServ.verifyToken().subscribe(data => {
        console.log("Verified Token", data)
        let response = JSON.parse(JSON.stringify(data))
        //console.log(response.Username)
        this.getBuyRequests()
        if (data !=null){
          this._loggedInUserId = response.User.UId
          
          // subscribe to the message
          this.reqData.currentMessage.subscribe(message => this.requestForBid = message)
        }        
      })

    }
  }
// don't forget to unsubscribe when the Observable is not necessary anymore 
ngOnDestroy(): void { 
  this.timerSubscription.unsubscribe(); 
} 
  
  async getBuyRequests(){
    this._configV2.getClosedEnergyRequests().subscribe(data => {
      //console.log("Buy requests data for market page", data)
      let response = JSON.parse(JSON.stringify(data))
      console.log("Buy requests data for market page", response)
      //this.allBuyRequests = response.Requests
      let reqArr = response.Data
      allClosedRequests = []
      for(let i = 0; i < reqArr.length; i++) {
        let obj = reqArr[i]
        //console.log("All buy requests")
      

          // for closed requests
            let closedRequest:energyRequests={
              type: obj.Prosumer_or_EV,
                price: Math.round((obj.UserPrice + Number.EPSILON) * 100) / 100  ,
                energy: obj.UserEnergy,
                reqId: obj.requestId,
                bidBtn: ''
            }
            allClosedRequests.push(closedRequest)
            
            
          

          if (i==reqArr.length-1){

            // instantiate pagination list for closed requests
            this.closesRequestDataSource = new MatTableDataSource<energyRequests>(allClosedRequests)
            this.closesRequestDataSource.paginator = this.closedReqPaginator
          }

          
        
        
    }

    })
  }



}

// for the closed requests
let allClosedRequests: energyRequests[] = []