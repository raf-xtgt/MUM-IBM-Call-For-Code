import { Component, OnInit } from '@angular/core';
import { JWTService } from '../userAuth.service';
import {BuyEnergyRequest, GraphData, HouseholdEnergyData} from '../classes';
import { DateService } from '../date.service';
// import the custom http service module to communicate with backend
import { ConfigService } from '../config.service';
import { ModalService } from '../modals.service';
import Swal from 'sweetalert2'
import { Router } from '@angular/router';
import { GraphService } from '../graph.service';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';
// for the loading
import {ThemePalette} from '@angular/material/core';
import {ProgressSpinnerMode} from '@angular/material/progress-spinner';


@Component({
  selector: 'app-ev-page',
  templateUrl: './ev-page.component.html',
  styleUrls: ['./ev-page.component.css']
})
export class EvPageComponent implements OnInit {

  constructor(private _jwtServ:JWTService, private _config:ConfigService, private router: Router) { }

  private dateService = new DateService()
  public modalService = new ModalService()
  public model = new HouseholdEnergyData("", 0, [0,0],  "", 0)
  private _buyRequest = new BuyEnergyRequest("", 0,0, false, "", "")
  public currentAvgPrice :number = 0 // average price per kWh for the current day
  public chargingTime :number = 0 // time the ev needs for charging
  public energyInput :number = 0; // amount of energy required/entered by user
  public priceToPay :number = 0; // amount the user needs to pay
  public userType:any 


  public username :string =""
  private _buyerId :string = ""
  // all of this data needs to come from the backend
  public completedTran :number = 10;
  public currentFiat :number = 2000
  public currentEnergy :number = 12000;

  // buy forecast graph
  public actual_x :string[] = []
  public actual_y :number[] = []
  public pred_x :string[] = []
  public pred_y :number[] = []
  public graphData :GraphData[] = []
  // y and x axis
  public chartData: ChartDataSets[] = [{data:[], label:'Charging Graph'}];
  public xAxis: Label[] = [];  

  // data for the card above the graph
  public currentDate:string = this.dateService.getCurrentDate()
  public currentTime:string = ""
  public currentConsumption :number|any = 0
  public predictionTime:string = "" // time at which the prediction is made
  public prediction:number = 0

  public lineChartOptions = {
    responsive: true,
  };
  public chartColors: any[] = [
    {
        borderColor:"#2793FF",
        backgroundColor: "#B9DCFF",
        fill:false
    },

    // predicted
    {
      borderColor: "#FF6347",
      backgroundColor: "#B22222",
      fill:false
    },

    {
      borderColor: "#065535",
      backgroundColor: "#d3ffce",
      fill:false
    },
    {
      borderColor: "#003366",
      backgroundColor: "#c6e2ff",
      fill:false
    },
    {
      borderColor: "#800080",
      backgroundColor: "#faebd7",
      fill:false
    },
    {
      borderColor: "#800000",
      backgroundColor: "#cbbeb5",
      fill:false
    },

    {
      borderColor: "#00ff7f",
      backgroundColor: "#a0db8e",
      fill:false
    },
  
  ];

  // loading before graph and all data are available
  public isLoading: boolean = false;
  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'indeterminate';
  value = 100;


  selectedValue: string|any;
  

  allTimes: EVTime[] = [];

  ngOnInit(): void {
    
      // check if the jwt is stored in local storage or not
    if (this._jwtServ.checkToken()){
      this._jwtServ.verifyToken().subscribe(data => {
        console.log("Verified Token", data)
        let response = JSON.parse(JSON.stringify(data))
        if (response.User.Type=="admin"){
          this.username = response.User.UserName
          this._buyerId = response.User.UId
          this.getEnergyPriceData()
          this.adminEVGraphs()
        } 
        
        //console.log(response.Username)
        else{
          this.username = response.User.UserName
          this._buyerId = response.User.UId
          this.getEnergyPriceData()
          this.initEnergyForecast()
        }
        
      })
    }
    else{
      this.router.navigateByUrl('/login');
    }
  }


    // ask the backend to add forecast data for this user on the database
  initEnergyForecast(){
    let date:Date = new Date()
    let hrs:number = date.getHours()
    let mins:number = date.getMinutes()
    let upperEnd = 0
    if (hrs != 0){
      if (mins < 30){
        upperEnd = hrs * 2
      }
      else if ((mins >=30) && (mins<=45)) {
        upperEnd = (hrs*2) +1
      }
      else{
        upperEnd = (hrs*2) +2
      }
    }
    else{
      upperEnd = 4
    }


    let actual = [ 0,0,0,0,0,0,   0.3,	0.5,	0.7,	0.9,	1,	1,	1,	1,	1,	1,	1, 1,	1,	1,	0.8,	0.6,	0.6,	0.6,	0.8,	1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]





    let forecast = [50, 64, 65, 62, 63, 63, -50, -52, -54, -53, -58, 60, 67, 66, 69, 66, -32, -33, -27, -33, -30, 50, 50, 50,50, 63, 60, 56, 66, 65, -54, -54, -58, -59, -50, 63, 60, 56, 66, 65, -30, -31, -34, -32, -33, 53, 52, 55]
    let xAxis: Label[] = ["12:00AM", "12:30AM", "01:00AM","01:30AM","02:00AM","02:30AM", "03:00AM", "03:30AM",
    "04:00AM", "04:30AM", "05:00AM", "05:30AM", "06:00AM", "06:30AM","07:00AM", "07:30AM",
    "08:00AM", "08:30AM", "09:00AM", "09:30AM", "10:00AM", "10:30AM", "11:00AM", "11:30AM", 
    "12:00PM","12:30PM", "01:00PM","01:30PM","02:00PM","02:30PM", "03:00PM", "03:30PM",
    "04:00PM", "04:30PM", "05:00PM", "05:30PM", "06:00PM", "06:30PM","07:00PM", "07:30PM",
    "08:00PM", "08:30PM", "09:00PM", "09:30PM", "10:00PM", "10:30PM", "11:00PM", "11:30PM",]
    

    let actualPlot = []
    let forecastPlot = []
    let xAxisPlot = []
    for(let i=0; i<upperEnd; i++){
      actualPlot.push(actual[i])

    }
    for(let j=0; j<upperEnd+1; j++){
      forecastPlot.push(forecast[j])
      xAxisPlot.push(xAxis[j])

    }

    this.chartData = [{data:actualPlot, label:'Charging Graph for the day'} ]
    this.xAxis = xAxisPlot
    // this.prediction = forecastPlot[forecastPlot.length-1]
    this.currentConsumption = actualPlot[actualPlot.length-1]
    this.currentTime = (this.xAxis[this.xAxis.length-2]).toString()
    // this.predictionTime = (this.xAxis[this.xAxis.length-1]).toString()


  }


  // get the average price in kWh from backend for the current day
  getEnergyPriceData(){
    let dateToday = this.dateService.getCurrentDate()
    this.model.dateStr = dateToday
    this._config.getHouseholdData(this.model).subscribe(data => {
      let response = JSON.parse(JSON.stringify(data))
      if (this.model.data != undefined){
        this.model.data = response.Data.Data
      this.model.day = response.Data.Day
      this.model.dateStr = response.Data.DateStr
      this.model.average = response.Data.Average  
      this.currentAvgPrice = this.model.average 
      }
      else{
        console.log("lol")
      }
      console.log("House hold data for order page", response)
      //console.log("House hold data", response.Data.Data)
    })
  }

  


  /** process the buy request,
   * If the user confirms the request, then store it in the database
   * If the user cancels then just refresh the page **/
  createBuyRequest(){  
        Swal.fire({
            title: 'Confirm Buy Request',
            showDenyButton: false,
            showCancelButton: true,
            confirmButtonText: 'Confirm',
            //denyButtonText: denyBtnTxt,
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
              this._buyRequest.buyerId = this._buyerId
              this._buyRequest.energyAmount = this.energyInput
              this._buyRequest.fiatAmount = this.energyInput * this.currentAvgPrice
              //console.log("Buy request", this._buyRequest)
              
              if (this.orderValidation(this._buyRequest)){
                Swal.fire('Your request has been placed on the market!!', '', 'success')  
                  console.log(this._buyRequest)
                  this._config.makeBuyRequest(this._buyRequest).subscribe(data => {
                  //console.log("Response from backend for buy energy request", data)
                  this.router.navigateByUrl('/market');
                })
              }
              else{
                Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: 'Please enter valid energy amount and ensure you have sufficient fiat balance!',
                })
              }
              
              

            } else if (result.isDismissed) {
              Swal.fire('Request Cancelled!', '', 'info')
            
            }
          })
  }


  // to check if the energy amount is within the predicted consumption rate
  orderValidation(req: BuyEnergyRequest){
    if (req.energyAmount <= 0 || req.energyAmount > this.prediction){
      return false
    }
    else if (this.currentFiat < req.fiatAmount){
      return false
    }
    else{
      return true
    }

  }


  adminEVGraphs(){
        // ask the backend to add forecast data for this user on the database
  
    let date:Date = new Date()
    let hrs:number = date.getHours()
    let mins:number = date.getMinutes()
    let upperEnd = 0
    if (hrs != 0){
      if (mins < 30){
        upperEnd = hrs * 2
      }
      else if ((mins >=30) && (mins<=45)) {
        upperEnd = (hrs*2) +1
      }
      else{
        upperEnd = (hrs*2) +2
      }
    }
    else{
      upperEnd = 4
    }


    let ev1 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, 0.1,	0.3,	0.5,	0.7,	0.9,	0.7,	0.5,	0.4,	0.4,	0.6,	0.8,	1, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    
    let ev2 = [ 0,0,0,0,0,0,0,0,0,0.5,	0.7,	0.9,	1,	1,	1,	1,	1,	1,	1,	1,	0.8,	0.6,	0.4,	0.2,	0.4,	0.6,	0.8,	1,	1,	1,	1, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    let ev3 = [ 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.6,	0.4,	0.6,	0.8,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1,	0.8,	0.6,	0.4,	0.6,	0.8,	1,0,0,0,0,0 ]
    let ev4 = [ 0,0,0,0,0,0,0,0,0,0,0,0,0,0.7,	0.9,	1,	1,	1,	1,	1,	0.8,	0.6,	0.4,	0.2,	0.4,	0.6,	0.8,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1,	0.8,	0.6,	0.6,	0.8,	1,0,0,0,0,0,0    ]

    let ev5 = [ 0,0,0,0,0,0,   0.3,	0.5,	0.7,	0.9,	1,	1,	1,	1,	1,	1,	1, 1,	1,	1,	0.8,	0.6,	0.6,	0.6,	0.8,	1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    let ev7 = [ 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.8,	0.6,	0.4,	0.6,	0.8,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1,	0.8,	0.6,	0.4,	0.6,	0.8,	1,	1,	1,	1,	1,0    ]
    let ev6 = [ 0,0,0,0,0,0, 0.3,	0.5,	0.7,	0.9,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1,	0.8,	0.6,	0.6,	0.6, 0.8,	1, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0    ]




    let xAxis: Label[] = ["12:00AM", "12:30AM", "01:00AM","01:30AM","02:00AM","02:30AM", "03:00AM", "03:30AM",
    "04:00AM", "04:30AM", "05:00AM", "05:30AM", "06:00AM", "06:30AM","07:00AM", "07:30AM",
    "08:00AM", "08:30AM", "09:00AM", "09:30AM", "10:00AM", "10:30AM", "11:00AM", "11:30AM", 
    "12:00PM","12:30PM", "01:00PM","01:30PM","02:00PM","02:30PM", "03:00PM", "03:30PM",
    "04:00PM", "04:30PM", "05:00PM", "05:30PM", "06:00PM", "06:30PM","07:00PM", "07:30PM",
    "08:00PM", "08:30PM", "09:00PM", "09:30PM", "10:00PM", "10:30PM", "11:00PM", "11:30PM",]
    
    for (let i=0; i<xAxis.length; i++){
      this.allTimes.push({value:xAxis[i]})
    }
    console.log(this.allTimes)



    let ev1Plot = []
    let ev2Plot = []
    let ev3Plot = []
    let ev4Plot = []
    let ev5Plot = []
    let ev6Plot = []
    let ev7Plot = []
    let xAxisPlot = []
    for(let i=0; i<upperEnd; i++){
      ev1Plot.push(ev1[i])

    }
    for(let j=0; j<upperEnd+1; j++){
      ev2Plot.push(ev2[j])
      
    }
    for(let j=0; j<upperEnd+1; j++){
      ev3Plot.push(ev3[j])

    }

    for(let j=0; j<upperEnd+1; j++){
      ev4Plot.push(ev4[j])

    }
    for(let j=0; j<upperEnd+1; j++){
      ev5Plot.push(ev5[j])
    }
    for(let j=0; j<upperEnd+1; j++){
      ev6Plot.push(ev6[j])
      
    }
    for(let j=0; j<upperEnd+1; j++){
      ev7Plot.push(ev7[j])
      xAxisPlot.push(xAxis[j])
    }

    this.chartData = 
    [
      {data:ev1Plot, label:'Charging Graph for the day(EV1)'}, 
      {data:ev2Plot, label:'Charging Graph for the day(EV2)'}, 
      {data:ev3Plot, label:'Charging Graph for the day(EV3)'},
      {data:ev4Plot, label:'Charging Graph for the day(EV4)'}, 
      {data:ev5Plot, label:'Charging Graph for the day(EV5)'},
      {data:ev6Plot, label:'Charging Graph for the day(EV6)'},
      {data:ev7Plot, label:'Charging Graph for the day(EV7)'} 
    ]
    this.xAxis = xAxisPlot
  }

  showForTime(selectedValue:string){
    console.log("Selected time", selectedValue)
            // ask the backend to add forecast data for this user on the database
  
            let upperEnd = 0
            
        
        
            let ev1 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, 0.1,	0.3,	0.5,	0.7,	0.9,	0.7,	0.5,	0.4,	0.4,	0.6,	0.8,	1, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
            
            let ev2 = [ 0,0,0,0,0,0,0,0,0,0.5,	0.7,	0.9,	1,	1,	1,	1,	1,	1,	1,	1,	0.8,	0.6,	0.4,	0.2,	0.4,	0.6,	0.8,	1,	1,	1,	1, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
            let ev3 = [ 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.6,	0.4,	0.6,	0.8,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1,	0.8,	0.6,	0.4,	0.6,	0.8,	1,0,0,0,0,0 ]
            let ev4 = [ 0,0,0,0,0,0,0,0,0,0,0,0,0,0.7,	0.9,	1,	1,	1,	1,	1,	0.8,	0.6,	0.4,	0.2,	0.4,	0.6,	0.8,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1,	0.8,	0.6,	0.6,	0.8,	1,0,0,0,0,0,0    ]
        
            let ev5 = [ 0,0,0,0,0,0,   0.3,	0.5,	0.7,	0.9,	1,	1,	1,	1,	1,	1,	1, 1,	1,	1,	0.8,	0.6,	0.6,	0.6,	0.8,	1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
            let ev7 = [ 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.8,	0.6,	0.4,	0.6,	0.8,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1,	0.8,	0.6,	0.4,	0.6,	0.8,	1,	1,	1,	1,	1,0    ]
            let ev6 = [ 0,0,0,0,0,0, 0.3,	0.5,	0.7,	0.9,	1,	1,	1,	1,	1,	1,	1,	1,	1,	1,	0.8,	0.6,	0.6,	0.6, 0.8,	1, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0    ]
        
        
        
        
            let xAxis: Label[] = ["12:00AM", "12:30AM", "01:00AM","01:30AM","02:00AM","02:30AM", "03:00AM", "03:30AM",
            "04:00AM", "04:30AM", "05:00AM", "05:30AM", "06:00AM", "06:30AM","07:00AM", "07:30AM",
            "08:00AM", "08:30AM", "09:00AM", "09:30AM", "10:00AM", "10:30AM", "11:00AM", "11:30AM", 
            "12:00PM","12:30PM", "01:00PM","01:30PM","02:00PM","02:30PM", "03:00PM", "03:30PM",
            "04:00PM", "04:30PM", "05:00PM", "05:30PM", "06:00PM", "06:30PM","07:00PM", "07:30PM",
            "08:00PM", "08:30PM", "09:00PM", "09:30PM", "10:00PM", "10:30PM", "11:00PM", "11:30PM",]
            
            for (let i=0; i<xAxis.length; i++){
              if (xAxis[i]==selectedValue){
                upperEnd = i
              }
            }

            for (let i=0; i<xAxis.length; i++){
              this.allTimes.push({value:xAxis[i]})
            }
            console.log(this.allTimes)
        
        
        
            let ev1Plot = []
            let ev2Plot = []
            let ev3Plot = []
            let ev4Plot = []
            let ev5Plot = []
            let ev6Plot = []
            let ev7Plot = []
            let xAxisPlot = []
            for(let i=0; i<upperEnd; i++){
              ev1Plot.push(ev1[i])
        
            }
            for(let j=0; j<upperEnd+1; j++){
              ev2Plot.push(ev2[j])
              
            }
            for(let j=0; j<upperEnd+1; j++){
              ev3Plot.push(ev3[j])
        
            }
        
            for(let j=0; j<upperEnd+1; j++){
              ev4Plot.push(ev4[j])
        
            }
            for(let j=0; j<upperEnd+1; j++){
              ev5Plot.push(ev5[j])
            }
            for(let j=0; j<upperEnd+1; j++){
              ev6Plot.push(ev6[j])
              
            }
            for(let j=0; j<upperEnd+1; j++){
              ev7Plot.push(ev7[j])
              xAxisPlot.push(xAxis[j])
            }
        
            this.chartData = 
            [
              {data:ev1Plot, label:'Charging Graph for the day(EV1)'}, 
              {data:ev2Plot, label:'Charging Graph for the day(EV2)'}, 
              {data:ev3Plot, label:'Charging Graph for the day(EV3)'},
              {data:ev4Plot, label:'Charging Graph for the day(EV4)'}, 
              {data:ev5Plot, label:'Charging Graph for the day(EV5)'},
              {data:ev6Plot, label:'Charging Graph for the day(EV6)'},
              {data:ev7Plot, label:'Charging Graph for the day(EV7)'} 
            ]
            this.xAxis = xAxisPlot
  }
}


interface EVTime {
  value: string|any;
}
