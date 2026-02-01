import { Router } from "express";
import { loginUser,
registerUser,
 logOutUser,
 refreshAccessToken,
changeCurrentPassword,
getCurrentUser,
updateAccountDetails,
updateUserAvatar,
updateUserCoverImage,
getUserChannelProfile,
getWatchHistory
 } from "../controller/user.controller.js";
import {upload} from "../middleware/multer.middleware.js"
import { verifyJwt } from "../middleware/auth.middleware.js";
import {userRegistrationValidatot, 
        userLoginValidator,
        changeCurrentPasswordValidatot,

    
    
    } from "../validators/userControllerValidators.js"
import {validate} from "../middleware/validator.middleware.js"


const router = Router();
router.route("/register").post(
    upload.fields([
        {
            name     : "avatar",
            maxCount : 1
        },
        {
            name     : "coverImage",
            maxCount : 1
        }
    
    ]),
    userRegistrationValidatot(),
    validate,
    registerUser)

router.route("/login").post(userLoginValidator(),validate,loginUser)

//secured Routes 
router.route("/logout").post(verifyJwt,logOutUser)
router.route("/refreshAccessToken").post(refreshAccessToken)
router.route("/change-password").post(verifyJwt,changeCurrentPasswordValidatot(),validate,changeCurrentPassword)
router.route("/current-user").get(verifyJwt ,getCurrentUser)
router.route("/update-account").patch(verifyJwt , updateAccountDetails)
router.route("/update-avatar").patch(verifyJwt ,upload.single("avatar"), updateUserAvatar )
router.route("/update-coverImage").patch(verifyJwt,upload.single("coverImage"),updateUserCoverImage)
router.route("/UserChannelProfile/:userName").get(verifyJwt,getUserChannelProfile)
router.route("/watch-history").get(verifyJwt,getWatchHistory)





 export  default router