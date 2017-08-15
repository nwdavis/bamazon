var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "1234",
    database: "bamazon"
  });

function start(){

connection.query("SELECT * FROM products", function(err, res){

    inquirer.prompt([
        {
            name: "options",
            type: "list",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"],
            message: "What would you like to do?"
        }
    ]).then(function(ans){
        
        if (ans.options === "View Products for Sale"){
            viewProducts();           
        }else if(ans.options === "View Low Inventory"){
            lowInventory();            
        }else if(ans.options === "Add To Inventory"){
            addToInventory();           
        }else if(ans.options === "Add New Product"){
            addProduct();            
        }
    });

    //prints products
    function viewProducts(){

        connection.query("SELECT * FROM products", function(err, res){
            if (err) throw err;
            //printing items
            for (i = 0; i < res.length; i++){
                
                console.log("-----------------");
                console.log("ID: " + res[i].item_id);
                console.log(res[i].product_name);
                console.log("$"+ res[i].price);
                console.log(res[i].stock_quantity);
                console.log("-----------------");
            }
        })    
    }

    //shows low inventory
    function lowInventory(){
       
        if (err) throw err;
        //printing items
        for (i = 0; i < res.length; i++){
            if (res[i].stock_quantity < 5){
                counter++;
                console.log("-----------------");
                console.log(`There are less than 5 ${res[i].product_name} remaining in inventory.`);
                console.log("-----------------");
            }
        }
    }//closes lowInventory


    //allows manager to add to inventory
    function addToInventory(){
        inquirer.prompt([
            {
                name: "itemToIncrease",
                type: "input",
                message: "Enter the ID of the item you would like to increase.",
                filter: function(str){
                    return parseInt(str)
                },
                validate: function(str){
                    //adding validation for entry
                    if (str < 1 || str > res.length || isNaN(str)){
                        console.log("\nEnter a valid product ID.")
                    }else{
                        return true
                    }
                }
            },
            {
                name: "itemQuant",
                type: "input",
                message: "How many would you like to increase it by?",
                filter: function(str){
                    return parseInt(str)
                },
                validate: function(str){
                    //adding validation for entry
                    if (str < 1 || isNaN(str)){
                        console.log("\nEnter a valid quantity.")
                    }else{
                        return true
                    }
                }
            },
            {
                name: "confirm",
                type: "confirm",
                message: `Update inventory?`
            }
        ]).then(function(ans){
            if(ans.confirm){
                connection.query(
                    "UPDATE products SET ? WHERE ?",
                    [
                        {
                            stock_quantity: res[ans.itemToIncrease].stock_quantity+ans.itemQuant
                        },
                        {
                            item_id: item+1
                        }
                    ],
                    function(err) {
                        if (err) throw err;
                        console.log(`${res[ans.itemToIncrease].product_name} has been increased.`);
                    }
                );
            }
        })

    }//end of addToInventory

    // //allows manager to add a product
    function addProduct(){
        inquirer.prompt([
            {
                name: "itemToAdd",
                type: "input",
                message: "Enter the name of the item you would like to add."
            },
            {
                name: "itemQuant",
                type: "input",
                message: "How many would you like to add to inventory?",
                filter: function(str){
                    return parseInt(str)
                },
                validate: function(str){
                    //adding validation for entry
                    if (str < 1 || isNaN(str)){
                        console.log("\nEnter a valid quantity.")
                    }else{
                        return true
                    }
                }
            },
            {
                name: "department",
                type: "list",
                choices: ["Food", "Electronics", "Home", "Sporting Goods", "Clothing"],
                message: "In which department does this item belong?"
            },
            {
                name: "price",
                type: "input",
                message: "How much does the item cost?",
                filter: function(str){
                    return parseInt(str)
                },
                validate: function(str){
                    //adding validation for entry
                    if (str < 1 || isNaN(str)){
                        console.log("\nEnter a valid quantity.")
                    }else{
                        return true
                    }
                }
            },
            {
                name: "confirm",
                type: "confirm",
                message: `Add the item?`
            }
        ]).then(function(ans){
            if (ans.confirm){
                connection.query(
                    "INSERT INTO products SET ?",
                        {
                            product_name: ans.itemToAdd,
                            dept_name: ans.department,
                            price: ans.price,
                            stock_quantity: ans.itemQuant,
                        },
                    function(err) {
                        if (err) throw err;
                        console.log(`${ans.itemToAdd} has been added.`);
                    }
                );
            }else{
                return;
            }
        })
    }
});//closes connection query
}//closes start

//calling start
start();