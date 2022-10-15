class Transportation {
  constructor(make, model, year, color) {
    this.make = make;
    this.model = model;
    this.year = year;
    this.color = color;
  }
  present() {
    return `Transportation details: \nMake: ${this.make}\nModel: ${this.model}\nYear: ${this.year}\nColor: ${this.color}`;
  }
}
