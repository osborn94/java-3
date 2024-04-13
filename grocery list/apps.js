// SELECT ITEMS
const alert = document.querySelector('.alert');
const form = document.querySelector('.grocery-form');
const grocery = document.getElementById('grocery');
const submitBtn = document.querySelector('.submit-btn');
const container = document.querySelector('.grocery-container');
const list = document.querySelector('.grocery-list');
const clearBtn = document.querySelector('.clear-btn');

// Edit option
let editElement;
let editFlag = false;
let editID = "";

// EVENT LISTENERS
// Submit form
form.addEventListener('submit', addItem);
// Clear items
clearBtn.addEventListener('click', clearItems);

// Load items from local storage on page load
document.addEventListener('DOMContentLoaded', () => {
    const storedItems = getFromLocalStorage();
    if (storedItems) {
        storedItems.forEach((item) => createListItem(item.id, item.value));
    }
});

// FUNCTIONS
function addItem(e) {
    e.preventDefault();
    const value = grocery.value.trim();
    if (value && !editFlag) {
        const id = new Date().getTime().toString();
        createListItem(id, value);
        displayAlert("Item added to the list", "success");
        container.classList.add("show-container");
        addToLocalStorage(id, value);
        clearInput();
    } else if (value && editFlag) {
        editElement.querySelector(".title").textContent = value;
        displayAlert("Item updated", "success");
        updateLocalStorage(editID, value);
        clearInput();
        setInitial();
    } else {
        displayAlert("Please enter a valid value", "danger");
    }
}

function createListItem(id, value) {
    const element = document.createElement('article');
    element.classList.add('grocery-item');
    element.setAttribute('data-id', id);
    element.innerHTML = `
        <p class="title">${value}</p>
        <div class="btn-container">
            <button type="button" class="edit-btn">
                <i class="fas fa-edit"></i>
            </button>
            <button type="button" class="delete-btn">
                <i class="fas fa-trash"></i>
            </button>
        </div>`;
    const deleteBtn = element.querySelector(".delete-btn");
    const editBtn = element.querySelector(".edit-btn");
    deleteBtn.addEventListener("click", deleteItem);
    editBtn.addEventListener("click", editItem);
    list.appendChild(element);
}

function clearItems() {
    list.innerHTML = "";
    container.classList.remove("show-container");
    clearLocalStorage();
    setInitial();
}

function deleteItem(e) {
    const item = e.currentTarget.closest(".grocery-item");
    const id = item.dataset.id;
    list.removeChild(item);
    if (list.children.length === 0) {
        container.classList.remove("show-container");
    }
    displayAlert("Item removed", "danger");
    removeFromLocalStorage(id);
    setInitial();
}

function editItem(e) {
    const item = e.currentTarget.closest(".grocery-item");
    editElement = item;
    grocery.value = editElement.querySelector(".title").textContent;
    editFlag = true;
    editID = editElement.dataset.id;
    submitBtn.textContent = "Edit";
}

function displayAlert(text, action) {
    alert.textContent = text;
    alert.classList.add(`alert-${action}`);
    setTimeout(() => {
        alert.textContent = "";
        alert.classList.remove(`alert-${action}`);
    }, 1000);
}

function addToLocalStorage(id, value) {
    const storedItems = getFromLocalStorage() || [];
    storedItems.push({ id, value });
    localStorage.setItem("groceryList", JSON.stringify(storedItems));
}

function getFromLocalStorage() {
    return JSON.parse(localStorage.getItem("groceryList"));
}

function updateLocalStorage(id, value) {
    const storedItems = getFromLocalStorage();
    const updatedItems = storedItems.map((item) =>
        item.id === id ? { id, value } : item
    );
    localStorage.setItem("groceryList", JSON.stringify(updatedItems));
}

function removeFromLocalStorage(id) {
    const storedItems = getFromLocalStorage();
    const updatedItems = storedItems.filter((item) => item.id !== id);
    localStorage.setItem("groceryList", JSON.stringify(updatedItems));
}

function clearLocalStorage() {
    localStorage.removeItem("groceryList");
}

function clearInput() {
    grocery.value = "";
    editFlag = false;
    editID = "";
    submitBtn.textContent = "Submit";
}

function setInitial() {
    clearBtn.style.display = list.children.length ? "block" : "none";
}
