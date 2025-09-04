import dotenv from "dotenv";
dotenv.config();

import app from "./src/app.js";
const PORT = process.env.PORT || 3000;

// start the server
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
