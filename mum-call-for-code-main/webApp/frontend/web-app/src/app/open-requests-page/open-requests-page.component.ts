import { Component, OnInit, ViewChild} from '@angular/core';
import { ConfigService } from '../config.service';
import { BuyEnergyRequest, energyRequests } from '../classes';
import {Router} from '@angular/router';
import { SendDataService } from '../send-data.service';
import { JWTService } from '../userAuth.service';
import Swal from 'sweetalert2'
import { TimerComponent } from '../timer/timer.component';
import { ConfigServiceV2 } from '../configV2';


// imports required for the pagination
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { openRequests } from '../classes';

@Component({
  selector: 'app-open-requests-page',
  templateUrl: './open-requests-page.component.html',
  styleUrls: ['./open-requests-page.component.css']
})
export class OpenRequestsPageComponent implements OnInit {

  constructor(private _configV2:ConfigServiceV2 ,private _config:ConfigService, private router: Router, private reqData: SendDataService, private _jwtServ:JWTService) { }
  
  public allOpenBuyRequests:Array<BuyEnergyRequest>=[];
  public allClosedBuyRequests:Array<BuyEnergyRequest>=[];
  public noOpenBuyRequests: boolean = true;
  public noClosedBuyRequests: boolean = true;
  private requestForBid :BuyEnergyRequest = new BuyEnergyRequest("", 0, 0, false, "","") // this will hold the buy energy request data on which the prosumer makes a bid

  public buyerId: string = ""
  public message: string = "";
  private _loggedInUserId : string = "" //id of the user that is logged in

   // for the pagination of open buy requests
   openedRequestDisplayedCols: string[] = ['buyer', 'energyAmount', 'fiatAmount', 'reqId','remTime', 'bidBtn']
   openRequestDataSource = new MatTableDataSource<openRequests>(allOpenRequests)
     // add the paginator

     energyRequestDisplayedCols: string[] = [ 'energy', 'price', 'type', 'bidBtn']
     energyRequestDataSource = new MatTableDataSource<energyRequests>(allEnergyRequests)
  
     @ViewChild(MatPaginator) openedReqPaginator: MatPaginator | any

     async ngOnInit(): Promise<void> {
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
      await this.getEnergyRequests()
    }

    async getBuyRequests(){
      this._config.getBuyRequests().subscribe(data => {
        //console.log("Buy requests data for market page", data)
        let response = JSON.parse(JSON.stringify(data))
        console.log("Buy requests data for market page", response)
        //this.allBuyRequests = response.Requests
        let reqArr = response.Requests
        allOpenRequests = []
        for(let i = 0; i < reqArr.length; i++) {
          //console.log("All buy requests")
          this._jwtServ.gerUsername(reqArr[i].BuyerId).subscribe(data => {
            let response = JSON.parse(JSON.stringify(data))
            
            // for closed requests
            if (reqArr[i].RequestClosed == false){
              let timer = new TimerComponent()
              let remainingTime = timer.getTimeDiff(reqArr[i])
              let timeArr = remainingTime.split(' Min')
              let timeMin = parseInt(timeArr[0])
              console.log("Minutes elapsed", timeMin)
              if (timeMin>=2){
                //close the request
                this._config.closeBuyRequest(reqArr[i].ReqId).subscribe(data => {
                  console.log("buy request closed", data)
                  this._config.runDoubleAuction().subscribe(data=>{
                    console.log("Finished running double auction")
                  })
  
  
                })
  
              }
                          
              let openRequest:openRequests={
                buyer: "("+response.User.UserName+")\n"+reqArr[i].BuyerId,
                energyAmount: reqArr[i].EnergyAmount,
                fiatAmount: (reqArr[i].FiatAmount).toFixed(2),
                reqId: reqArr[i].ReqId,
                remTime: remainingTime,
                bidBtn:''
              }
              allOpenRequests.push(openRequest)
              if (allOpenRequests.length>0){
                this.noOpenBuyRequests = false
              }
  
              
            }
            // instantiate pogination list for open requests
            this.openRequestDataSource = new MatTableDataSource<openRequests>(allOpenRequests)
            this.openRequestDataSource.paginator = this.openedReqPaginator
  
            
          })
          
      }
  
      })
    }
  
    // redirect user to the bidding page
    navigateToBidPage(){
      this.router.navigateByUrl('/bid');
    }
  
    bid(request: openRequests|any){

      console.log("The bid", request)
      
      let requestToSend = request  
      //send the request to the bidpage that is listening on the msg
      this.reqData.changeMessage(requestToSend)
      this.router.navigateByUrl('/bid');
      
    }
  

    async getEnergyRequests(){
      allEnergyRequests = []
      this._configV2.getOpenEnergyRequests().subscribe(data => {
        //console.log("Buy requests data for market page", data)
        let response = JSON.parse(JSON.stringify(data))
        console.log("V2 Buy requests data for market page", response)
        let reqArr = response.Data
        for(let i = 0; i < reqArr.length; i++) {
          let obj = reqArr[i]
        
                        
              let enRequest:energyRequests={
                type: obj.Prosumer_or_EV,
                price: Math.round((obj.UserPrice + Number.EPSILON) * 100) / 100 ,
                energy: obj.UserEnergy,
                reqId: obj.requestId,
                bidBtn: ''
              }
              allEnergyRequests.push(enRequest)
  
             
            // instantiate pogination list for open requests
            this.energyRequestDataSource = new MatTableDataSource<energyRequests>(allEnergyRequests)
            this.energyRequestDataSource.paginator = this.openedReqPaginator
  
      }
        
  
      })
    }
  
  

}

// for the open requests
let allOpenRequests: openRequests[] = []
let allEnergyRequests: energyRequests[] = []
