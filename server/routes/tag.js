const { Router } = require("express")

const { default: tagController } = require("../controllers/tag")

const router = Router()
router.get("/all", tagController.getAllTags)

module.exports = router
