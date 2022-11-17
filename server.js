let ticketsFull = [{
        "id": 1,
        "name": "поменять краску в принтере каб 404",
        "description": "достать катридж из принтера и вставить обртно!",
        "status": "false",
        "created": "15 февр."
    },
    {
        "id": 2, // идентификатор (уникальный в пределах системы)
        "name": "переустановить windows, ПК 401", // краткое описание
        "description": "более подробно в книге",
        "status": true, // boolean - сделано или нет
        "created": "15 февр." // дата создания (timestamp)
    },
    {
        "id": 3, // идентификатор (уникальный в пределах системы)
        "name": "установить обновление КВ 404", // краткое описание
        "description": "подробнее не знаю!!!",
        "status": false, // boolean - сделано или нет
        "created": "15 февр." // дата создания (timestamp)
    }
];

let tickets = [{
        "id": 1,
        "name": "поменять краску в принтере каб 404",
        "status": "false",
        "created": "15 февр."
    },
    {
        "id": 2, // идентификатор (уникальный в пределах системы)
        "name": "переустановить windows, ПК 401", // краткое описание
        "status": true, // boolean - сделано или нет
        "created": "15 февр." // дата создания (timestamp)
    },
    {
        "id": 3, // идентификатор (уникальный в пределах системы)
        "name": "установить обновление КВ 404", // краткое описание
        "status": false, // boolean - сделано или нет
        "created": "15 февр." // дата создания (timestamp)
    }
];

const { timeStamp } = require('console');
const http = require('http');
const Koa = require('koa');
let koaBody = require('koa-body');
//let bodyParser = require('koa-bodyparser');
const app = new Koa();

/*app.use(koaBody({
    urlencoded: true,
}));*/

const subscr = [];
app.use(koaBody({
    formidable: { uploadDir: './uploads' },
    multipart: true,
    urlencoded: true
}));
//app.use(bodyParser());

app.use(async(ctx, next) => {
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    ctx.set('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    //ctx.body = 'hello';
    switch (ctx.request.query["method"]) {
        case 'allTickets':
            ctx.response.status = 200;
            ctx.response.body = JSON.stringify(tickets);
            return;
        case 'ticketById':
            let rezult = "Упс!! Пусто";
            ctx.response.status = 200;
            //  console.log(ctx.request.query["id"]);
            for (let i = 0; i < ticketsFull.length; i++) {
                console.log(ticketsFull[i]["id"]);
                if (ticketsFull[i]["id"] == Number.parseInt(ctx.request.query["id"])) {
                    rezult = ticketsFull[i]["description"];
                }
            }
            ctx.response.body = rezult;
            return;
        case 'deleteTicket':
            ctx.response.status = 200;
            const idElementDelete = ctx.request.query["id"];

            const idTicketDel = ctx.request.query["id"];
            console.log("kodDel = " + idTicketDel);

            //tickets.splice(2, 1)
            for (let i = 0; i < tickets.length; i++) {
                //  console.log("id = " + tickets[i].id);
                if (tickets[i].id == idTicketDel) {
                    tickets.splice(i, 1);
                    console.log("совпадение " + i);
                }
            }


            ctx.response.body = JSON.stringify(tickets);
            return;
        case 'createTicket':
            // console.log(ctx.request.body);
            const { name, description } = ctx.request.body;
            subscr.push({ name, description });
            // console.log("результата= " + subscr[0].name + " " + subscr[0].description);

            tickets.push({
                "id": ticketsFull.length + 1, // идентификатор (уникальный в пределах системы)
                "name": subscr[0].name, // краткое описание
                "status": false, // boolean - сделано или нет
                "created": "15 февр." // дата создания (timestamp)
            }, );
            ticketsFull.push({
                "id": ticketsFull.length + 1,
                "name": subscr[0].name,
                "description": subscr[0].description,
                "status": "false",
                "created": "15 февр."
            });
            subscr.splice(0, 1);
            ctx.response.status = 200;
            ctx.response.body = JSON.stringify(tickets);
            return;
        case 'ticketDone':
            ctx.response.status = 200;
            const idTicketDone = ctx.request.query["id"];
            ctx.response.body = "";
            tickets.forEach(element => {
                console.log(element);
                if (element.id == idTicketDone) {
                    if (element.status) {
                        element.status = false;
                    } else element.status = true;
                }
            });
            console.log("kodDel = " + idTicketDone);
            return;
        case 'editing':
            let rez;
            ctx.response.status = 200;
            console.log(ctx.request.query["id"]);
            for (let i = 0; i < ticketsFull.length; i++) {
                console.log(ticketsFull[i]["id"]);
                if (ticketsFull[i]["id"] == Number.parseInt(ctx.request.query["id"])) {
                    rez = ticketsFull[i];
                }
            }

            ctx.response.body = JSON.stringify(rez);
            return;
        case 'editingNew':

            const { id, inf, descript } = ctx.request.body;

            tickets.forEach(element => {
                //console.log(element);
                if (element.id == id) {
                    element.name = inf;
                }
            });

            ticketsFull.forEach(element => {
                // console.log(element);
                if (element.id == id) {
                    element.name = inf;
                    element.description = descript;
                }
            });

            ctx.response.body = JSON.stringify(tickets);
            return;
        default:
            ctx.response.status = 404;

            return;
    }
});

app.listen(3000, function() {

    console.log('Server running on http://localhost:3000')
});