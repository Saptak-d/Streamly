import Mailgen from "mailgen";
import nodemailer from "nodemailer"
import { ApiError } from "./ApiErrors.js";

const sendMail = async (options)=>{

    // Configure mailgen
     const mailGenerator = new Mailgen({
        theme: 'default',
        product: {
        name: 'Streamly',
        link: 'https://mailgen.js/'
       }
   });


   let emailText = mailGenerator.generatePlaintext(options.mailGenContent);
   let emailBody  = mailGenerator.generate(options.mailGenContent)// Generate an HTML email with the provided contents

   // Create a transporter using Ethereal test credentials.
 // For production, replace with your actual SMTP server details.
  const transporter = nodemailer.createTransport({
   host: process.env.MAILTRAP_SMTP_HOST,
   port: process.env.MAILTRAP_SMTP_PORT,
   secure: false, // Use true for port 465, false for port 587
   auth: {
     user: process.env.MAILTRAP_SMTP_USER,
     pass:  process.env.MAILTRAP_SMTP_PASS
   },
});

 const mail = {
    from: 'maddison53@ethereal.email',//sender address
    to: options.email,
    subject: options.subject,
    text: emailText, // Plain-text version of the message
    html: emailBody,
 }

  try {
     const result = await transporter.sendMail(mail)
     return result;
  } catch (error) {
     console.error("Emailed failed ")
     throw new ApiError(500,"internal server error",error)
  }

}

const  emailVerificationMailGenContent = (username,verificationUrl)=>{
    return {
        body : {
        name: username,
        intro: 'Welcome to Streamly',
        action: {
            instructions: 'To get started with Streamly , please click here:',
            button: {
                color: '#22BC66', // Optional action button color
                text: 'Confirm your account',
                link: verificationUrl,
            }   
        },
        outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
        }
    }
}

const  forgotPasswordMailGenCOntent = (username,passwordResetUrl)=>{
    return {
        body : {
        name: username,
        intro: 'Streamly Reset-password',
        action: {
            instructions: 'To change the password Plese click the Button',
            button: {
                color: '#45db65ff', // Optional action button color
                text: 'Change  Password',
                link: passwordResetUrl,
            }   
        },
        outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
        }
    }
}
export{
    sendMail,
    forgotPasswordMailGenCOntent,
    
}



//structure of calling the function write it for late  
// sendMail({
//     email : user.email,
//     subject : "aaa",
//     mailGenContent : emailVerificationMailGenContent(username, ` url `)

// })