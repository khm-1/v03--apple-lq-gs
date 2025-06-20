import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertStockSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get portfolio data
  app.get("/api/portfolio/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const portfolio = await storage.getPortfolio(userId);
      
      if (!portfolio) {
        return res.status(404).json({ message: "Portfolio not found" });
      }
      
      res.json(portfolio);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch portfolio" });
    }
  });

  // Get all stocks
  app.get("/api/stocks", async (req, res) => {
    try {
      const stocks = await storage.getAllStocks();
      res.json(stocks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stocks" });
    }
  });

  // Get user transactions
  app.get("/api/transactions/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const transactions = await storage.getTransactions(userId);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  // Add new stock to watchlist
  app.post("/api/stocks", async (req, res) => {
    try {
      const result = insertStockSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid stock data", errors: result.error.errors });
      }
      
      const stock = await storage.createStock(result.data);
      res.status(201).json(stock);
    } catch (error) {
      res.status(500).json({ message: "Failed to create stock" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
