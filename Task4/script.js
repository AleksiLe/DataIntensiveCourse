async function getData(db, mode) {
    try {
        const response = await fetch(`/${db}/${mode}`);
        const data = await response.json();
        return data; 
    } catch (error) {
        console.log(error);
    }
}

async function postData(db, mode, data) {
    try {
        console.log(data)
        const response = await fetch(`/${db}/${mode}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        return result;
    } catch (error) {
        console.log(error);
    }
}

function handleButtonClick() {
    const mode = document.getElementById('mode').value;
    const database = document.getElementById('database').value;

    if (mode !== "read" && database === "both") {
        alert("Only read function supports both databases");
        return;
    }

    if (mode === "read") {
        getData(database, mode).then(data => {
            printData(data);
        });
    } else {
        let data = {};
        if (mode === "insert") {
            const name = prompt('Enter name to insert:');
            data = { name: name };
        } else if (mode === "modify") {
            const id = prompt('Enter id to modify:');
            const name = prompt('Enter new name:');
            data = { id: parseInt(id), name: name };
        } else if (mode === "delete") {
            const id = prompt('Enter id to delete:');
            data = { id: parseInt(id) };
        }

        /* try {   
            data = JSON.parse(data);
        } catch (error) {
            alert("Invalid JSON format");
            return;
        } */
       console.log(data)
        postData(database, mode, data).then(result => {
            alert(`Operation ${mode} completed: ${JSON.stringify(result)}`);
        });
    }
}

function printData(data) {
    const output = document.getElementById("output");
    output.innerHTML = '';

    const ul = document.createElement("ul");
    data.forEach(item => {
        const li = document.createElement("li");
        li.textContent = JSON.stringify(item);
        ul.appendChild(li);
    });
    output.appendChild(ul);
}
