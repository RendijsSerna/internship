import * as express from "express";
import {Application} from "express";
import * as multer from "multer";
import {ApiResponse} from "./interfaces/APIResponse";
import * as fs from "fs";

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true}));

const upload = multer();

const cacheDir = "./cache";
if(!fs.existsSync(cacheDir)){
    fs.mkdirSync(cacheDir);
}

app.post('/calculate_stats', upload.single('file'), async (
    req,
    res    )  => {
    try{

        const species = req.body.species ;

        if (!species){
            throw new Error("provide 'species' parameter");
        }

        if(!req.file){
            throw new Error("provide dataset file");
        }

        const cacheKey = `${species}_${req.file.originalname}`;
        const cacheFilePath = `${cacheDir}/${cacheKey}.json`;

        if (fs.existsSync(cacheFilePath)){
            const cachedData = JSON.parse(fs.readFileSync(cacheFilePath, 'utf8'));
        }

        const dataset = JSON.parse(req.file.buffer.toString());
        const filteredData = dataset.filter((item: any) => item.species === species);


        if (filteredData.length === 0){
            throw  new Error("No species inserted")
        }
        const propertyNames = ['sepalWidth', 'sepalLength', 'petalWidth', 'petalLength'];

        const dataArray = propertyNames.map((propertyName) => filteredData.map((item: any) => item[propertyName]));

        const response: ApiResponse = {
            success: true,
            payload: {
                sepalWidth: calculateStats(dataArray[0]),
                sepalLength: calculateStats(dataArray[1]),
                petalWidth: calculateStats(dataArray[2]),
                petalLength: calculateStats(dataArray[3]),
            },
        };

        fs.writeFileSync(cacheFilePath, JSON.stringify(response));
        res.json(response);
    }

    catch (error){
        res.status(400).json({error: error.message, isSuccess: false});
    }


});
function calculateStats(data: any[]) {
    if (data.length === 0) {
        throw new Error("Data is empty");
    }
    let sum = data.reduce((acc, val) => acc + val, 0);
    let avg = sum / data.length;

    let min = data[0];
    let max = data[0];

    for (let i = 1; i < data.length; i++) {
        if (data[i] < min) {
            min = data[i];
        }
        if (data[i] > max) {
            max = data[i];
        }
    }

    return {
        avg,
        min,
        max,
    };
}

app.listen(
    8002,
    () => {
        console.log('Server started http://localhost:8002');
    }
)