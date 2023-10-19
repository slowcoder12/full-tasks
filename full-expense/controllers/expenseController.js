const Expense = require('../models/expenseModel');

exports.addExpense = async (req,res)=>{
    const {amount,description,category} = req.body;
    try{

        const result = await Expense.create({
            amount:amount,
            description:description,
            category:category,
        });

        console.log("Expense added");
        res.status(200).json({message: "expense added successfully"})

    }
    catch(err){
        if(err){
            console.log('error occured in adding',err);
        }
    }
    
}