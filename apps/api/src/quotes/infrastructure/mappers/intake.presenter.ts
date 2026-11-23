export class IntakePresenter {
  static availability(unavailableDates: string[]) {
    return { unavailableDates }
  }
  static receipt() {
    return { accepted: true } as const
  }
}
