import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

class City {
  constructor(public id: string, public name: string) {}
}

class HistoryService {
  private filePath = './db/db.json';

  private async read(): Promise<City[]> {
    const data = await fs.readFile(this.filePath, 'utf-8');
    return JSON.parse(data) as City[];
  }

  private async write(cities: City[]): Promise<void> {
    await fs.writeFile(this.filePath, JSON.stringify(cities, null, 2));
  }

  async getCities(): Promise<City[]> {
    return this.read();
  }

  async addCity(name: string): Promise<City> {
    const cities = await this.read();
    const city = new City(uuidv4(), name);
    cities.push(city);
    await this.write(cities);
    return city;
  }

  async removeCity(id: string): Promise<void> {
    let cities = await this.read();
    cities = cities.filter(city => city.id !== id);
    await this.write(cities);
  }
}

export default new HistoryService();
