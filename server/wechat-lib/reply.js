
const tip = `中文, English, 链接: <a href="http://www.google.com">点这里</a>`

export default async (ctx, next) => {
  console.log('inside the reply function')
  ctx.body = tip
}
