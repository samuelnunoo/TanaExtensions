import { exec } from "child_process";
export default class D2Processor {
    public static async processInputString(input:string) {
        await D2Processor.writeInputToFile(input)
        await D2Processor.createSVG()
        return D2Processor.getSVG()
    }
    private static async getSVG() {
        return new Promise((resolve,reject) => {
            exec('cat d2file.svg', (error,stdout,stderr) => {
                if (error) reject(error.message)
                resolve(stdout)
            })
        })
    }
    private static async createSVG() {
        return new Promise((resolve,reject) => {
            exec(`d2 d2file.d2`, (error,stdout,stderr) => {
                if (error) reject(error.message)
                resolve(stdout)
            })
        })
    }
    private static async writeInputToFile(input:string) {
        return new Promise((resolve,reject) => {
            exec(`echo "${input}" > d2file.d2`,(error,stdout,stderr) => {
                if (error) reject(error.message)
                resolve(stdout)
            })
        })
    }
}