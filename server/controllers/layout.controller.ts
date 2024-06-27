import { Response, Request, NextFunction } from "express";
import layoutModel from "../models/layout.model";
import { catchAsyncError } from "../utils/catchAsyncError";
import errorHandler from "../utils/errorHandler";
import cloudinary from "cloudinary";

// ----------------------------------------create_Layout--------------------------------------------

export const createLayout = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { type } = req.body;

        if (type === "Banner") {
            const { image, title, subtitle } = req.body;
            const myCloud = await cloudinary.v2.uploader.upload(image, { folder: "layout" });

            const banner = {
                image: {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url
                },
                title,
                subtitle
            };
            await layoutModel.create(banner);
        }

        if (type === "FAQ") {
            const { faq } = req.body;
            const faqItems = await Promise.all(
                faq.map(async (item: any) => {
                    return {
                        question: item.question,
                        answer: item.answer
                    }
                })
            )
            await layoutModel.create({
                type: "FAQ", faq: faqItems
            })
        }


        if (type === "categories") {
            const { categories } = req.body;
            const categoriesItem = await Promise.all(
                categories.map(async (item: any) => {
                    return {
                        title: item.title
                    }
                })
            );
            await layoutModel.create({ type: "Categories", categories: categoriesItem });
        }

        res.status(200).json({
            success: true,
            message: "Layout created successfully!!"
        });
    } catch (error: any) {
        return next(new errorHandler(error.message, 500));
    }
});

// --------------------------------------edit layout----------------------------------

export const editalayout = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { type } = req.body;

        if (type === "Banner") {
            const bannerData: any = await layoutModel.findOne({ type: "Banner" })
            const { image, title, subtitle } = req.body;
            if (bannerData) {
                await cloudinary.v2.uploader.destroy(bannerData.image.public_id);

            };
            const myCloud = await cloudinary.v2.uploader.upload(image, { folder: "layout" });

            const banner = {
                image: {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url
                },
                title,
                subtitle
            };
            await layoutModel.findByIdAndUpdate(bannerData.id, { banner });
        }

        if (type === "FAQ") {
            const { faq } = req.body;
            const faqItem = await layoutModel.findOne({ type: "FAQ" });
            const faqItems = await Promise.all(
                faq.map(async (item: any) => {
                    return {
                        question: item.question,
                        answer: item.answer
                    }
                })
            )
            await layoutModel.findByIdAndUpdate(faqItem?.id,{
                type: "FAQ", faq: faqItems
            })
        }


        if (type === "Categories") {
            const { categories } = req.body;
            const categorie = await layoutModel.findOne({ type: "Categories" })
            const categoriesItem = await Promise.all(
                categories.map(async (item: any) => {
                    return {
                        title: item.title
                    }
                })
            );
            await layoutModel.findByIdAndUpdate(categorie?.id, { type: "Categories", categories: categoriesItem });
        }

        res.status(200).json({
            success: true,
            message: "Layout updated successfully!!"
        });
    } catch (error: any) {
        return next(new errorHandler(error.message, 500))

    }
})
// ------------------------------get layout by type--------------------------------------

export const getLayoutType=catchAsyncError(async(req:Request, res:Response, next:NextFunction)=>{
    try {
        const { type } =req.body;
        const layout=await layoutModel.findOne({type});

        res.status(200).json({
            success:true,
            layout
        })
        
    } catch (error:any) {

        
    }
})