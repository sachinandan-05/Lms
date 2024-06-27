import { Document,Model, Schema, model } from "mongoose";

interface IFqItems extends Document{
question:string,
answer:string
};

interface ICatogry extends Document{
    title:string
};

interface IBannerImage extends Document{
    public_id:string,
    url:string
};

interface ILayout extends Document{
    type:string,
    faq:IFqItems[];
    categories:ICatogry;
    banner:{
        image:IBannerImage,
        title:string,
        subtitle:string
    };

};

const faqSchema= new  Schema<IFqItems> ({
    question:{type:String},
    answer:{
        type:String
    },

});
const categorieSchema= new Schema <ICatogry>({
    title: {type:String}
});

const bannerIamgeSchema = new Schema <IBannerImage>({
    public_id:{type:String},
    url:{type:String}
});

const layoutSchema=new Schema <ILayout>({
    type:{type:String},
    faq:[faqSchema],
    categories:[categorieSchema],
    banner:{
        image:bannerIamgeSchema,
        title:{type:String},
        subtitle:{type:String}
    },
})

const layoutModel= model<ILayout>('Layout',layoutSchema);

export default layoutModel;