class Motorcycle extends Transportation {
  constructor(make, model, year, color, hasDualChannelABS) {
    super(make, model, year, color);
    this.hasDualChannelABS = hasDualChannelABS;
  }
  show() {
    return `${this.present()}\n\nIt is a ${
      this.hasDualChannelABS ? 'dual channel ABS' : 'regular'
    } motorcycle`;
  }
}
