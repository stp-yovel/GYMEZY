export class BookingItem {
  constructor({
    id,
    customerId,
    gymName,
    gymLocation,
    gymImageUrl,
    type,
    sessionSubtitle,
    date,
    time,
    daysBooked,
    amountPaid,
    paymentMode,
    otp,
    status = 'Upcoming',
    iconName = 'fitness-center',
    accentColor = '#003882',
    cancellationReason = null,
  }) {
    this.id = id;
    this.customerId = customerId;
    this.gymName = gymName;
    this.gymLocation = gymLocation;
    this.gymImageUrl = gymImageUrl;
    this.type = type;
    this.sessionSubtitle = sessionSubtitle;
    this.date = date;
    this.time = time;
    this.daysBooked = daysBooked;
    this.amountPaid = amountPaid;
    this.paymentMode = paymentMode;
    this.otp = otp;
    this.status = status;
    this.iconName = iconName;
    this.accentColor = accentColor;
    this.cancellationReason = cancellationReason;
  }
}
