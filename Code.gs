function sendToSlack (webhookUrl, message) {
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

function morningTechnews() {
  var today = new Date().toLocaleDateString("en-US", {weekday: "long", month: "long", day: "numeric", year: "numeric"});
  var prompt = "Today is " + today + ". Give me a brief daily tech news briefing covering SaaS, Cloud Computing, Data Centers, and Chip Makers. Include any major tech events happening today. Keep it concice with bullet points and emoji. End with one motivation line for a tech professional.";
  var news = callClaude(prompt);
  var props = PropertiesService.getScriptProperties();
  sendToSlack(props.getProperty("SLACK_WEBHOOK_TECHNEWS"), news);
  MailApp.sendEmail(Session.getActiveUser().getEmail(), "Daily Tech Brief - " + today, news);
}

function morningMotivation() {
  var props = PropertiesService.getScriptProperties();
  var today = new Date ().toLocaleDateString("en-US", {weekday: "long", month: "long", day: "numeric", year: "numeric"});
  var message = "21 DAYS to SUCCESS - " + today + "\n\n"
  + "☀️ Sun, Hydrate, Move\n"
  + "🏊 Swim/Move for 30 minutes\n"
  + "☁️ Complete AWS IAM Policy & EC2 Instance\n"
  + "💪 50 push ups total today\n"
  + "🧘 Meditate, read\n"
  + "☁️ T3: Two Hours, Tech, Today\n"
  + "📄 Spanish for 1 hour\n"
  + "Enveniam Viam. I shall find a way.";
  sendToSlack(props.getProperty("SLACK_WEBHOOK_ENVENIAMVIAM"), message);
  MailApp.sendEmail(Session.getActiveUser().getEmail(), "Morning Brief - " + today, message); 
}

function bilingualAWS() {
  var props = PropertiesService.getScriptProperties();
  var today = new Date().toLocaleDateString("en-US", {weekday: "long", month: "long", day: "numeric", year: "numeric"});
  var message = "AWS CLOUD ENGINEERING - " + today + "\n\n"
    + "5 Characteristics of Cloud Computing\n"
    + "5 Caracteristicas de la Computacion en la Nube\n\n"
    + "1. On-Demand Self-Service\n"
    + "Users can provision computing resources automatically, without requiring human interaction with the cloud provider.\n"
    + "Autoservicio bajo demanda: Los usuarios pueden aprovisionar recursos informaticos automaticamente, sin necesidad de interaccion humana con el proveedor de la nube.\n\n"
    + "2. Broad Network Access\n"
    + "Resources are available over the internet and can be accessed from a wide range of devices and platforms.\n"
    + "Acceso amplio a la red: Los recursos estan disponibles a traves de Internet y pueden ser accedidos desde una amplia variedad de dispositivos y plataformas.\n\n"
    + "3. Multi-Tenancy and Resource Pooling\n"
    + "Multiple customers share the same infrastructure and applications securely, while maintaining privacy.\n"
    + "Multiinquilinato y agrupacion de recursos: Multiples clientes comparten la misma infraestructura y aplicaciones de forma segura, manteniendo la privacidad.\n\n"
    + "4. Rapid Elasticity and Scalability\n"
    + "Resources can be automatically and quickly scaled up or down based on demand.\n"
    + "Elasticidad rapida y escalabilidad: Los recursos pueden escalarse automaticamente y con rapidez segun la demanda.\n\n"
    + "5. Measured Service\n"
    + "Resource usage is monitored, measured, and billed based on consumption. Users only pay for what they use.\n"
    + "Servicio medido: El uso de los recursos se supervisa, mide y se factura segun el consumo. Los usuarios solo pagan por lo que utilizan.\n\n"
    + "Enveniam Viam. Encontraré un camino!";
  sendToSlack(props.getProperty("SLACK_WEBHOOK_AWS"), message);
  MailApp.sendEmail(Session.getActiveUser().getEmail(), "AWS Cloud Brief - " + today, message);
}