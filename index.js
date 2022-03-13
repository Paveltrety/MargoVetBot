const { Scenes, session, Telegraf } = require('telegraf');

const token = '5101558772:AAFrFojpVsY6RVuZkK24FNSs7UoYVcDW8gs'

const bot = new Telegraf(token)


const SceneGenerator = require('./Scenes')
const curScene = new SceneGenerator()
const serviceScene = curScene.GenServiceScene()
const departureScene = curScene.GenDepartureScene()
const addressScene = curScene.GenAddressScene()
const animalScene = curScene.GenAnimalScene()
const additionalInfoScene = curScene.GenAdditionalInfoScene()


const stage = new Scenes.Stage([serviceScene, departureScene, addressScene, animalScene, additionalInfoScene])

bot.use(session())
bot.use(stage.middleware())

bot.start((ctx) => ctx.reply('Welcome'))
bot.help((ctx) => ctx.reply('Send me a sticker'))
bot.command('echo', (ctx) => ctx.reply('Echo'))
bot.command('scenes', async (ctx) => {
    const chatId = ctx.chat.id
    const userId = ctx.from.id

    ctx.session = {
        chatId: chatId,
        userId: userId,
        service: null,
        departure: null,
        animal: null,
        otherInfo: null
    }
    ctx.scene.enter('service')
})
bot.on('sticker', (ctx) => ctx.reply('👍'))
bot.hears('hi', (ctx) => ctx.reply('Hey there'))
bot.launch()