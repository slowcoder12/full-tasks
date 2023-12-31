const Expense = require("../models/expenseModel");
const User = require("../models/user");
const FilesDownloads = require("../models/fileDownloads");
const aws = require("aws-sdk");

exports.displayItems = async (req, res) => {
  console.log("ENTERED");
  try {
    const page = req.query.page || 1;
    let limit = req.query.limit || 10;
    limit = parseInt(limit);
    const offset = (page - 1) * limit;
    const expenses = await Expense.findAndCountAll({
      where: { userId: req.user.id },
      limit,
      offset,
    });
    console.log("RESPONSEEEEEEE", expenses);

    res.status(200).json({
      expenses: expenses.rows,
      totalItems: expenses.count,
      currentPage: page,
      totalPages: Math.ceil(expenses.count / limit),
    });
  } catch (err) {
    console.log(err);
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
  //console.log(link);

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
    //console.log(expenses);

    res.status(200).json(expenses);
  } catch (err) {
    res.status(500).json({ message: "err occured in displaying" });
  }
};
