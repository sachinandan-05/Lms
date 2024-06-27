import express from "express";
import { createLayout, editalayout, getLayoutType } from "../controllers/layout.controller";
import { authorizedRole, isAuthenticated } from "../middleware/auth.middleware";


const layoutRoute= express.Router();

layoutRoute.post("/create-layout",isAuthenticated as any, authorizedRole("admin"), createLayout as any);
layoutRoute.put("/edit-layout",isAuthenticated as any, authorizedRole("admin"), editalayout as any);
layoutRoute.get("/get-layout", getLayoutType as any);

export default layoutRoute ;