import mongoose,{Document,Schema,Model} from "mongoose";


export interface INotification extends Document{
    title:string;
    message:string;
    status:string;
    userId:string;
}

const notificationSchema:Schema<INotification>=new mongoose.Schema({
    title:{
        type:String,
        required:true

    },
    status:{
        type:String,
        default:"unread",
        // required:true

    },
    userId:{
        type:String,
        required:true

    },
    message:{
        type:String,
        required:true
    },
    


},{timestamps:true});

const notificationModel:Model<INotification>=mongoose.model("Notification",notificationSchema);
export default notificationModel;
