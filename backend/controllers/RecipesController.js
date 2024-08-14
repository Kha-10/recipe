const Recipe = require("../models/Recipe");
const mongoose = require("mongoose");
const removeFile = require("../helpers/removeFile");
const awsRemove = require("../helpers/awRemove");

const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const User = require("../models/User");

const sendEmail = require("../helpers/sendEmail");

const Queue = require("bull");

const s3 = new S3Client({
  region: process.env.BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_KEY,
  },
});

const emailQueue = new Queue("emailQueue", {
  redis: { port: 6379, host: "127.0.0.1" },
});

emailQueue.process( async function (job, done) {
    await sendEmail(job.data)
});

const RecipesController = {
  index: async (req, res) => {
    try {
      let limit = 6;
      const page = req.query.page || 1;
      const recipes = await Recipe.find()
        .populate("category")
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 });

      for (const recipe of recipes) {
        const getObjectParams = {
          Bucket: process.env.BUCKET_NAME,
          Key: recipe.photo,
        };

        const command = new GetObjectCommand(getObjectParams);
        const url = await getSignedUrl(s3, command, { expiresIn: 60 });
        recipe.imgUrl = url;
      }

      let totalPages = await Recipe.countDocuments();
      let totalPagesCount = Math.ceil(totalPages / limit);

      let pagination = {
        isNextPage: totalPagesCount == page ? false : true,
        isPreviousPage: page == 1 ? false : true,
        currentPage: page,
        links: [],
      };

      for (let index = 0; index < totalPagesCount; index++) {
        let number = index + 1;
        pagination.links.push({ number });
      }

      let response = {
        data: recipes,
        pagination,
      };
      return res.json(response);
    } catch (error) {
      return res.status(500).json({ msg: "Internet Server Error" });
    }
  },
  store: async (req, res) => {
    try {
      const { title, price, category } = req.body;
      const recipe = await Recipe.create({
        title,
        price,
        category,
      });

      let users = await User.find(null, ["email"]);
      let usersEmails = users.map((user) => user.email);
      let filteredUsers = usersEmails.filter(
        (email) => email !== req.user.email
      );

      emailQueue.add({
        viewFilename: "email",
        data: {
          name: req.user.username,
          recipe,
        },
        from: req.user.email,
        to: filteredUsers,
      });
      return res.json(recipe);
    } catch (error) {
      return res.status(500).json({ msg: "Internet Server Error" });
    }
  },
  show: async (req, res) => {
    try {
      let id = req.params.id;
      console.log(req.params);
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: "Invalid id" });
      }
      let recipe;

      recipe = await Recipe.findById(id).populate("category");
      if (recipe) {
        console.log(recipe);
        return res.json(recipe);
      }

      recipe = await Recipe.find({ category: id }).populate("category");
      if (recipe) {
        return res.json(recipe);
      }

      return res.status(404).json({ msg: "Recipe not found" });
    } catch (error) {
      return res.status(500).json({ msg: "Internet Server Error" });
    }
  },
  destroy: async (req, res) => {
    try {
      let id = req.params.id;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: "Invalid id" });
      }

      let img = await Recipe.findById(id);
      if (!img) {
        return res.status(404).json({ msg: "Recipe not found" });
      }
      await awsRemove(img);

      let recipe = await Recipe.findByIdAndDelete(id);

      if (!recipe) {
        return res.status(404).json({ msg: "recipe not found" });
      }
      return res.json(recipe);
    } catch (error) {
      return res.status(500).json({ msg: "Internet Server Error" });
    }
  },
  update: async (req, res) => {
    try {
      let id = req.params.id;
      console.log("update", req.body);
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: "Invalid id" });
      }
      let recipe = await Recipe.findByIdAndUpdate(id, {
        ...req.body,
      });

      console.log("recipe", recipe);
      //   let path = __dirname+'/../public'+recipe.photo;
      //   await removeFile(path)

      // let img = await Recipe.findById(id);
      // console.log('IMG',img);

      if (!recipe.photo) {
        return res.status(404).json({ msg: "Photo not found" });
      }
      if (!req.body.imgUrl && recipe.photo) {
        await awsRemove(recipe);
      }

      if (!recipe) {
        return res.status(404).json({ msg: "recipe not found" });
      }
      return res.json(recipe);
    } catch (error) {
      return res.status(500).json({ msg: "Internet Server Error" });
    }
  },
  upload: async (req, res) => {
    try {
      let id = req.params.id;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: "Invalid id" });
      }
      let recipe = await Recipe.findByIdAndUpdate(id, {
        //   photo : '/' + req.file.filename'
        photo: req.file.key,
      });
      if (!recipe) {
        return res.status(404).json({ msg: "recipe not found" });
      }
      return res.json(recipe);
    } catch (error) {
      return res.status(500).json({ msg: "Internet Server Error" });
    }
  },
};

module.exports = RecipesController;
