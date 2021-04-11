// const PORT = process.env.PORT || 3000;
const PORT = 8080;
const app = require("./dbCalls");
app.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`Listening to port ${PORT}`);
});
    