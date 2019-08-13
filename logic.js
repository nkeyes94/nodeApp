//Require inquirer
var inquirer = require("inquirer");
//Require mysql
var mysql = require("mysql");

//Configuring the mysql connection
var connection = mysql.createConnection(
    {
        host: "localhost",
        port: 3306,
        user: "root",
        password: "coleakenta",                           //Fill in password later
        database: "natemart_db"
    }
)

//Initial prompt
inquirer.prompt([
    {
        type: "list",
        message: "Welcome to NateMart! Please select a function!",
        choices: ["Make a purchase", "Sell a product"],
        name: "choice"
    }
]).then(function(res){
    if(res.choice == "Make a purchase"){
        //Once make a purchase is selected, use this function.
        browseListings();
    } else if(res.choice == "Sell a product"){
        //Once sell a product is selected, use this function
        postListing();
    }
});

//Function to browse the lsitings
function browseListings(){
    //Connection query to get all info about sales in the DB
    connection.query("SELECT * FROM listings", function(err, res){
        if(err) throw err;
        //Inquirer prompt about browsing listings
        inquirer.prompt([
            {
                name: "choice",
                type: "rawlist",
                choices: function(){
                    //An array and a for loop to add the sales from the DB to the choice in the inquirer prompt
                    var choiceArr = [];
                    for(let i = 0; i < res.length; i++){
                        choiceArr.push(res[i].item_name);
                    }
                    return choiceArr;
                },
                message: "Here are our listings!"
            }
        ]).then(function(resOne){
            //After the first prompt, allow the user to select the amount to buy
            console.log(resOne.choice);
            connection.query("SELECT * FROM listings WHERE item_name=" + '\u0022' + resOne.choice + '\u0022', function(err, itemResult){
                if(err) throw err
                console.log(itemResult);
                let selectedItem = itemResult[0].item_name;
                console.log("Item name: "+ selectedItem);
                console.log(selectedItem+ " amount available: "+ itemResult[0].amount);
                console.log(selectedItem+ " price: "+ itemResult[0].price);
                inquirer.prompt([
                    {
                        message: "How many would you like to purchase?",
                        name: "amount",
                        input: "name"
                    }
                ]).then(function(resTwo){
                    console.log("resTwo: "+ resTwo.amount);
                    let selectedAmount = resTwo.amount;
                    if(selectedAmount > itemResult[0].amount){
                        console.log("Sorry, you've selected "+ selectedAmount +" to purchase, but there are only "+ itemResult[0].amount +" available.")
                    } else if(selectedAmount < itemResult[0].amount){
                        console.log("You've selected to purchase "+ selectedAmount +" .");
                        let totalCost = selectedAmount * itemResult[0].price;
                        console.log("Your total for this purchase is: "+ totalCost)
                        inquirer.prompt([
                            {
                                message: "Would you like to proceed?",
                                type: "list",
                                choices: ["Yes", "No"],
                                name: "confirmChoice"
                            }
                        ]).then(function(confirmation){
                            console.log("conf: "+confirmation.confirmChoice);
                            if(confirmation.confirmChoice == "No"){
                                console.log("Exiting program");
                            } else if(confirmation.confirmChoice == "Yes") {
                                console.log("Please wait while the purchase is made...");
                                let itemsLeft = itemResult[0].amount - selectedAmount;
                                console.log("items left: "+ itemsLeft)
                                connection.query(
                                    "UPDATE listings SET amount="+ itemsLeft+ " WHERE item_name=" + '\u0022' + resOne.choice + '\u0022', function(err, updateRes){
                                        if(err) throw err;
                                        console.log(updateRes.affectedRows + " updated");
                                    }
                                )
                            }
                        })
                    }
                })
            })
        })
    });

}

function postListing(){
    inquirer.prompt([
        {
            message: "What is the name of the item you wish to sell?",
            type: "input",
            name: "itemName"
        }
    ]).then(function(resOne){
        inquirer.prompt([
            {
                message: "How many do you wish to sell?",
                type: "input",
                name: "itemAmount"
            }
        ]).then(function(resTwo){
            inquirer.prompt([
                {
                    message: "How much do you wish to sell each item for?",
                    type: "input",
                    name: "itemPrice"
                }
            ]).then(function(resThree){
                let totalAmount = resTwo.itemAmount * resThree.itemPrice;
                console.log("You will make "+ totalAmount +" by selling these!");
                console.log("BEFORE CONNECTION QUERY");
                console.log("Item Name: "+ resOne.itemName);
                console.log("Item amount: "+ resTwo.itemAmount);
                console.log("Item price: "+ resThree.itemPrice);
                connection.query(
                    "INSERT INTO listings SET ?",
                    {
                        item_name: resOne.itemName,
                        amount: resTwo.itemAmount,
                        price: resThree.itemPrice
                    }
                )
            })
        })
    })
}