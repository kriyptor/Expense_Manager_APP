require('dotenv').config();
const express = require(`express`);
const cors = require(`cors`);
const path = require(`path`);
const { connectToDB } = require(`./utils/database`);
const bodyParser = require(`body-parser`);
const userRouter = require(`./Routes/user`);

const premiumRouter = require(`./Routes/premium`);
const expenseRouter = require(`./Routes/expense`);
const passwordRouter = require(`./Routes/password`);
const paymentRouter = require(`./Routes/payment`);


const PORT = process.env.PORT || 3000;

if (!process.env.DB_URI || !process.env.JWT_SECRET_KEY) {
    console.error('Missing required environment variables');
    process.exit(1);
  }

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get('/hi', (req, res) => {
  res.send("Hello from the server!");
});

app.use('/user', userRouter);
app.use('/expense', expenseRouter);
app.use('/premium', premiumRouter);
app.use('/password', passwordRouter);
app.use('/payment', paymentRouter);


//sync the database
connectToDB()
  .then(() => {
    console.log(`Connected with DB!`);
    app.listen(PORT, () => console.log(`Server is running @ PORT:${PORT}`));
  })
  .catch((err) => console.log(`Server Crashed with error: ${err}`));