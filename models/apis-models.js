const fs = require("fs/promises");

exports.selectApiDetails = () => {
    return fs.readFile(`${__dirname}/../endpoints.json`, "utf8").then((data)=> {
        const apiData = JSON.parse(data)
        return apiData
    })
}