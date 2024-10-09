import express from 'express';
import { UserRoutes } from '../controllers/userRoutesController.js';
import { authMiddleWare } from '../middlewares/auth.js';

export const travelRoutes=express.Router();

travelRoutes.post('/add',authMiddleWare, UserRoutes.addRoute)
travelRoutes.get("/all-routes",authMiddleWare,UserRoutes.getAllRoutes)
travelRoutes.get("/getRecentRoutes",authMiddleWare,UserRoutes.getRecentRoutes)
travelRoutes.get("/places",UserRoutes.searchPlace)

// detail page routes
travelRoutes.post("/add-company",authMiddleWare,UserRoutes.addCompany)
travelRoutes.get("/all-details",authMiddleWare,UserRoutes.getDetails)
