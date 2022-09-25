try {
  console.log(`Script.js has been sucessfully loaded.`);
} catch (error) {
  console.error(`Script.js has not been loaded as expected. ${error}`);
}

function sum() {
  document.getElementById('result').value =
    +document.getElementById('first-number').value +
    +document.getElementById('second-number').value;
}
