import express, { Application } from "express";
import D2Processor from "./D2Processor";


const options: any = {
    ...process.env,
};
const app: Application = express();
const PORT = process.env.PORT || 8080;


app.use(express.json())
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


app.post("/code", async (req,res) => {
    console.log("HIT!!!")
    if (!req.body || !req.body.code) return res.send("Error: No code provided")
    const code:string = req.body.code
    const svgCode = await D2Processor.processInputString(code)
    res.send(svgCode)
})

app.listen(PORT, () => {
    console.log("Server is running on port", PORT);
});