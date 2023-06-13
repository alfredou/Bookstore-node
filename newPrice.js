const NewPrice = (price) => {
    const Nprice = price.split("$")[1]
    return Number(Nprice)
}

module.exports = NewPrice