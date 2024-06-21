import nodemailer from "nodemailer"
import dotenv  from "dotenv"
import ejs from "ejs"
import path from "path"
import { Transporter } from "nodemailer"
dotenv.config()

interface IemailOption{
    email:string,
    subject:string,
    template:string,
    data:{[key:string]:any}
}
const sendMail=async(options:IemailOption):Promise<void>=>{
    const transporter:Transporter=nodemailer.createTransport({
       host:process.env.SMPT_HOST,
       port: parseInt(process.env.SMPT_PORT || '465') ,
       service:process.env.SMPT_SERVICE,
       auth:{
        user:process.env.SMPT_MAIL,
        pass:process.env.SMPT_PASSWORD
       }
    })

    const {email,subject,template,data}=options

    // console.log("options",options)
    // get the path of email template file
 

    const templatePath= path.join(__dirname,"../mails",template)
    // render the email templates with ejs
console.log("temppatha",templatePath)
    // console.log("tempfilelocation",templatePath)
    const html:string =await ejs.renderFile(templatePath,data)

   
    const mailsOption={
        from:process.env.SMPT_MAIL,
        to:email,
        subject,
        html
    }
    await transporter.sendMail(mailsOption)
}


// ativate user





export default sendMail;