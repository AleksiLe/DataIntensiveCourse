
let db = "eu";
let collection = "products";

function showEU() {
    db = "eu";
    getData(db, collection).then(data => printData(data));
}

function showNA() {
    db = "na";
    getData(db, collection).then(data => printData(data));
}

function showAsia() {
    db = "asia";
    getData(db, collection).then(data => printData(data));
}

function showCustomers() {
    collection = "customers";
    getData(db, collection).then(data => printData(data));
}

function showProducts() {
    collection = "products";
    getData(db, collection).then(data => printData(data));
}

function showOrders() {
    collection = "orders";
    getData(db, collection).then(data => printData(data));
}

function showSellers() {
    collection = "sellers";
    getData(db, collection).then(data => printData(data));
}

async function getData(db, collection) {
    try {
        const response = await fetch(`/${db}/${collection}`)
        const data = await response.json();
        return data; 
    } catch (error) {
        console.log(error);
    }

}

const output = document.getElementById("output");
function printData(data) {
    output.innerHTML = '';
    const ul = document.createElement("ul");
    data.forEach(item => {
        const li = document.createElement("li");
        li.textContent = JSON.stringify(item);
        ul.appendChild(li);
    });
    output.appendChild(ul);
}