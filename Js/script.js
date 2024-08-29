const ProductValues = {
    name: document.getElementById("ProductName"),
    price: document.getElementById("ProductPrice"),
    category: document.getElementById("ProductCate"),
    description: document.getElementById("ProductDesc"),
};

const products = JSON.parse(localStorage.getItem("products")) || [];
products.forEach((product, index) => display(index + 1, product));

const blackListWords = ["blacklsit1", "blacklsit2", "blacklsit3"];

function addProduct() {
    if (validateInputs() && validateBlackList()) {
        const product = {
            name: ProductValues.name.value,
            price: ProductValues.price.value,
            category: ProductValues.category.value,
            description: ProductValues.description.value,
        };
        products.push(product);
        localStorage.setItem("products", JSON.stringify(products));
        display(products.length, product);
        reset();
    }
}

function validateInputs() {
    let isValid = true;
    Object.values(ProductValues).forEach(input => {
        if (!input.value.trim()) {
            input.classList.add("is-invalid");
            isValid = false;
        } else {
            input.classList.remove("is-invalid");
        }
    });
    return isValid;
}

function validateBlackList() {
    let isValid = true;
    Object.values(ProductValues).forEach(input => {
        blackListWords.forEach(word => {
            if (input.value.toLowerCase().includes(word)) {
                input.classList.add("is-invalid");
                isValid = false;
            }
        });
    });
    return isValid;
}

function reset() {
    Object.values(ProductValues).forEach(input => {
        input.value = "";
        input.classList.remove("is-invalid");
    });
}

function display(index, { name, price, category, description }) {
    const content = `
        <tr>
            <td>${index}</td>
            <td>${name}</td>
            <td>${price}</td>
            <td>${category}</td>
            <td>${description}</td>
            <td><button class="btn btn-outline-warning" onclick="updateProduct('${name}')">Update</button></td>
            <td><button class="btn btn-outline-danger" onclick="deleteProduct('${name}')">Delete</button></td>
        </tr>
    `;
    document.getElementById("tbody").innerHTML += content;
}

function updateProduct(name) {
    const product = products.find(p => p.name === name);
    if (product) {
        Object.keys(ProductValues).forEach(key => ProductValues[key].value = product[key]);
        setButtons("Save Changes", () => saveChanges(name), "Cancel", cancelUpdate);
    }
}

function saveChanges(name) {
    if (validateInputs() && validateBlackList()) {
        const index = products.findIndex(p => p.name === name);
        if (index !== -1) {
            products[index] = {
                name: ProductValues.name.value,
                price: ProductValues.price.value,
                category: ProductValues.category.value,
                description: ProductValues.description.value,
            };
            localStorage.setItem("products", JSON.stringify(products));
            refreshDisplay();
            reset();
            resetButtons();
        }
    }
}

function cancelUpdate() {
    reset();
    resetButtons();
}

function resetButtons() {
    setButtons("AddProduct", addProduct, "Reset", reset);
}

function setButtons(mainText, mainAction, resetText, resetAction) {
    const mainBtn = document.getElementById("mainBtn");
    mainBtn.innerText = mainText;
    mainBtn.onclick = mainAction;

    const resetBtn = document.querySelector('button[type="reset"]');
    resetBtn.innerText = resetText;
    resetBtn.onclick = resetAction;
}

function deleteProduct(name) {
    const index = products.findIndex(p => p.name === name);
    if (index !== -1) {
        products.splice(index, 1);
        localStorage.setItem("products", JSON.stringify(products));
        refreshDisplay();
    }
}

function refreshDisplay() {
    document.getElementById("tbody").innerHTML = "";
    products.forEach((product, index) => display(index + 1, product));
}

document.getElementById("Search").addEventListener("input", function () {
    const searchTerm = this.value.toLowerCase();
    const filteredProducts = products.filter(product =>
        Object.values(product).some(value => value.toLowerCase().includes(searchTerm))
    );
    document.getElementById("tbody").innerHTML = "";
    filteredProducts.forEach((product, index) => display(index + 1, product));
});