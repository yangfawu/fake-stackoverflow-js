const { Router } = require("express")

const { default: questionController } = require("../controllers/question")

const router = Router()
router.get("/all", questionController.getAllQuestions)
router.post("/new", questionController.createNewQuestion)
router.get("/:qid", questionController.getSpecificQuestion)
router.post("/:qid/answer", questionController.addAnswer)

module.exports = router
