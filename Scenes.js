const { Scenes } = require('telegraf')
const { getLabelService, getLabelDeparture, getLabelAnimal } = require('./helpers')
let deleteMessegeID = null
let deleteChatID = null

class SceneGenerator {
    GenServiceScene() {
        const service = new Scenes.BaseScene('service')
        service.enter(async (ctx) => {
            await ctx.replyWithHTML("<b>Выберите услугу: </b>", {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: 'Записаться на чипирование (5000 рублей)', callback_data: 'chipping' }],
                        [{ text: 'Записаться на вакцинацию (5000 рублей)', callback_data: 'vaccination' }],
                        [{ text: 'Записаться на чипирование и вакцинацию (10000 рублей)', callback_data: 'chippingVaccination' }]
                    ]
                }
            })
        })
        service.on('callback_query', async (ctx) => {
            const service = ctx.update.callback_query.data
            const label = getLabelService(service)
            ctx.session.service = {
                value: service,
                label
            }
            await ctx.deleteMessage()
            await ctx.scene.enter('departure')

        })
        //service.on('message', (ctx) => ctx.reply('Давай лучше возраст'))
        return service
    }


    GenDepartureScene() {
        const departure = new Scenes.BaseScene('departure')
        departure.enter(async (ctx) => {
            await ctx.replyWithHTML(`<b>Укажите тип выезда:</b>`, {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: 'Выезд на дом (+2000 рублей)', callback_data: 'departureHouse' }],
                        [{ text: 'Выезд к специалисту', callback_data: 'departureSpecialist' }]
                    ]
                }
            })
        })
        departure.on('callback_query', async (ctx) => {
            const departure = ctx.update.callback_query.data
            const label = getLabelDeparture(departure)

            await ctx.deleteMessage()
            if (departure === 'departureHouse') {
                ctx.session.departure = {
                    value: departure,
                    label,
                    address: null
                }
                ctx.scene.enter('address')
            } else {
                ctx.session.departure = {
                    value: departure,
                    label,
                    address: 'УЛИЦА МАРГО'
                }
                ctx.scene.enter('animal')
            }

        })
        departure.on('message', (ctx) => ctx.reply('Давай лучше возраст'))
        return departure
    }

    GenAddressScene() {
        const address = new Scenes.BaseScene('address')
        address.enter(async (ctx) => {

            const info = await ctx.replyWithHTML(`<b>Укажите ваш адрес:</b>`)
            deleteMessegeID = info.message_id // тут сохраняем айди сообщения
            deleteChatID = info.chat.id // тут сохраняем айди чата
        })
        address.on('message', async (ctx) => {
            const addressUser = ctx.message.text
            ctx.session.departure.address = addressUser
            //console.log(deleteMessegeID, 'deleteMessegeID')
            //console.log(deleteChatID, 'deleteChatID')
            await ctx.telegram.deleteMessage(deleteChatID, deleteMessegeID)  // удаляем по айди


            ctx.scene.enter('animal')
        })
        return address
    }

    GenAnimalScene() {
        const animal = new Scenes.BaseScene('animal')
        animal.enter(async (ctx) => {
            await ctx.replyWithHTML(`<b>Укажите ваше животное:</b>`, {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: 'Кошка', callback_data: 'cat' }],
                        [{ text: 'Собака', callback_data: 'dog' }]
                    ]
                }
            })
        })
        animal.on('callback_query', async (ctx) => {
            const animal = ctx.update.callback_query.data
            const label = getLabelAnimal(animal)
            ctx.session.animal = {
                value: animal,
                label,
            }
            await ctx.deleteMessage()
            await ctx.scene.enter('additionalInfo')

        })
        //animal.on('message', (ctx) => ctx.reply('Давай лучше возраст'))
        return animal
    }


    GenAdditionalInfoScene() {
        const additionalInfo = new Scenes.BaseScene('additionalInfo')
        additionalInfo.enter(async (ctx) => {
            await ctx.replyWithHTML(`Укажите ваш номер телефона и пожелания к услуге`)
        })
        additionalInfo.on('message', async (ctx) => {
            const info = ctx.message.text
            const messageId = ctx.message.message_id
            ctx.session.otherInfo = info
            await ctx.deleteMessage(messageId)
            await ctx.reply(`Ваша инфа ${info}`)


        })
        return additionalInfo
    }

}

module.exports = SceneGenerator