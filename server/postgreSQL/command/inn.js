import fetch from "node-fetch";

function checkStatus(inn, date) {
  if (!date) {
    date = new Date();
  }
  const dateStr = date.toISOString().substring(0, 10);
  const url = "https://statusnpd.nalog.ru/api/v1/tracker/taxpayer_status";
  const data = {
    inn: inn,
    requestDate: dateStr,
  };
  let resp = fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return resp;
}

checkStatus(inn) // process.env.FF
  .then((response) => {
    return response.json();
  })
  .then((response) => {
    console.log(response);
  });
/**
 Пример ответа API налоговой, если ИНН принадлежит самозанятому:

{
    "status": true,
    "message": "xxxxxxxxxxxx является плательщиком налога на профессиональный доход"
}
Пример ответа API, если ИНН не принадлежит самозанятому:

{
    "status": false,
    "message": "xxxxxxxxxxxx не является плательщиком налога на профессиональный доход"
}

 */
