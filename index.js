const TelegramApi = require('node-telegram-bot-api')

const token = '5101558772:AAFrFojpVsY6RVuZkK24FNSs7UoYVcDW8gs'

const bot = new TelegramApi(token, { polling: true })

const selectServiceMenu = [["Записаться на чипирование (5000 рублей)"], ["Записаться вакцинацию (5000 рублей)"], ["Записаться на чипирование и вакцинацию (10000 рублей)"]]
const selectDepartureMenu = [["Выезд на дом (+2000 рублей)"], ["Выезд к специалисту"]]
const selectAnimalMenu = [["Собака"], ["Кошка"]]
const selectAddressUserPlug = [["Введите ваш адрес :arrow_heading_up:"]]
const selectOtherInfoPlug = [["Введите дополнительную информацию"]]


const addressMargo = 'г. Одинцово, Можайское Шоссе, д.25'


const getValueService = (label) => {
    switch (label) {
        case "Записаться на чипирование (5000 рублей)":
            return 'chipping'
        case "Записаться вакцинацию (5000 рублей)":
            return 'vaccination'
        case "Записаться на чипирование и вакцинацию (5000 рублей)":
            return 'chippingVaccination'
        default:
            return ''
    }
}

const getValueDeparture = (label) => {
    switch (label) {
        case "Выезд на дом (+2000 рублей)":
            return 'departureHouse'
        case "Выезд к специалисту":
            return 'departureSpecialist'

        default:
            return ''
    }
}
const getValueAnimal = (label) => {
    switch (label) {
        case "Собака":
            return 'dog'
        case "Кошка":
            return 'cat'

        default:
            return ''
    }
}
const getInfoUser = (userId, chatId) => {
    const userInfo = baza.find(item => item.userId === userId)

    if (userInfo) {
        return userInfo
    } else {
        const newUser = {
            chatId: chatId,
            userId: userId,
            service: null,
            departure: null,
            animal: null,
            otherInfo: null
        }
        baza.push(newUser)
        return newUser
    }
}

const editInfoUser = (field, infoUser, address = undefined, label = undefined, value = undefined,) => {
    if (!address && !label) {
        infoUser[field] = value
        return infoUser
    }
    if (address) {
        infoUser[field] = label && value ? {
            label,
            value,
            address: address
        } : {
            ...infoUser[field],
            address: address
        }
        return infoUser
    }

    infoUser[field] = { label, value }
    return infoUser
}

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


const defaultModel = {
    chatId: 8957,
    userId: 111,
    service: {
        label: 'Записаться на чипирование (5000 рублей)',
        value: 'chipping'
    },
    departure: {
        label: 'Выезд на дом (+2000 рублей)',
        value: 'departureHouse',
        address: 'ул. Ленина дом 25'
    },
    animal: {
        label: 'Кот',
        value: 'cat'
    },
    otherInfo: ''
}

const baza = []

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
    const userId = msg.from.id
    const infoUser = getInfoUser(userId, chatId)



    if (text === '/info') {
        return bot.sendMessage(chatId, `Марго это врач`)
    }

    if (text === '/start' || text === '/menu') {
        return bot.sendMessage(chatId, "Выберите услугу:", {
            "reply_markup": {
                "keyboard": selectServiceMenu
            }
        });
    }

    if (selectServiceMenu.find((item) => item[0] === text)) {
        const label = text
        const value = getValueService(label)
        const newUserInfo = editInfoUser('service', infoUser, undefined, label, value)
        baza[0] = newUserInfo //сохраняем на "сервер"
        console.log(baza, 'ПОСЛЕ ВЫБОРА УСЛУГИ')
        return bot.sendMessage(chatId, `Вы выбрали ${label}, укажите тип выезда`, {
            "reply_markup": {
                "keyboard": selectDepartureMenu
            }
        });
    }

    if (selectDepartureMenu.find((item) => item[0] === text)) {
        const label = text
        const value = getValueDeparture(label)

        if (value === 'departureSpecialist') {
            const newUserInfo = editInfoUser('departure', infoUser, addressMargo, label, value)
            baza[0] = newUserInfo //сохраняем на "сервер"
            console.log(baza, 'ПОСЛЕ ВЫБОРА ПРИЕХАТЬ САМОМУ')
            return bot.sendMessage(chatId, `Тут адрес марго <br/> Укажите животное:`, {
                "reply_markup": {
                    "keyboard": selectAnimalMenu
                }
            })
        } else if (value === 'departureHouse') {
            const newUserInfo = editInfoUser('departure', infoUser, undefined, label, value)
            baza[0] = newUserInfo //сохраняем на "сервер"
            console.log(baza, 'ПОСЛЕ ВЫБОРА ВЫЗВАТЬ СПЕЦА НА ДОМ')

            return bot.sendMessage(chatId, `Введите ваш адрес`, {
                "reply_markup": {
                    "keyboard": selectAddressUserPlug
                }
            })
        }

    }

    if (selectAnimalMenu.find((item) => item[0] === text)) {
        const label = text
        const value = getValueAnimal(label)
        const newUserInfo = editInfoUser('animal', infoUser, undefined, label, value)
        baza[0] = newUserInfo //сохраняем на "сервер"
        console.log(baza, 'ПОСЛЕ ВЫБОРА ЖИВОТНОГО')

        return bot.sendMessage(chatId, `Вы выбрали ${label}, Добавьте примечание`, {
            "reply_markup": {
                "keyboard": selectOtherInfoPlug
            }
        });
    }

    if (infoUser.service && !infoUser.departure.address) {
        const newUserInfo = editInfoUser('departure', infoUser, text)
        baza[0] = newUserInfo //сохраняем на "сервер"
        console.log(baza, 'ПОСЛЕ УКАЗАНИЯ АДРЕСА ДЛЯ ВЫЕЗДА ВРАЧА НА ДОМ')

        return bot.sendMessage(chatId, `Вы указали адрес ${text}. Выберите животное: `, {
            "reply_markup": {
                "keyboard": selectAnimalMenu
            }
        });
    }

    if (infoUser.service && infoUser.departure.address) {
        const newUserInfo = editInfoUser('otherInfo', infoUser, undefined, undefined, text)
        baza[0] = newUserInfo //сохраняем на "сервер"
        console.log(baza, 'ПОСЛЕ ВЫБОРА Ввода примечания')
        return bot.sendMessage(chatId, `Оформление прошло успешно. Заказанная услуга: ${infoUser.service.label}, ${infoUser.departure.value === 'departureHouse' ? `вы заказали вызов врача на адрес ${infoUser.departure.address}` : `адрес врача: ${infoUser.departure.address}`}. Ваше животное: ${infoUser.animal.label}. В ближайшее время с вами свяжутся для подтверждения информации`, {
            "reply_markup": {
                "keyboard": selectOtherInfoPlug
            }
        });
    }


    return bot.sendMessage(chatId, `Я тебя не понимаю, даун`)
})

//bot.on('callback_query', msg => {
//    console.log(msg, 'msg in callback_query')

//})

