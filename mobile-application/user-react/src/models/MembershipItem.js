export class MembershipItem {
  constructor({
    id,
    customerId,
    gymName,
    gymLocation,
    gymImageUrl,
    planName,
    durationDays,
    amountPaid,
    startDate,
    endDate,
    paymentMode,
    otp,
    status = 'Active',
    hasPersonalTrainer = false,
    trainerName = null,
    trainerSpecialty = null,
    trainerSchedule = null,
    trainerFee = null,
  }) {
    this.id = id;
    this.customerId = customerId;
    this.gymName = gymName;
    this.gymLocation = gymLocation;
    this.gymImageUrl = gymImageUrl;
    this.planName = planName;
    this.durationDays = durationDays;
    this.amountPaid = amountPaid;
    this.startDate = startDate;
    this.endDate = endDate;
    this.paymentMode = paymentMode;
    this.otp = otp;
    this.status = status;
    this.hasPersonalTrainer = hasPersonalTrainer;
    this.trainerName = trainerName;
    this.trainerSpecialty = trainerSpecialty;
    this.trainerSchedule = trainerSchedule;
    this.trainerFee = trainerFee;
  }
}
