import mongoose, { Document, Schema, Model } from "mongoose";

interface IComments extends Document {
    user: object,
    comment: string,
    commentReplies?: IComments[]
}

interface IReview extends Document {
    user: object,
    comment: string,
    rating: number,
    commentReplies: IComments[]

}
interface ILink extends Document {
    title: string,
    url: string
}
interface ICourseData extends Document {
    title: string,
    description: string,
    videoUrl: string,
    videoThumbNail: object,
    videoSection: string,
    videoLenth: number,
    videoPlayer: string,
    videoLink: ILink[],
    suggestions: string,
    questions: IComments[]
}

export interface ICourse extends Document {
    name: string,
    description: string,
    price: number,
    estimatedPrice?: number,
    thumbNail: object,
    tags: string,
    level: string,
    demoUrl: string,
    benifits: { title: string }[],
    review: IReview[],
    courseData: ICourseData[],
    rating?: number,
    purchased?: number,
    prerequisites: { title: string }[]
}

const reviewSchema = new Schema<IReview>({
    user: Object,
    rating: {
        type: Number,
        default: 0
    },
    comment: String

});

const linkSchema = new Schema<ILink>({
    title: {
        type: String,
        url: String,
    }
});

const commentSchema = new Schema<IComments>({
    user: Object,
    comment: String,
    commentReplies: [Object]

});

const courseDataSchema = new Schema<ICourseData>({
    videoUrl: String,
    videoLenth: Number,
    title: String,
    videoSection: String,
    description: String,
    videoLink: [linkSchema],
    suggestions: String,
    questions: [commentSchema]
});

const courseSchema = new Schema<ICourse>({
    name: {
        type: String,
        required: true,

    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    estimatedPrice: {
        type: Number,
    },
    thumbNail: {
        public_id: {
            // required: true, 
            type: String
        },
        url: {
            type: String,
            required: true
        }
    },
    tags: {
        type: String,
        required: true
    },
    level: {
        type: String,
        required: true,
    },
    demoUrl: {
        type: String,
        required: true
    },
    benifits: [{ title: String }],
    prerequisites: [{ title: String }],
    review: [reviewSchema],
    courseData: [courseDataSchema],
    rating: {
        type: Number,
        default: 0
    },
    purchased: {
        type: Number,
        default: 0

    }
});

const courseModel:Model<ICourse>=mongoose.model("Course",courseSchema);

export default courseModel;
