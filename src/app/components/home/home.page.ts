import { Component, ViewChild } from '@angular/core';
import { WeatherAPIService } from '../../services/weather-api.service';
import { Icity, IforecastDay, IweatherData } from '../../myInterfaces';
import _cities from '../../../assets/cities.json';
import { IonSelect, IonSearchbar, AlertController, IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {
  cities: Icity[] = _cities.sort((a, b) => a.locality.localeCompare(b.locality));

  currWeatherData?: IweatherData;
  forecasts?: IweatherData[];
  fcastDaily: IforecastDay[];

  @ViewChild('selectLocation', { static: false }) ctrlSelect: IonSelect;
  @ViewChild('searchLocation', { static: false }) ctrlSearch: IonSearchbar;

  constructor(private weatherApi: WeatherAPIService, private alert: AlertController) { }

  getHourMins(_date: Date) {
    let hrs: number = _date.getHours();
    let mins: number = _date.getMinutes();
    let suffix: string = (hrs < 12) ? 'AM' : 'PM';

    return `${(hrs < 12) ? hrs : hrs - 12}:${('0' + mins).slice(-2)} ${suffix}`
  }

  getDateInfo(_date: Date): any {
    return {
      'time': this.getHourMins(_date),
      'weekday': Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(_date),
      'day': Intl.DateTimeFormat('en-US', { day: 'numeric' }).format(_date),
      'monthLong': Intl.DateTimeFormat('en-US', { month: 'long' }).format(_date),
      'monthNum': _date.getMonth()
    };
  }

  getWeatherData(_lat: number, _lon: number, _locName: string) {
    this.weatherApi.getCurrentWeather(_lat, _lon).subscribe(
      // Subscribe is async, run code inside to wait for response
      // Any code outside will run immediately
      (_data: any) => {
        let currDate = new Date(_data.dt as number * 1000);
        let dateInfo = this.getDateInfo(currDate);

        this.currWeatherData = {
          location: _locName,
          stationName: _data.name,

          weather: (_data.weather[0].description).toUpperCase(),
          icon: _data.weather.icon,

          windSpeed: _data.wind.speed + ' m/s',
          humidity: _data.main.humidity,

          sunrise: this.getHourMins(new Date(_data.sys.sunrise as number * 1000)),
          sunset: this.getHourMins(new Date(_data.sys.sunset as number * 1000)),

          // °
          temp: _data.main.temp,
          temp_min: _data.main.temp_min,
          temp_max: _data.main.temp_max,

          date: currDate.getDate(),
          time: dateInfo['time'],
          weekday: dateInfo['weekday'],
          day: dateInfo['day'],
          monthLong: dateInfo['monthLong'],
          monthNum: dateInfo['monthNum']
        }
      });

    this.weatherApi.getForecastWeather(_lat, _lon).subscribe(
      (_data: any) => {
        let fcasts = _data.list as any[];

        // Getting high low temp per day
        let days = [...new Set(fcasts.map((_f) => { return new Date(_f.dt as number * 1000).getDay(); }))]

        this.fcastDaily = days.map((_d) => {
          let sameDays = fcasts.filter(_f => new Date(_f.dt as number * 1000).getDay() === _d);
          let weekday = Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date(sameDays[0].dt as number * 1000));
          let temp_min = Math.min(...sameDays.map(_f => _f.main.temp_min));
          let temp_max = Math.max(...sameDays.map(_f => _f.main.temp_max));

          return { weekday: weekday, temp_max: temp_max, temp_min: temp_min } as IforecastDay;
        });

        this.forecasts = fcasts.map((_f: any): any => {
          let fDate = new Date(_f.dt as number * 1000);
          let dateInfo = this.getDateInfo(fDate);
          let f: IweatherData = {
            location: _locName,
            stationName: _data.city.name,

            weather: _f.weather[0].description,
            icon: _f.weather[0].icon,

            windSpeed: _f.wind.speed,
            humidity: _f.main.humidity,

            temp: _f.main.temp,
            temp_min: _f.main.temp_min,
            temp_max: _f.main.temp_max,

            sunrise: '',
            sunset: '',

            date: fDate.getDate(),
            time: dateInfo['time'],
            weekday: dateInfo['weekday'],
            day: dateInfo['day'],
            monthLong: dateInfo['monthLong'],
            monthNum: dateInfo['monthNum']
          }
          return f
        });
      });
  }

  onSelectChange(_e: any) {
    this.ctrlSearch.value = '';
    let locName: string = _e.detail.value;
    if (locName != '') {
      let coords = this.cities.find(x => x.city_name == locName);
      this.getWeatherData(coords?.lat, coords?.lon, locName);
    }
  }

  onSearchInput(_e: any) {
    let locName: string = _e.target.value;
    if (locName != '') {
      this.weatherApi.getLatLon(locName).subscribe(
        (data: any) => {
          if (data.length != 0) {
            this.ctrlSelect.value = '';
            this.getWeatherData(data[0].lat, data[0].lon, data[0].name);
          }
          else {
            this.alert.create({
              header: 'Error',
              message: 'No Location Found',
              buttons: [{
                text:'OK',
                handler: () => {this.ctrlSearch.value = '';}
              }]
            }).then(res => res.present());
          }
        }
      );
    }
  }

  onSliderEnd(_e: any) {
    console.log('Test');
  }
}