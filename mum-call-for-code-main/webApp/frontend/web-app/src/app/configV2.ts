import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';



@Injectable({
  providedIn: 'root'
})
export class ConfigServiceV2 {

  private _configUrl: string = "http://localhost:8989/";
  private _golangServer:string = "http://localhost:8888/"
  private _getEnergyRequests: string = this._configUrl + "EnergyRequest/GetEnergyRequest";
  private _getClosedEnergyRequests: string = this._configUrl + "EnergyRequest/GetClosedEnergyRequest";
  private _bidRequests: string = this._configUrl + "EnergyRequest/Bid";
  private _getBlockchain: string = this._configUrl + "Blockchain/GetBlockchain";
  private _getCMData: string = this._configUrl + "CustomerMatching/GetCMData";
  private _runCM: string = this._golangServer + "InitCM";
  private _writeBlockchain:string = this._configUrl + 'Blockchain/WriteBlockchain'
  TOKEN_KEY = 'token';


  //inject the HttpClient service as a dependency 
  constructor(private http: HttpClient) { }



  // get open energy requests
  getOpenEnergyRequests()  {
    let data = "Data"
    return this.http.post(this._getEnergyRequests, data)
  }

  // get closed energy requests
  getClosedEnergyRequests()  {
    let data = "Data"
    return this.http.post(this._getClosedEnergyRequests, data)
  }

  // make a bid
  makeBid(data:any){
    return this.http.post(this._bidRequests, data)
  }

  // get blockchain
  getBlockchain(){
    let data = "blockchain"
    return this.http.post(this._getBlockchain, data)
  }

  getCMData(){
    let data = "getCMData"
    return this.http.post(this._getCMData, data)
  }

  runCM(data:any){
    const body = JSON.stringify(data)
    return this.http.post(this._runCM, body)
  }

  writeToBlockchain(data:any){
    return this.http.post(this._writeBlockchain, data)
 
  }
  
}