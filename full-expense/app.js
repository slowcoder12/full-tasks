const express = require('express');
const app = express();
const cors = require('cors');
const sequelize = require('./util/database');

const userRoute = require('./routes/userRoute');
const expRoute = require('./routes/expenseRoute');

app.use(express.json());
app.use(cors());
app.use(express.static('public'));

app.post('/signup',userRoute);

app.post('/login',userRoute);

app.post('/addExpense',expRoute);

app.post('/deleteExpense/:id',expRoute);

app.get('/displayItems',expRoute);

sequelize.sync().then(result=>{
    app.listen(3000);
   
})
.catch(err=>{
    console.log(err);
});