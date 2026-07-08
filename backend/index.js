let express = require("express")
let cors=require("cors")
require("dotenv").config()
const { GoogleGenerativeAI } = require("@google/generative-ai");

let App=express();

App.use(cors())//middleware
App.use(express.json())

const genAI = new GoogleGenerativeAI(process.env.KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash"
});

App.post('/ask', async (req, res) => {
    try {
        console.log("Question:", req.body.question);

        const result = await model.generateContent(req.body.question);

        console.log("Response received");

        res.send({
            _status:true,
            _message:"Content found..",
            answer: result.response.text()
        });

    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});
const PORT = process.env.PORT || 4000;



App.listen(process.env.PORT,()=>{
    console.log(`Server is started at ${PORT}`);
})
