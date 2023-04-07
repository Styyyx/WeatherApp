import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class WeatherAPIService {
  private key:string = 'dd487eb6f49bc1721ecaac5686515c08';
  private URLCurrentWeather:string = 'https://api.openweathermap.org/data/2.5/weather';
  private URLForecastWeather:string = 'https://api.openweathermap.org/data/2.5/forecast';
  private URLgeocoder:string = 'http://api.openweathermap.org/geo/1.0/direct';

  constructor (private http: HttpClient) {

   }

   getCurrentWeather(lat:number, lon:number){
    let reqParams:HttpParams = new HttpParams().set('appid', this.key).set('lat', lat).set('lon', lon).set('units', 'metric');
    return this.http.get(this.URLCurrentWeather, {params:reqParams});
   }

   getForecastWeather(lat:number, lon:number){
    let reqParams:HttpParams = new HttpParams().set('appid', this.key).set('lat', lat).set('lon', lon).set('units', 'metric');
    return this.http.get(this.URLForecastWeather, {params:reqParams});
   }

   getLatLon(loc:string) {
    let reqParams:HttpParams = new HttpParams().set('appid', this.key).set('q', loc).set('limit', 5);
    return this.http.get(this.URLgeocoder, { params:reqParams });
   }
}
