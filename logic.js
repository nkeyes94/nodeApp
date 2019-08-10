var inquirer = require("inquirer");
var mysql = require("mysql");

var connection = mysql.createConnection(
    {
        host: "localhost",
        port: 3306,
        user: "root",
        password: "",
        database: "natemart_db"
    }
)

inquirer.prompt([
    {
        type: "input",
        message: "Welcome to NateMart! Please select a function!",
        choices: ["Make a purchase", "Sell a product"],
        name: "choice"
    }
]).then(function(res){
    if(res.choice == "Make a purchase"){
        //Throw in data from DB
        browseListings();
    } else if(res.choice == "Sell a product"){
        //Allow to post
        postListing();
    }
});

function browseListings(){
    connection.query("SELECT * FROM listings", function(err, res){
        inquirer.prompt([
            {
                message: "Here are our listings!",
                name: "choice",
                type: "rawlist",
                choices: function(){
                    var choiceArr = [];
                    for(let i = 0; i < res.choices; i++){
                        choiceArr.push(res.item_name);
                    }
                }
            }
        ]).then(function(res){
            inquirer.prompt([
                {
                    message: "How many would you like to purchase?",
                    name: "amount",
                    type: "input"
                }
            ]).then(function(res){
                if(res.amount > 2){     //NOTE 2 IS THE ITEM AMOUNT FROM DB -- PLACE HOLDER
                    console.log("Error, cannot purchase that many. There are only "+ res.amount +" left");
                } else if(res.amount < 2){  //NOTE 2 IS THE ITEM AMOUNT FROM DB -- PLACE HOLDE
                    console.log("Making purchase...");
                    //subtract amount purchased from the amount in the db
                }
            })
        })
    });

}

function postListing(){
    inquirer.prmompt([
        {
            message: "What is the name of the item you wish to sell?",
            type: "input",
            name: "itemName"
        }
    ]).then(function(res){
        inquirer.prompt([
            {
                message: "How many do you wish to sell?",
                type: "input",
                name: "itemAmount"
            }
        ]).then(function(res){
            //POST TO DB
        })
    })
}