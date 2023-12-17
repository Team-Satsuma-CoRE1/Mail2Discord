function hook() {
 const threads = GmailApp.search('label:unread -category:promotions');  // 未読のスレッドを取得

 if (threads.length == 0) {
   return
 }

 threads.forEach(function (thread) {
   const messages = thread.getMessages();

   const payloads = messages.map(function (message) {
     message.markRead();  // メールを既読に設定する

     const from = message.getFrom();
     const subject = message.getSubject();
     const plainBody = message.getPlainBody();

     const webhook = getWebhookUrl();

     const payload = {
       content: subject,
       embeds: [{
         title: subject,
         author: {
           name: from,
         },
         description: plainBody.substr(0, 2048),
       }],
     }
     return {
       url: webhook,
       contentType: 'application/json',
       payload: JSON.stringify(payload),
     }
   })

   UrlFetchApp.fetchAll(payloads);
 })
}