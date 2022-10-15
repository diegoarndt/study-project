class Car extends Transportation {
  constructor(make, model, year, color, isAutomatic) {
    super(make, model, year, color);
    this.isAutomatic = isAutomatic;
  }
  show() {
    return `${this.present()}\n\nIt is an ${
      this.isAutomatic ? 'automatic' : 'manual'
    } car`;
  }

}
