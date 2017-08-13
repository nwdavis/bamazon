var mysql = require('mysql');
var inquirer = require('inquirer');

//creating mysql connection
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "1234",
    database: "bamazon"
  });

//connection error handling and app start
connection.connect(function(err) {
    if (err) throw err;
    start();
  });

function start(){
    connection.query("SELECT * FROM products", function(err, res){
        if (err) throw err;
        //printing items
        for (i = 0; i < res.length; i++){
            
            console.log("-----------------");
            console.log("ID: " + res[i].item_id);
            console.log(res[i].product_name);
            console.log("$"+ res[i].price);
            console.log("-----------------");
        }
        
        //prompting user for selection
        inquirer.prompt([
            {
                name: "itemChoice",
                type: "input",
                message: "Enter ID of the item you want to purchase.",
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
                message: "How many would you like to buy?",
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
                message: `Place Order?`
            }

        ]).then(function(answer){
            //checks inventory and places order if inventory is sufficient
            inventoryCheck(answer.itemChoice - 1, answer.itemQuant);
            
        });

        function inventoryCheck(item, quantity){
            if (res[item].stock_quantity < quantity){
                console.log(`Sorry, we don't have enough ${res[item].product_name}.`)
            } else {
                connection.query(
                    "UPDATE products SET ? WHERE ?",
                    [
                        {
                            stock_quantity: res[item].stock_quantity-quantity
                        },
                        {
                            item_id: item+1
                        }
                    ],
                    function(err) {
                        if (err) throw err;
                        console.log(`${res[item].product_name} has been purchased.`);
                        start();
                    }
                );

            }
        }

    });
    
}

