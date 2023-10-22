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
        console.log(result);
        res.status(200).json({result, message: "expense added successfully"})


    }
    catch(err){
        if(err){
            console.log('error occured in adding',err);
        }
    }
    
}

exports.deleteExpense = async (req, res) => {
    const id = req.params.id;
    try {
        const result = await Expense.destroy({
            where: {
                id: id
            }
        });

        if (result === 1) {
            res.status(200).json({ message: "Expense deleted successfully" });
        } else {
            res.status(404).json({ message: "Expense not found" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "An error occurred" });
    }
}

exports.displayItems = async (req,res)=>{
    try{
        const expenses = await Expense.findAll();

        res.status(200).json(expenses)
    }catch(err){
        res.status(500).json({message:"err occured in displaying"})
    }
}