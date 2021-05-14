import { Application, Router, helpers } from 'https://deno.land/x/oak@v6.5.0/mod.ts'

const app = new Application()
const products = new Router({ prefix: '/products' })
const auth = new Router({ prefix: '/auth' })
const admin = new Router({ prefix: '/admin' })

app.use(async (ctx, next) => {
    await next()
})

app.use(async (ctx, next) => {
    await next()
})

app.use(async (ctx, next) => {
    console.log('leg1: Middleware 3')
    await next()
})

//Route products
products.get('/', (ctx) => {
    const query = helpers.getQuery(ctx)
    console.log('query : ', query)
    ctx.response.body = 'This is the products.get route'
})

products.get('/:productId', (ctx) => {
    const params = ctx.params
    console.log('params: ', params)
    ctx.response.body = 'This is the product.get route'
})

app.use(products.routes())
app.use(products.allowedMethods())

//Auth routes
// /auth/signup
auth.post('/signup', async (ctx) => {
    const { request, response } = ctx

    const hasBody = request.hasBody

    if (!hasBody) {
        response.body = 'Please all required information'
        return;
    }

    const body = request.body()
    const bodyData = await body.value
    const bodyType = body.type

    console.log('body: ', bodyData)
    console.log('body type: ', bodyType)

    response.body = 'This is the signup route'
})

app.use(auth.routes())
app.use(auth.allowedMethods())

//Route users
admin.get('/users', async (ctx, next) => {
    console.log('Authorization checking')
    await next()
}, (ctx) => {
    console.log('This is the last middleware')
    ctx.response.body = 'This is the users.get route'
})

admin.post('/products', async (ctx) => {
    const { request, response } = ctx
    if (!request.hasBody) {
        response.body = 'Bad request'
        return
    }

    const body = request.body()

    if (body.type !== 'form-data') {
        response.body = 'Bad Request'
        return
    }

    const bodyData = await body.value.read({
        // outPath: './images'
        maxSize: 5000000,
    })

    console.log('body: ', bodyData)

    response.body = 'This is the add product route'
})

app.use(admin.routes())
app.use(admin.allowedMethods())

// app.use(ctx => {
//     ctx.response.status = 404;
//     ctx.response.body = 'Not found'
// })

console.log('The server is staring up at port: 5000')
await app.listen({ port: 5000 })