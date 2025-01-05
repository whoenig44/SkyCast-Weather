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
    return `${this.baseURL}/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&exclude=minutely,hourly,alerts&units=imperial&appid=${this.apiKey}`;
  }

  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const response = await axios.get(this.buildWeatherQuery(coordinates));
    return response.data;
  }

  async getWeatherForCity(city: string): Promise<any> {
    const locationData = await this.fetchLocationData(city);
    const coordinates = this.destructureLocationData(locationData);
    return this.fetchWeatherData(coordinates);
  }
}

export default new WeatherService();
