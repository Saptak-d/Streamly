import {body} from "express-validator"
const userRegistrationValidatot = () =>{
    return [
        body('email')
        .trim()
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("email is invalid"),
        body("username")
        .trim()
        .notEmpty().withMessage("user name is required")
        .isLength({min:3}).withMessage("Username should be atleast  3 characters")
        .isLength({max:15}).withMessage("zuser name should be at 15 charcter max "),
    ]
}

const userLoginValidator= () =>{
    return [
        body("email").isEmail().withMessage("Email is not Valid"),
        body("password").notEmpty().withMessage("password cant be empty")
    ]

}

export {userRegistrationValidatot} 