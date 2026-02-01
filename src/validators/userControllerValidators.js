import {body} from "express-validator"

const userRegistrationValidatot = () =>{
    return [
        body("username")
        .trim()
        .notEmpty().withMessage("Username is required")
        .isLength({min : 3 ,max : 15})
        .withMessage("Username must be between 3 and 15 characters"),

        body("email")
        .trim()
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Invalid  email format"),

        body("fullName")
        .trim()
        .notEmpty().withMessage("Full name is required")
        .isLength({min : 3})
        .withMessage("Full name must be at least 3 characters"),

        body("password")
        .notEmpty().withMessage("password is required")
        .isLength({min : 6})
        .withMessage("Passwod must be at least 6 characters long")
    ]
}

const userLoginValidator= () =>{
    return [
        body("username")
        .trim()
        .notEmpty().withMessage("UserName is required"),

        body("email")
        .trim()
        .notEmpty().withMessage("The email is required")
        .isEmail().withMessage("The email is not an email"),
        
        body("password")
        .trim()
        .notEmpty().withMessage("password is required")
    ]

}

const changeCurrentPasswordValidatot = () =>{
    return[
    body("oldPassword")
    .trim()
    .notEmpty().withMessage("Old password Field is required"),
    body("newPassword")
    .trim()
    .notEmpty().withMessage("The new Password Field is required")
    ]
}


export {
    userRegistrationValidatot,
     userLoginValidator,
     changeCurrentPasswordValidatot,
     



} 