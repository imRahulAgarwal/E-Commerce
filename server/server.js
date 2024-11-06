import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import __dirname from "./dirname.js";
import router from "./routes/router.js";
import connectDatabase from "./config/connectDatabase.js";
import initializeProject from "./utils/init.js";
import panelRouter from "./routes/panelRouter.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";

const PORT = process.env.PORT || 3000;
const ORIGINS = process.env.ALLOWED_ORIGINS?.split(",") || "*";

const app = express();

connectDatabase().then(() => initializeProject());

app.use(
    cors({
        origin: ORIGINS,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "./uploads")));

app.use("/api/panel", panelRouter);
app.use("/api", router);
app.use(errorMiddleware);

app.listen(PORT, () => console.log(`Server running at port ${PORT}`));
