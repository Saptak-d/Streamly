import { body } from "express-validator";
import {param} from "express-validator"
import {query} from "express-validator"

const publishAVideovideoValidator = ()=>{
    return[
        body("title")
        .trim()
        .notEmpty().withMessage("The Title Field is required")
        .isLength({min : 3 ,max : 50})
        .withMessage("The title sholud be at least 3 and maximum 15 characters "),

        body("description")
        .trim()
        .notEmpty().whitelist("The description is required"),

        body("isPublished")
        .notEmpty().withMessage("isPublished or not is required")
        .isBoolean().withMessage("isPublished must be true or false")
    ]
}

const getVideoByIdValidator = ()=>{
    
    return[
        param("videoId")
        .notEmpty().withMessage("Vide Id is required")
        .isMongoId().withMessage("Invalid videoId")
    ]
}

const updateVideoValidator = ()=>{
  return [
    param("videoId")
    .notEmpty().withMessage("videoId is required")
    .isMongoId().withMessage("Invalid videoId"),

    body("title")
    .optional()
    .trim()
    .isLength({min :  3 , max : 70})
    .withMessage("Title must be between 3 and 15 characters"),

    body("description")
    .optional()
    .trim()
    .isLength({min:3 , max :70})
    .withMessage("Description must be at least 5 characters")
  ]
}

const deleteVideoValidator = ()=>{
    return[
        param("videoId")
        .notEmpty().withMessage("viddeo ID is required ")
        .isMongoId().withMessage("Invalid videoId")
    ]
}
export{
    publishAVideovideoValidator,
    getVideoByIdValidator,
    updateVideoValidator,
    deleteVideoValidator,


}