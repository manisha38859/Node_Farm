const fs = require('fs');
const http = require('http');
const url = require('url');


////////////////////////////////////////////////////////////////////////////////////////
///  FILES

//Reading files synchronously/blocking

// const textIn = fs.readFileSync('./starter/txt/input.txt','utf-8');
// console.log(textIn);
// const textOut = `This is what we know about avocado:  ${textIn} created on  ${Date.now()} .`;
// fs.writeFileSync('./starter/txt/output.txt',textOut);


//Reading files asynchorously/non-blocking

// fs.readFile('./starter/txt/startttt.txt', 'utf-8' , (err,data1) => {
//     if(err){
//         console.log('ERROR! ');
//     }
//     fs.readFile(`./starter/txt/${data1}.txt`, 'utf-8' , (err,data2) => {
//         console.log(data2);
//         fs.readFile('./starter/txt/append.txt', 'utf-8' , (err,data3) => {
//             console.log(data3);
//             fs.writeFile('./starter/txt/final.txt', `${data2} \n ${data3}.` , 'utf-8', err => {
//                 console.log('Files have been written');
//             })
//         });
//     });
// });
// console.log('Will Read File');


////////////////////////////////////////////////////////////////////////////////////////
///  SERVER

const replaceTemplate = (temp,product) => {
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%FROM%}/g, product.from);
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);
    output = output.replace(/{%DESCRIPTION%}/g, product.description);
    output = output.replace(/{%ID%}/g, product.id);
    if(!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
    return output;
}
const tempOverview = fs.readFileSync(`${__dirname}/final/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/final/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/final/templates/template-product.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/final/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

//Creating the server

const server = http.createServer((req,res) => {

    const { query , pathname } = (url.parse(req.url,true));

    // OVERVIEW PAGE
    if( pathname === '/'  ||   pathname === '/overview'){
        res.writeHead(200, {'content-type': 'text.html'});
        const cardHtml = dataObj.map(el => replaceTemplate(tempCard,el)).join(' ');  //dataObj.map(el => replaceTemplate(tempCard,el)): This part is using the map function on the dataObj array. The map function iterates over each element (el) in the dataObj array and applies a function to each element. In this case, the function being applied is replaceTemplate(tempCard, el). This function likely replaces some placeholders in tempCard with values from el.
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardHtml);  //.replace('{%PRODUCT_CARDS%}', cardHtml): This is a method called on the tempOverview string. It replaces all occurrences of {%PRODUCT_CARDS%} within tempOverview with the value of the cardHtml variable.
    // {%PRODUCT_CARDS%}: This is a placeholder or token in the tempOverview string. It's being used as a marker to indicate where the product cards should be inserted.
    // cardHtml: This is likely a string containing HTML code for product cards. It's the content that will replace the {%PRODUCT_CARDS%} placeholder in tempOverview.
        res.end(output);

    // PRODUCT PAGE
    }else if(pathname === '/product'){
        // console.log(query);
        // res.end('This is PRODUCT');
        res.writeHead(200, {'cintent-type': 'text.html'});
        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct,product);
        res.end(output); 

    // API PAGE
    }else if(pathname === '/api'){
            res.writeHead(200, {'content-type': 'application/json'});
            res.end(data);

    // NOT FOUNT PAGE
    }else{
        res.writeHead(404, {
            'content-type': 'text/html',
            'my-own-header': 'Hello-World'
        });
        res.end('<h1>Page Could Not Be Found</h1>');
    }
});

//Listening to the port

server.listen(8000, '127.0.0.1' , () => {
    console.log('Listening to the requests on port 8000 ');
});