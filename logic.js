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
            connection.query("SELECT * FROM listings WHERE item_name="+resOne.choice, function(err, itemResult){
                if(err) throw err
                console.log(itemResult);
                inquirer.prompt([
                    {
                        message: "Item selected: "+itemResult.item_name,
                        // message: "Item amount: "+ resOne.amount,
                        // message: "Item price: "+ resOne.price,
                        // message: "How many would you like to purchase?",
                        type: "input",
                        name: "purchaseChoice"
                    }
                ])
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