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
        email: data.email,
        telephone: data.phone,
      }));

      $('#userTable').DataTable({
        data: filteredData,
        pageLength: 5,
        lengthMenu: [1, 5, 10],
        columns: [
          { data: 'id' },
          { data: 'name' },
          { data: 'email' },
          { data: 'telephone' },
        ],
      });
    });

  const brands = new Set(['Starbucks', 'Tim Hortons', 'Mercedes']);
  console.log(brands);
  brands.add('BMW');
  brands.delete('Mercedes');
  console.log(brands);
  console.log('Is BMW in the set? ' + brands.has('BMW'));
  console.log('Is VW in the set? ' + brands.has('VW'));
  brands.clear();
  console.log(brands);
  console.log('The brands set is empty, nothing to show here.');

  const carsWarehouse = new Map([
    ['golf', 250],
    ['corolla', 170],
    ['civic', 280],
    ['forte', 80],
  ]);

  console.log(carsWarehouse);
  carsWarehouse.set('tiguan', 50);
  console.log('Qty of civics: ' + carsWarehouse.get('civic'));
  carsWarehouse.delete('golf');
  console.log(carsWarehouse);
  carsWarehouse.set('tiguan', 80);
  console.log(
    '30 tiguans were added to the warehouse. New total: ' +
      carsWarehouse.get('tiguan')
  );
  carsWarehouse.clear();
  console.log(carsWarehouse);
  console.log('The car warehouse has been closed, all cars were sold.');

  // Idea of three JS project by https://tympanus.net/codrops/2019/10/14/how-to-create-an-interactive-3d-character-with-three-js/

  let scene,
    renderer,
    camera,
    model,
    neck,
    waist,
    possibleAnims,
    mixer,
    idle,
    clock = new THREE.Clock(),
    currentlyAnimating = false,
    raycaster = new THREE.Raycaster();

  init();

  function init() {
    const MODEL_PATH =
      'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1376484/blender-tut-stacy.glb';
    const canvas = document.querySelector('#c');
    const backgroundColor = 0xffffff;

    scene = new THREE.Scene();
    scene.background = new THREE.Color(backgroundColor);
    scene.fog = new THREE.Fog(backgroundColor, 60, 100);

    renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.shadowMap.enabled = true;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth / 2, window.innerHeight / 2);
    document.getElementById('three-js-space').appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      400
    );
    camera.position.z = 30;
    camera.position.x = 0;
    camera.position.y = -3;

    let stacy_txt = new THREE.TextureLoader().load(
      'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1376484/stacy.jpg'
    );
    stacy_txt.flipY = false;

    const stacy_mtl = new THREE.MeshPhongMaterial({
      map: stacy_txt,
      color: 0xffffff,
      skinning: true,
    });

    var loader = new THREE.GLTFLoader();

    loader.load(
      MODEL_PATH,
      function (gltf) {
        model = gltf.scene;
        let fileAnimations = gltf.animations;

        model.traverse((o) => {
          if (o.isMesh) {
            o.castShadow = true;
            o.receiveShadow = true;
            o.material = stacy_mtl;
          }
          if (o.isBone && o.name === 'mixamorigNeck') {
            neck = o;
          }
          if (o.isBone && o.name === 'mixamorigSpine') {
            waist = o;
          }
        });

        model.scale.set(0.65, 0.65, 0.65);
        model.position.y = -11;

        scene.add(model);

        mixer = new THREE.AnimationMixer(model);

        let clips = fileAnimations.filter((val) => val.name !== 'idle');
        possibleAnims = clips.map((val) => {
          let clip = THREE.AnimationClip.findByName(clips, val.name);

          clip.tracks.splice(3, 3);
          clip.tracks.splice(9, 3);

          clip = mixer.clipAction(clip);
          return clip;
        });

        let idleAnim = THREE.AnimationClip.findByName(fileAnimations, 'idle');

        idleAnim.tracks.splice(3, 3);
        idleAnim.tracks.splice(9, 3);

        idle = mixer.clipAction(idleAnim);
        idle.play();
      },
      undefined,
      function (error) {
        console.error(error);
      }
    );

    let hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.61);
    hemiLight.position.set(0, 50, 0);
    scene.add(hemiLight);

    let d = 8.25;
    let dirLight = new THREE.DirectionalLight(0xffffff, 0.54);
    dirLight.position.set(-8, 12, 8);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
    dirLight.shadow.camera.near = 0.1;
    dirLight.shadow.camera.far = 1500;
    dirLight.shadow.camera.left = d * -1;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = d * -1;
    scene.add(dirLight);

    let floorGeometry = new THREE.PlaneGeometry(5000, 5000, 1, 1);
    let floorMaterial = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      shininess: 0,
    });

    let floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -0.5 * Math.PI;
    floor.receiveShadow = true;
    floor.position.y = -11;
    scene.add(floor);

    let geometry = new THREE.SphereGeometry(12, 128, 4);
    let material = new THREE.MeshBasicMaterial({ color: ('#'+Math.random() * 0xfffff * 1000000).toString(16).slice(0, 7) });
    let sphere = new THREE.Mesh(geometry, material);

    sphere.position.z = -15;
    sphere.position.y = -2.5;
    sphere.position.x = -0.25;
    scene.add(sphere);
  }

  function update() {
    if (mixer) {
      mixer.update(clock.getDelta());
    }

    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();

    renderer.render(scene, camera);
    requestAnimationFrame(update);
  }

  update();

  window.addEventListener('click', (e) => raycast(e));
  window.addEventListener('touchend', (e) => raycast(e, true));

  function raycast(e, touch = false) {
    var mouse = {};
    if (touch) {
      mouse.x = 2 * (e.changedTouches[0].clientX / window.innerWidth) - 1;
      mouse.y = 1 - 2 * (e.changedTouches[0].clientY / window.innerHeight);
    } else {
      mouse.x = 2 * (e.clientX / window.innerWidth) - 1;
      mouse.y = 1 - 2 * (e.clientY / window.innerHeight);
    }
    raycaster.setFromCamera(mouse, camera);

    var intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects[0]) {
      var object = intersects[0].object;

      if (object.name === 'stacy') {
        if (!currentlyAnimating) {
          currentlyAnimating = true;
          playOnClick();

          party.confetti(document.getElementById('c'), {
            count: party.variation.range(100, 500),
            size: party.variation.range(0.5, 1.0),
          });
        }
      }
    }
  }

  function playOnClick() {
    let anim = Math.floor(Math.random() * possibleAnims.length) + 0;
    playModifierAnimation(idle, 0.25, possibleAnims[anim], 0.25);
  }

  function playModifierAnimation(from, fSpeed, to, tSpeed) {
    to.setLoop(THREE.LoopOnce);
    to.reset();
    to.play();
    from.crossFadeTo(to, fSpeed, true);
    setTimeout(function () {
      from.enabled = true;
      to.crossFadeTo(from, tSpeed, true);
      currentlyAnimating = false;
    }, to._clip.duration * 1000 - (tSpeed + fSpeed) * 1000);
  }

  document.addEventListener('mousemove', function (e) {
    var mousecoords = getMousePos(e);
    if (neck && waist) {
      moveJoint(mousecoords, neck, 50);
      moveJoint(mousecoords, waist, 30);
    }
  });

  function getMousePos(e) {
    return { x: e.clientX, y: e.clientY };
  }

  function moveJoint(mouse, joint, degreeLimit) {
    let degrees = getMouseDegrees(mouse.x, mouse.y, degreeLimit);
    joint.rotation.y = THREE.Math.degToRad(degrees.x);
    joint.rotation.x = THREE.Math.degToRad(degrees.y);
  }

  function getMouseDegrees(x, y, degreeLimit) {
    let dx = 0,
      dy = 0,
      xdiff,
      xPercentage,
      ydiff,
      yPercentage;

    let w = { x: window.innerWidth, y: window.innerHeight };

    if (x <= w.x / 2) {
      xdiff = w.x / 2 - x;
      xPercentage = (xdiff / (w.x / 2)) * 100;
      dx = ((degreeLimit * xPercentage) / 100) * -1;
    }

    if (x >= w.x / 2) {
      xdiff = x - w.x / 2;
      xPercentage = (xdiff / (w.x / 2)) * 100;
      dx = (degreeLimit * xPercentage) / 100;
    }
    if (y <= w.y / 2) {
      ydiff = w.y / 2 - y;
      yPercentage = (ydiff / (w.y / 2)) * 100;
      dy = ((degreeLimit * 0.5 * yPercentage) / 100) * -1;
    }
    if (y >= w.y / 2) {
      ydiff = y - w.y / 2;
      yPercentage = (ydiff / (w.y / 2)) * 100;
      dy = (degreeLimit * yPercentage) / 100;
    }
    return { x: dx, y: dy };
  }
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

  $('.toast').toast({ animation: true, autohide: true, delay: 5000 });
  $('.toast').toast('show');

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

function runRandomLoop() {
  const qtyNumbers = +document.getElementById('qty-numbers-random').value;
  let numbersString = '';

  if (qtyNumbers > 99) {
    document.getElementById('loop-result-random').innerHTML =
      'This number is too big, try a smaller one (Max 99).';
  } else {
    while (numbersString.split(' ').length <= qtyNumbers) {
      const randomNumber = Math.floor(Math.random() * 100) + 1;
      if (!numbersString.includes(randomNumber)) {
        numbersString += `${randomNumber} `;
      }
    }
    document.getElementById(
      'loop-result-random'
    ).innerHTML = `Numbers: ${numbersString}`;
  }
}

function runLoop() {
  const qtyNumbers = +document.getElementById('qty-numbers').value;
  let numbersString = '';

  if (qtyNumbers > 999) {
    document.getElementById(
      'loop-result'
    ).innerHTML = `This number is too big, try a smaller one (Max 999).`;
  } else {
    for (let i = 1; i <= qtyNumbers; i++) {
      numbersString += `${i} `;
    }
    document.getElementById(
      'loop-result'
    ).innerHTML = `Numbers: ${numbersString}`;
  }
}
