import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import LayoutModel from "../models/layout.model";
import cloudinary from "cloudinary";

// Create layout
export const createLayout = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type } = req.body;

      // Prevent duplicate type
      const isTypeExist = await LayoutModel.findOne({ type });
      if (isTypeExist) {
        return next(new ErrorHandler(`${type} already exists`, 400));
      }

      if (type === "Banner") {
        const { image, title, subTitle } = req.body;

        let uploadedImage = { public_id: "", url: "" };
        if (image && !image.startsWith("https")) {
          const uploadResult = await cloudinary.v2.uploader.upload(image, {
            folder: "layout",
          });
          uploadedImage = {
            public_id: uploadResult.public_id,
            url: uploadResult.secure_url,
          };
        }

        const banner = {
          type: "Banner",
          banner: {
            image: uploadedImage,
            title: title || "",
            subTitle: subTitle || "",
          },
        };

        await LayoutModel.create(banner);
      }

      if (type === "FAQ") {
        const { faq } = req.body;
        if (!Array.isArray(faq)) {
          return next(new ErrorHandler("FAQ data must be an array", 400));
        }

        const faqItems = faq.map((item: any) => ({
          question: item.question || "",
          answer: item.answer || "",
        }));

        await LayoutModel.create({ type: "FAQ", faq: faqItems });
      }

      if (type === "Categories") {
        const { categories } = req.body;
        if (!Array.isArray(categories)) {
          return next(new ErrorHandler("Categories must be an array", 400));
        }

        const categoriesItems = categories.map((item: any) => ({
          title: item.title || ""
        }));

        await LayoutModel.create({ 
          type: "Categories", 
          categories: categoriesItems 
        });
      }

      res.status(200).json({
        success: true,
        message: "Layout created successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Edit layout
export const editLayout = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type } = req.body;

      if (type === "Banner") {
        const bannerData: any = await LayoutModel.findOne({ type: "Banner" });
        const { image, title, subTitle } = req.body;

        if (bannerData) {
          // Update image if new one provided
          if (image && !image.startsWith("https")) {
            const uploadResult = await cloudinary.v2.uploader.upload(image, {
              folder: "layout",
            });
            bannerData.banner.image = {
              public_id: uploadResult.public_id,
              url: uploadResult.secure_url,
            };
          }

          // Update text fields
          if (title !== undefined) bannerData.banner.title = title;
          if (subTitle !== undefined) bannerData.banner.subTitle = subTitle;

          await bannerData.save();

          return res.status(200).json({
            success: true,
            message: "Banner updated successfully",
            banner: bannerData,
          });
        } else {
          // Create new banner if none exists
          const newBanner = {
            type: "Banner",
            banner: {
              image: { public_id: "", url: "" },
              title: title || "",
              subTitle: subTitle || "",
            },
          };
          const created = await LayoutModel.create(newBanner);

          return res.status(200).json({
            success: true,
            message: "Banner created successfully",
            banner: created,
          });
        }
      }

      if (type === "FAQ") {
        const { faq } = req.body;
        if (!Array.isArray(faq)) {
          return next(new ErrorHandler("FAQ data must be an array", 400));
        }

        const faqItems = faq.map((item: any) => ({
          question: item.question || "",
          answer: item.answer || ""
        }));

        let layout = await LayoutModel.findOne({ type: "FAQ" });
        if (layout) {
          layout.faq = []; // Clear existing FAQ items
          faqItems.forEach(item => layout?.faq.push(item as any));
          await layout.save();
        } else {
          await LayoutModel.create({ 
            type: "FAQ", 
            faq: faqItems 
          });
        }
      }

      if (type === "Categories") {
        const { categories } = req.body;
        if (!Array.isArray(categories)) {
          return next(new ErrorHandler("Categories must be an array", 400));
        }

        const categoriesItems = categories.map((item: any) => ({
          title: item.title || ""
        }));

        let categoriesData = await LayoutModel.findOne({ type: "Categories" });
        if (categoriesData) {
          categoriesData.categories = []; // Clear existing categories
          categoriesItems.forEach(item => categoriesData?.categories.push(item as any));
          await categoriesData.save();
        } else {
          await LayoutModel.create({ 
            type: "Categories", 
            categories: categoriesItems 
          });
        }
      }

      res.status(200).json({
        success: true,
        message: "Layout updated successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Get layout by type
export const getLayoutByType = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type } = req.params;
      const layout = await LayoutModel.findOne({ type });

      if (!layout) {
        return next(new ErrorHandler(`${type} layout not found`, 404));
      }

      res.status(200).json({
        success: true,
        layout,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
