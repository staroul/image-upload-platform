import Koa from 'koa';
import Router from 'koa-router';
import fs from 'fs';
import koaBody from 'koa-body';
import path from 'path';
import cors from 'koa2-cors';
import serve from 'koa-static';
import json from 'koa-json';
import sizeOf from 'image-size';

const app = new Koa();
const router = new Router();

const handler = async (ctx, next) => {
    try {
        await next();
    } catch(err) {
        ctx.response.status = err.statusCode || err.status || 500;
        ctx.response.body = {
            message: err.message,
            statusCode: err.statusCode,
            status: err.status
        };
    }
};

const upload = async (ctx) => {
    const file = ctx.request.files || {};
    const fileStoragePath = path.join(__dirname, 'img', file['images'].name);
    const reader = fs.createReadStream(file['images'].path);
    const writer = fs.createWriteStream(fileStoragePath);
    await reader.pipe(writer);
    const filePath = `http://localhost:3000/img/${file['images'].name}`;
    
    
    //const dimensions = sizeOf(fileStoragePath);
    //console.log(dimensions); 

    ctx.body = {
        name: file['images'].name,
        path: filePath
    };

    console.log(ctx.body);
}

router.post('/upload',koaBody({ multipart:true }), upload);

app.use(cors({
    origin: ctx => {
        if(ctx.url === '/upload') {
            return '*';
        }
        return 'http://127.0.0.1:8080';
    },
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 5,
    credentials: true,
    allowMethods: ['GET', 'POST'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

app.use(json());
app.use(handler);
app.use(router.routes());
app.use(serve(__dirname, '/img'));

app.listen(3000);