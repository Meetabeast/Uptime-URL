const { default: axios  } = require("axios");
const Table = require("cli-table");
const chalk = require("chalk");

var table = new Table({
    head: [chalk.white('Status:'), chalk.white('Status text:'), chalk.white('URL:')],
    colWidths: [50, 50, 75]
});

let urlsObject = [];

function isValidURL(url) {
    const regex = /^(?:\w+:)?\/\/([^\s\.]+\.\S{2}|localhost[\:?\d]*)\S*$/;
    return regex.test(url);
}

class Uptime {
    constructor({
        urls,
    }) {
        this.urls = urls;
    }

    async checkURLS() {
        this.urls.map(c => {
            if(isValidURL(c) == false) {
                throw new Error("An error has occurred, please enter a correct URL.")
            }
        });

        try {
            const results = await Promise.all(
                this.urls.map(url => axios.get(url).catch(err => err))
            );
    
            results.forEach((result, index) => {
                let status = "";
                let statusText = "";
    
                if(result.status = 200) {
                    status = chalk.green(result.status)
                } else if(result.status = 404) {
                    status = chalk.red(result.status)
                } else {
                    status = chalk.red(result.status)
                }
    
                statusText = result.statusText || "Error";
    
                let urlsObjectArray = {
                    status: status ?? results.status,
                    statusText: statusText || 404,
                    url: this.urls[index]
                }
    
                urlsObject.push(urlsObjectArray)
            })
        } catch (error) {
            urlsObject.push("Error")
        }
    
        let newArray = change(urlsObject, ["Error", 404])
        newArray.forEach(data => {
    
            table.push(
                [data.status, data.statusText, data.url]
            )
        });
    
        console.log(table.toString())
    }
}

function change(oldArray, [itemName, status]) {
    let newArray = JSON.parse(JSON.stringify(oldArray));
    (newArray.find(({statusText}) => statusText === itemName) || {}).status = chalk.red(status);
    return newArray
}

module.exports = Uptime;