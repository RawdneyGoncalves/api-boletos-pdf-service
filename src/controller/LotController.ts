import { injectable, inject } from 'inversify';
import { Request, Response } from 'express';
import { TYPES } from '../types/types.js';
import { LotService } from '../services/LotService.js';
import { ILot } from '../types/types.js';

@injectable()
export class LotController {
  constructor(
    @inject(TYPES.Services.LotService) private lotService: LotService
  ) {}

  async findAll(req: Request, res: Response): Promise<Response> {
    try {
      const lots = await this.lotService.findAll();
      return res.json(lots);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return res.status(500).json({ error: `Error retrieving lots: ${errorMessage}` });
    }
  }

  async findById(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseInt(req.params.id);
      const lot = await this.lotService.findById(id);
      
      if (!lot) {
        return res.status(404).json({ error: 'Lot not found' });
      }
      
      return res.json(lot);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return res.status(500).json({ error: `Error retrieving lot: ${errorMessage}` });
    }
  }

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const lotData: ILot = req.body;
      const newLot = await this.lotService.create(lotData);
      return res.status(201).json(newLot);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return res.status(500).json({ error: `Error creating lot: ${errorMessage}` });
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseInt(req.params.id);
      const lotData: Partial<ILot> = req.body;
      
      const success = await this.lotService.update(id, lotData);
      
      if (!success) {
        return res.status(404).json({ error: 'Lot not found or update failed' });
      }
      
      return res.json({ message: 'Lot updated successfully' });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return res.status(500).json({ error: `Error updating lot: ${errorMessage}` });
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseInt(req.params.id);
      const success = await this.lotService.delete(id);
      
      if (!success) {
        return res.status(404).json({ error: 'Lot not found or delete failed' });
      }
      
      return res.json({ message: 'Lot deleted successfully' });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return res.status(500).json({ error: `Error deleting lot: ${errorMessage}` });
    }
  }
}