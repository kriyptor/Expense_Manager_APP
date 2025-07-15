const crypto = require(`crypto`);

exports.getMonthFromNumber = (num) => {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    return monthNames[parseInt(num)-1];
}


exports.generateOrderId = () => {
  const uniqueId = crypto.randomBytes(16).toString('hex');

  const hash = crypto.createHash('sha256');
  hash.update(uniqueId);

  const orderId = hash.digest('hex');

  return orderId.slice(0, 12);
}