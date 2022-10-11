try {
  console.log(`Script.js has been sucessfully loaded.`);
} catch (error) {
  console.error(`Script.js has not been loaded as expected. ${error}`);
}

const firstName = 'Diego';
const lastName = 'Arndt';
console.log(
  `First name: ${firstName}\nLast name: ${lastName}\nFull name: ${firstName} ${lastName}`
);

function sum() {
  const firstValue = +document.getElementById('first-number').value;
  const secondValue = +document.getElementById('second-number').value;
  const result = firstValue + secondValue;
  document.getElementById('result').value = result;

  console.log(
    `The first value entered was ${firstValue}\nThe second one was ${secondValue}\nSo the sum of these two values is ${result}`
  );
}

function clearText() {
  document.getElementById('first-number').value = 0;
  document.getElementById('second-number').value = 0;
  document.getElementById('result').value = 0;
}

function createObj() {
  console.clear();

  let myCar = new Car(
    'Volkswagen',
    'Tiguan R-Line',
    2019,
    'Platinum Gray Metallic',
    true
  );
  console.log(myCar.show());

  let myMotorcycle = new Motorcycle('Yahama', 'YZF-R1', 2022, 'Blue', true);
  console.log(myMotorcycle.show());
}
