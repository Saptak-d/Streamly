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
        body("email").isEmail().withMessage("Email is not Valid"),
        body("password").notEmpty().withMessage("password cant be empty")
    ]

}

export {
    userRegistrationValidatot,
     userLoginValidator,
     



} 