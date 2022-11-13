try {
  console.log(`Script.js has been sucessfully loaded.`);
} catch (error) {
  console.error(`Script.js has not been loaded as expected. ${error}`);
}

$(() => {
  $('.masthead-brand').dblclick(function () {
    party.confetti(this, {
      count: party.variation.range(100, 500),
      size: party.variation.range(0.5, 1.0),
    });
  });

  $('.language').click((element) => {
    const lang = element.target.id;

    $('.translate').each((_, item) => {
      $(item).text(data[lang][$(item).attr('key')]);
    });
  });

  fetch('https://jsonplaceholder.typicode.com/users')
    .then((response) => response.json())
    .then((json) => {
      const filteredData = json.map((data) => ({
        id: data.id,
        name: data.name,
        username: data.username,
        telephone: data.phone,
        email: data.email,
        website: data.website,
      }));

      $('#userTable').DataTable({
        data: filteredData,
        columns: [
          { data: 'id' },
          { data: 'name' },
          { data: 'username' },
          { data: 'telephone' },
          { data: 'email' },
          { data: 'website' },
        ],
      });
    });
});

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
    2020,
    'Platinum Gray Metallic',
    true
  );
  console.log(myCar.show());

  let myMotorcycle = new Motorcycle('Yahama', 'YZF-R1', 2022, 'Blue', true);
  console.log(myMotorcycle.show());
}
