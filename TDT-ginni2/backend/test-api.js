const http = require("http");

const options = {
  hostname: "localhost",
  port: 5000,
  path: "/api/questions",
  method: "GET"
};

const req = http.request(options, (res) => {
  let data = "";
  res.on("data", (chunk) => (data += chunk));
  res.on("end", () => {
    const json = JSON.parse(data);
    console.log("Questions from API:");
    json.questions.forEach((q) => {
      console.log(`  ${q.number}. ${q.title} (${q.cardCount} card(s))`);
    });
    console.log("\nAPI test passed!");
  });
});

req.on("error", (e) => {
  console.error("Test failed - is the server running? Run: cd backend && npm run dev");
  process.exit(1);
});

req.end();
