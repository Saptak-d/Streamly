import { body } from "express-validator";
import { isBoolean } from "util";
import { isBooleanObject } from "util/types";

const videoValidator = ()=>{
    return[
        body("title")
        .trim()
        .notEmpty().withMessage("The Title Field is required")
        .isLength({min : 3 ,max : 15})
        .withMessage("The title sholud be at least 3 and maximum 15 characters "),

        body("description")
        .trim()
        .notEmpty().whitelist("The description is required"),

        body("isPublished")
        .notEmpty().withMessage("isPublished or not is required")
        .isBoolean().withMessage("isPublished must be true or false")
    ]
}