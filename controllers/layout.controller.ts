import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import LayoutModel from "../models/layout.model";
import cloudinary from "cloudinary";

// create layout
export const createLayout = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type } = req.body;
      const isTypeExist = await LayoutModel.findOne({ type });
      if (isTypeExist) {
        return next(new ErrorHandler(`${type} already exist`, 400));
      }
      if (type === "Banner") {
        const { image, title, subTitle } = req.body;
        const myCloud = await cloudinary.v2.uploader.upload(image, {
          folder: "layout",
        });
        const banner = {
          type: "Banner",
          banner: {
            image: {
              public_id: myCloud.public_id,
              url: myCloud.secure_url,
            },
            title,
            subTitle,
          },
        };
        await LayoutModel.create(banner);
      }
      if (type === "FAQ") {
        const { faq } = req.body;
        console.log(faq);
        const faqItems = await Promise.all(
          faq.map(async (item: any) => {
            return {
              question: item.question,
              answer: item.answer,
            };
          })
        );
        console.log(faqItems);
        await LayoutModel.create({ type: "FAQ", faq: faqItems });
      }
      if (type === "Categories") {
        const { categories } = req.body;
        const categoriesItems = await Promise.all(
          categories.map(async (item: any) => {
            return {
              title: item.title,
            };
          })
        );
        await LayoutModel.create({
          type: "Categories",
          categories: categoriesItems,
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
      console.log("Edit layout request:", { type, body: req.body });
      
      if (type === "Banner") {
        const bannerData: any = await LayoutModel.findOne({ type: "Banner" });

        const { image, title, subTitle } = req.body;

        // Fix: Check if bannerData exists
        if (bannerData) {
          if (image) {
            const data = image.startsWith("https")
              ? bannerData
              : await cloudinary.v2.uploader.upload(image, {
                  folder: "layout",
                });

            const banner = {
              type: "Banner",
              banner: {
                image: {
                  public_id: image.startsWith("https")
                    ? bannerData.banner.image.public_id
                    : data?.public_id,
                  url: image.startsWith("https")
                    ? bannerData.banner.image.url
                    : data?.secure_url,
                },
                title,
                subTitle,
              },
            };

            await LayoutModel.findByIdAndUpdate(bannerData._id, { banner });
          } else {
            // Update only title and subTitle without changing image
            const banner = {
              type: "Banner",
              banner: {
                ...bannerData.banner,
                title,
                subTitle,
              },
            };

            await LayoutModel.findByIdAndUpdate(bannerData._id, { banner });
          }
        } else {
          // Create new Banner record if it doesn't exist
          const banner = {
            type: "Banner",
            banner: {
              image: {
                public_id: "",
                url: "",
              },
              title: title || "",
              subTitle: subTitle || "",
            },
          };

          await LayoutModel.create(banner);
        }
      }

      if (type === "FAQ") {
        const { faq } = req.body;
        console.log("Processing FAQ update:", faq);
        
        if (!Array.isArray(faq)) {
          return next(new ErrorHandler("FAQ data must be an array", 400));
        }
        
        // Find existing FAQ record
        let FaqItem = await LayoutModel.findOne({ type: "FAQ" });
        
        // Prepare FAQ items
        const faqItems = faq.map((item: any) => ({
          question: item.question || "",
          answer: item.answer || "",
        }));
        
        console.log("Processed FAQ items:", faqItems);
        
        if (FaqItem) {
          // Update existing FAQ record
          console.log("Updating existing FAQ record with ID:", FaqItem._id);
          const updatedFaq = await LayoutModel.findByIdAndUpdate(
            FaqItem._id, 
            {
              type: "FAQ",
              faq: faqItems,
            },
            { new: true }
          );
          console.log("Updated FAQ record:", updatedFaq);
        } else {
          // Create new FAQ record if it doesn't exist
          console.log("Creating new FAQ record");
          const newFaq = await LayoutModel.create({
            type: "FAQ",
            faq: faqItems,
          });
          console.log("Created new FAQ record:", newFaq);
        }
      }
      
      if (type === "Categories") {
        const { categories } = req.body;
        const categoriesData = await LayoutModel.findOne({
          type: "Categories",
        });
        const categoriesItems = await Promise.all(
          categories.map(async (item: any) => {
            return {
              title: item.title,
            };
          })
        );
        await LayoutModel.findByIdAndUpdate(categoriesData?._id, {
          type: "Categories",
          categories: categoriesItems,
        });
      }

      res.status(200).json({
        success: true,
        message: "Layout Updated successfully",
      });
    } catch (error: any) {
      console.log("Layout update error:", error);
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// get layout by type
export const getLayoutByType = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type } = req.params;
      console.log("Getting layout for type:", type);
      const layout = await LayoutModel.findOne({ type });
      console.log("Found layout:", layout);
      res.status(201).json({
        success: true,
        layout,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
