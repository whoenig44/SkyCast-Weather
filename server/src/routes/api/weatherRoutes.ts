import { Router, type Request, type Response } from 'express';
import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  const { cityName } = req.body;
  if (!cityName) {
    return res.status(400).json({ error: 'City name is required' });
  }

  const weatherData = await WeatherService.getWeatherForCity(cityName);
  await HistoryService.addCity(cityName);
  res.json(weatherData);
});

router.get('/history', async (req: Request, res: Response) => {
  const cities = await HistoryService.getCities();
  res.json(cities);
});

router.delete('/history/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  await HistoryService.removeCity(id);
  res.status(204).send();
});

export default router;
