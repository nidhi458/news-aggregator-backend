const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
app.use(cors());

const apiKey = "f33dd6098115422e9de8c53fe338fcb9";

// Route to get news by category
app.get("/news", async (req, res) => {
  const category = req.query.category || "general";

  try {
    const response = await fetch(
      `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${apiKey}`
    );
    let data = await response.json();

    // ✅ If no articles found, fallback to "everything"
    if (!data.articles || data.articles.length === 0) {
      const altResponse = await fetch(
        `https://newsapi.org/v2/everything?q=${category}&language=en&sortBy=publishedAt&apiKey=${apiKey}`
      );
      data = await altResponse.json();
    }

    console.log("NewsAPI /news response:", data); // debug log
    res.json(data);
  } catch (error) {
    console.error("Error fetching news:", error);
    res.status(500).json({ error: "Error fetching news" });
  }
});

// Route to search news
app.get("/search", async (req, res) => {
  const query = req.query.q;

  try {
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=${query}&language=en&sortBy=publishedAt&apiKey=${apiKey}`
    );
    const data = await response.json();
    console.log("NewsAPI /search response:", data);
    res.json(data);
  } catch (error) {
    console.error("Error searching news:", error);
    res.status(500).json({ error: "Error searching news" });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
