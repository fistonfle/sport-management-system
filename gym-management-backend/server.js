require("dotenv").config();  

const app = require("./app");


const PORT = process.env.PORT || 5000;

// Start the server and listen on the defined PORT
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
