import dotenv from 'dotenv';
dotenv.config();
import axios from 'axios';

interface Coordinates {
  lat: number;
  lon: number;
}

class WeatherService {
  private baseURL = process.env.API_BASE_URL;
  private apiKey = process.env.API_KEY;

  private async fetchLocationData(query: string): Promise<any> {
    const response = await axios.get(`${this.baseURL}/geo/1.0/direct`, {
      params: {
        q: query,
        limit: 1,
        appid: this.apiKey,
      },
    });
    return response.data[0];
  }

  private destructureLocationData(locationData: any): Coordinates {
    return {
      lat: locationData.lat,
      lon: locationData.lon,
    };
  }

  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&exclude=minutely,hourly,alerts&units=imperial&appid=${this.apiKey}`;
  }

  private buildForecastQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&exclude=minutely,hourly,alerts&units=imperial&appid=${this.apiKey}`;
  }
  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const response = await axios.get(this.buildWeatherQuery(coordinates));
    return response.data;
  }
  private async fetchForecastData(coordinates: Coordinates): Promise<any> {
    const response = await axios.get(this.buildForecastQuery(coordinates));
    return response.data;
  }

  async getWeatherForCity(city: string): Promise<any> {
    const locationData = await this.fetchLocationData(city);
    const coordinates = this.destructureLocationData(locationData);
    const originalData = await this.fetchWeatherData(coordinates);
    const originalForecastData = await this.fetchForecastData(coordinates);
    // const { city, date, icon, iconDescription, tempF, windSpeed, humidity } =
    const modifiedData = {
      city: originalData.name,
      date: new Date(originalData.dt * 1000).toLocaleDateString(),
      icon: originalData.weather[0].icon,
      iconDescription: originalData.weather[0].description,
      tempF: originalData.main.temp,
      windSpeed: originalData.wind.speed,
      humidity: originalData.main.humidity,
    }
    const filteredData = originalForecastData.list.filter((item: any) => {
      return item.dt_txt.includes("12:00:00");
    })
    const modifiedForecastData = filteredData.map((item: any) => ({
      date: new Date(item.dt * 1000).toLocaleDateString(),
      icon: item.weather[0].icon,
      iconDescription: item.weather[0].description,
      tempF: item.main.temp,
      windSpeed: item.wind.speed,
      humidity: item.main.humidity,
    }));
    const weatherArray = [
    modifiedData,
    ...modifiedForecastData  
  ]
    return weatherArray;
  }
}

export default new WeatherService();
