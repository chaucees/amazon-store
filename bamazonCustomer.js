var mysql = require("mysql");
var inquirer = require("inquirer");
require("console.table");

// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",
    port: 8889,
    // Your username
    user: "root",
    // Your password
    password: "root",
    database: "bamazon"
  });
  // connect to the mysql server and sql database
  connection.connect(function(err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    start();
    // displayAllProducts();
  });

//   function to display all products at page load
function displayAllProducts() {
    connection.query("SELECT * FROM products", function(err, results) {
        if (err) throw err; 
        console.log(results);
});
}

// Function to ask the user which product ID they want to buy
function start() {
    connection.query('SELECT * FROM products', function(err, results){
        if (err) throw err;
        console.table(results);
        promptCustomer(results);
    })
};

function promptCustomer(inventory) {
    inquirer
      .prompt({
        name: "chooseID",
        type: "input",
        message: "What is the ID number of the item you would like to buy?",
      })
      .then(function(answer) {
        // Stores the user's input into a variable
        var chosenID = parseInt(answer.chooseID);
        var product = checkInventory(inventory, chosenID);

        if (product) {
            askHowMany(product);
        } else {
            console.log("We don't sell that item");
            start();
        };
        }); 
    }

function checkInventory(inventory, chosenID) {
    // Loops through our inventory 
    for (var i = 0; i < inventory.length; i++) {
        if (inventory[i].item_id === chosenID) 
        return inventory[i];
    } 
    return null;
} 

function askHowMany(product) {
    inquirer
      .prompt([
          {
        name: "howMany",
        type: "input",
        message: "How many would you like to buy?",
      }
]).then(function(answer) {
    // This stores the quanity they want in a variable
    var quantityWanted = parseInt(answer.howMany);
    // This checks the quantityWanted with the stock quantity
    if (quantityWanted > product.stock_quantity) {
        console.log("Insufficient quantity!");
        start();
    } else {
        purchaseProduct(product, quantityWanted);
    }
})

function purchaseProduct(product, quantityWanted) {
    connection.query(
        "UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?",
        [quantityWanted, product.item_id], 
    function(err, results) {
        if (err) throw err;
        console.log(`Sucessfully purchased ${quantityWanted} of ${product.product_name}.`);
        start(); 
        } 
);
} }