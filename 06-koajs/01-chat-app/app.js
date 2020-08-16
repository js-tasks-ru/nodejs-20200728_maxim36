const path = require('path');
const Koa = require('koa');
const app = new Koa();


app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();
const subscribes = new Set();

const waiter = (ctx) => {
    let commonResolve = null;

    const starter = (message) => {
        if (!message) ctx.body = ''
        else ctx.body = message;
        commonResolve();
    };

    const throttel = () => {
        return new Promise( (resolve) => {
            commonResolve = resolve;
        })
    };
    return [starter, throttel];
}

router.get('/subscribe', async (ctx, next) => {
    ctx.response.status = 200;
    const [starter, throttel] = waiter(ctx);
    subscribes.add(starter);
    await throttel();
});

router.post('/publish', async (ctx, next) => {
    ctx.response.status = 201;
    const {message} = ctx.request.body;
    if (!message) return;
    for (const subscribe of subscribes) {
        subscribe(message);
        subscribes.delete(subscribe);
    }
    
});

app.use(router.routes());

module.exports = app;
