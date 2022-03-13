const getLabelService = (value) => {
    switch (value) {
        case "chipping":
            return 'Записаться на чипирование (5000 рублей)'
        case "vaccination":
            return 'Записаться вакцинацию (5000 рублей)'
        case "chippingVaccination":
            return 'Записаться на чипирование и вакцинацию (5000 рублей)'
        default:
            return ''
    }
}

const getLabelDeparture = (value) => {
    switch (value) {
        case "departureHouse":
            return 'Выезд на дом (+2000 рублей)'
        case "departureSpecialist":
            return 'Выезд к специалисту'
        default:
            return ''
    }
}
const getLabelAnimal = (value) => {
    switch (value) {
        case "dog":
            return 'Собака'
        case "cat":
            return 'Кошка'

        default:
            return ''
    }
}
module.exports = {
    getLabelService,
    getLabelDeparture,
    getLabelAnimal
}