import { body } from "express-validator";

export const healthcheckValidator = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("username is required"),

  body("password")
    .notEmpty()
    .withMessage("password is required")
];
