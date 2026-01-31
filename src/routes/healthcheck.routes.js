import { Router } from "express";
import {healthcheck,healthcheckInputCheck} from "../controller/healthcheck.controller.js"
import { validate} from "../middleware/validator.middleware.js"
import {userRegistrationValidatot} from "../validators/userControllerValidators.js"
import {healthcheckValidator} from "../validators/healthcheck.validator.js"

const router = Router()

router.route("/").get(userRegistrationValidatot(),validate,healthcheck)
router.route("/healthInputCheck").post(healthcheckValidator,validate,healthcheckInputCheck);


 export default router;
