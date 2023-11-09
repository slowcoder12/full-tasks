const Expense = require("../models/expenseModel");
const sequelize = require("../util/database");
const User = require("../models/user");
const FilesDownloads = require("../models/fileDownloads");
const aws = require("aws-sdk");

exports.addExpense = async (req, res) => {
  const t = await sequelize.transaction();
  const { amount, description, category } = req.body;
  const userId = req.user.id;
  try {
    const result = await Expense.create(
      {
        amount: amount,
        description: description,
        category: category,
        userId: userId,
      },
      { transaction: t }
    );
    const user = await User.findByPk(userId, { transaction: t });
    if (user) {
      user.totalExpense += parseInt(amount);
      await user.save({ transaction: t });
    }
    await t.commit();
    console.log("Expense added");
    //console.log(result);
    res.status(200).json({ result, message: "expense added successfully" });
  } catch (err) {
    await t.rollback();
    console.log("error occured in adding", err);
    res.status(500).json({ message: "An error occurred" });
  }
};

exports.deleteExpense = async (req, res) => {
  const id = req.params.id;
  try {
    const expense = await Expense.findOne({
      where: {
        id: id,
      },
    });

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    const userId = expense.userId;
    const amount = expense.amount;

    const result = await Expense.destroy({
      where: {
        id: id,
      },
    });

    if (result === 1) {
      const user = await User.findByPk(userId);
      if (user) {
        user.totalExpense -= user.totalExpense - amount;
        await user.save();
      }

      res.status(200).json({ message: "Expense deleted successfully" });
    } else {
      res.status(500).json({ message: "An error occurred" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "An error occurred" });
  }
};

exports.displayItems = async (req, res) => {
  try {
    const expenses = await Expense.findAll({ where: { userId: req.user.id } });
    //console.log(expenses);

    res.status(200).json(expenses);
  } catch (err) {
    res.status(500).json({ message: "err occured in displaying" });
  }
};

exports.leaderBoard = async (req, res) => {
  try {
    const expenses = await User.findAll({
      attributes: ["name", "totalExpense"],
      order: [["totalExpense", "DESC"]],
    });
    res.status(200).json(expenses);
  } catch (err) {
    console.log(err);
  }
};

exports.downloadExpenses = async (req, res) => {
  try {
    const userId = req.user.id;
    const expenses = await Expense.findAll({ where: { userId: req.user.id } });
    const stringfyexp = JSON.stringify(expenses);
    //console.log(stringfyexp);

    const filename = `Expense${userId}/${new Date()}.txt`;

    const fileURL = await uploadToS3(stringfyexp, filename);
    res.status(200).json({ fileURL });
  } catch (err) {
    res.status(500).json({ message: "err occured in displaying" });
  }
};

async function uploadToS3(data, filename) {
  const BUCKET_NAME = process.env.BUCKET_NAME;
  const IAM_USER_KEY = process.env.IAM_USER_KEY;
  const IAM_USER_SECRET = process.env.IAM_USER_SECRET;

  let s3bucket = new aws.S3({
    accessKeyId: IAM_USER_KEY,
    secretAccessKey: IAM_USER_SECRET,
  });

  let params = {
    Bucket: BUCKET_NAME,
    Key: filename,
    Body: data,
    ACL: "public-read",
  };

  try {
    const uploadResponse = await s3bucket.upload(params).promise();
    console.log("Success", uploadResponse);
    return uploadResponse.Location;
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "error in uploading", success: false });
  }
}

exports.saveLink = (req, res) => {
  const link = req.body.link;
  const id = req.user.id;
  console.log(link);

  try {
    const result = FilesDownloads.create({
      link: link,
      userId: id,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.reportData = async (req, res) => {
  try {
    const expenses = await FilesDownloads.findAll({
      where: { userId: req.user.id },
    });
    console.log(expenses);

    res.status(200).json(expenses);
  } catch (err) {
    res.status(500).json({ message: "err occured in displaying" });
  }
};
