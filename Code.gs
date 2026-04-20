function sendToSlack(webhookUrl, message) {
  var options = {
    "method": "post",
    "contentType": "application/json",
    "payload": JSON.stringify({"text": message})
  };
  UrlFetchApp.fetch(webhookUrl, options);
}

function testSlack() {
  var props = PropertiesService.getScriptProperties();
  sendToSlack(props.getProperty("SLACK_WEBHOOK_TECHNEWS"), "Tech News webhook test from Apps Script!");
  sendToSlack(props.getProperty("SLACK_WEBHOOK_ENVENIAMVIAM"), "Enveniamviam webhook test from Apps Script!");
}

function callClaude(prompt) {
  var props = PropertiesService.getScriptProperties();
  var url = "https://api.anthropic.com/v1/messages";
  var options = {
    "method": "post",
    "headers": {
      "x-api-key": props.getProperty("CLAUDE_API_KEY"),
      "anthropic-version": "2023-06-01",
      "content-type": "application/json"
    },
    "payload": JSON.stringify({
      "model": "claude-sonnet-4-20250514",
      "max_tokens": 1024,
      "messages": [{"role": "user", "content": prompt}],
      "tools": [{"type": "web_search_20250305", "name": "web_search"}]
    })
  };
  var response = UrlFetchApp.fetch(url, options);
  var json = JSON.parse(response.getContentText());
  var parts = json.content.filter(function(b) { return b.type === "text"; });
  return parts.map(function(b) { return b.text; }).join("\n");
}

function testClaude() {
  var reply = callClaude("Say hello to Coach Winslow in one sentence.");
  Logger.log(reply);
}

function morningTechNews() {
  var today = new Date().toLocaleDateString("en-US", {weekday: "long", month: "long", day: "numeric", year: "numeric"});
  var prompt = "Today is " + today + ". Give me a brief daily tech news briefing covering SaaS, Cloud Computing, Data Centers, and Chip Makers. Include any major tech events happening today. Keep it concise with bullet points and emoji. End with one motivational line for a tech professional.";
  var news = callClaude(prompt);
  var props = PropertiesService.getScriptProperties();
  sendToSlack(props.getProperty("SLACK_WEBHOOK_TECHNEWS"), news);
  MailApp.sendEmail(Session.getActiveUser().getEmail(), "Daily Tech Brief - " + today, news);
}

function morningMotivation() {
  var props = PropertiesService.getScriptProperties();
  var today = new Date().toLocaleDateString("en-US", {weekday: "long", month: "long", day: "numeric", year: "numeric"});
  var message = "ENVENIAM VIAM - " + today + "\n\n"
    + "☀️ Sun, Hydrate, Move\n"
    + "🏊 Swim 30 minutes\n"
    + "💪 50 push ups today\n"
    + "🧘 Stretch throughout the day\n"
    + "☁️ Complete AWS Client Scoping interview\n"
    + "📄 Apply to 10 jobs\n"
    + "🤝 Network online; make one new tech connection\n\n"
    + "Enveniam Viam. I shall find a way.";
  sendToSlack(props.getProperty("SLACK_WEBHOOK_ENVENIAMVIAM"), message);
  MailApp.sendEmail(Session.getActiveUser().getEmail(), "Morning Brief - " + today, message);
}
