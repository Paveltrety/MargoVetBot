const TelegramApi = require('node-telegram-bot-api')

const token = '5101558772:AAFrFojpVsY6RVuZkK24FNSs7UoYVcDW8gs'

const bot = new TelegramApi(token, { polling: true })

const menuLevelOne = [["Записаться на чипирование (5000 рублей)"], ["Записаться вакцинацию (5000 рублей)"], ["Записаться на чипирование и вакцинацию (5000 рублей)"]]
const menuLevelTwo = [["Выезд на дом (+2000 рублей)"], ["Выезд к специалисту"]]
const menuLevelThree = [["Собака"], ["Кошка"]]


//const menuLevelOne = {
//    reply_markup: JSON.stringify({
//        inline_keyboard: [
//            [{ text: "Записаться на чипирование (5000 рублей)", callback_data: 'chipping' }],
//            [{ text: "Записаться на вакцинацию (5000 рублей)", callback_data: 'vaccination' }],
//            [{ text: "Записаться на чипирование и вакцинацию (5000 рублей)", callback_data: 'chippingVaccination' }],
//        ]
//    })
//}

//const menuLevelTwo = {
//    reply_markup: JSON.stringify({
//        inline_keyboard: [
//            [{ text: "Выезд на дом (+2000 рублей)", callback_data: 'departureHouse' }],
//            [{ text: "Выезд к специалисту", callback_data: 'departureSpecialist' }],
//        ]
//    })
//}


const baza = {}

bot.setMyCommands([
    {
        command: '/menu',
        description: 'Показать меню'
    },
    {
        command: '/info',
        description: 'Информацию о враче '
    }
])

bot.on('message', async msg => {
    const text = msg.text
    const chatId = msg.chat.id
    if (text === '/info') {
        return bot.sendMessage(chatId, `Марго это врач`)
    }


    if(baza.service && baza.departure) {

    }



    if (text === '/start' || text === '/menu') {
        return bot.sendMessage(chatId, "Выберите услугу:", {
            "reply_markup": {
                "keyboard": menuLevelOne
            }
        });
    }
    if (menuLevelOne.find((item) => item[0] === text)) {
        const value = menuLevelOne.find((item) => item[0] === text)[0]
        baza['service'] = value
        console.log(baza, 'menuLevelOne')
        return bot.sendMessage(chatId, `Вы выбрали ${text}, укажите тип выезда`, {
            "reply_markup": {
                "keyboard": menuLevelTwo
            }
        });
    }
    if (menuLevelTwo.find((item) => item[0] === text)) {
        const value = menuLevelTwo.find((item) => item[0] === text)[0]
        
        baza['departure'] = value
        console.log(baza, 'menuLevelTwo')
        if (value === 'Выезд на дом (+2000 рублей)') {
            return bot.sendMessage(chatId, `Укажите ваш адрес`, {
                "reply_markup": {
                    "keyboard": []
                }
            })
        }
        if (value === 'Выезд к специалисту') {
            return bot.sendMessage(chatId, `Тут адрес марго <br/> Укажите животное:`, {
                "reply_markup": {
                    "keyboard": menuLevelThree
                }
            })
        }
    }
    return bot.sendMessage(chatId, `Я тебя не понимаю, даун`)
})

//bot.on('callback_query', msg => {
//    const data = msg.data;
//    console.log(data, 'data')
//    const chatId = msg.message.chat.id;

//    if (data === 'chipping' || data === 'vaccination' || data === 'chippingVaccination') {
//        return bot.sendMessage(chatId, "Выберите способ доставки:", menuLevelTwo);
//    }
//    //if (data === '/again') {
//    //    return startGame(chatId)
//    //}
//    //const user = await UserModel.findOne({ chatId })
//    //if (data == chats[chatId]) {
//    //    user.right += 1;
//    //    await bot.sendMessage(chatId, `Поздравляю, ты отгадал цифру ${chats[chatId]}`, againOptions);
//    //} else {
//    //    user.wrong += 1;
//    //    await bot.sendMessage(chatId, `К сожалению ты не угадал, бот загадал цифру ${chats[chatId]}`, againOptions);
//    //}
//    //await user.save();
//})

