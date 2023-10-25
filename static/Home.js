let renderer, scene, camera, cameraCtrl;
let width, height, cx, cy, wWidth, wHeight;
const TMath = THREE.Math;

const list = [
  "HTML5. ","Javascript. ", "Python. ", "LLaMA🦙. ", "Stable Diffusion. ", "React.JS ", "Node.JS  ", "Three.JS ", "Typescript. ", "Flask. ", "Bash. ", "OpenCV. ", "Selenium. ", "Java. "
]
let wordCount=0,letterCount=0,typing=true;
let conf = {
    color: 0xffffff,
    objectWidth: 12,
    objectThickness: 3,
    ambientColor: 0x808080,
    light1Color: 0xffffff,
    shadow: false,
    perspective: 75,
    cameraZ: 75
};
let conf2 = {
    fov: 75,
    cameraZ: 75,
    xyCoef: 50,
    zCoef: 10,
    lightIntensity: 0.9,
    ambientColor: 0x000000,
    light1Color: 0x0E09DC,
    light2Color: 0x1CD1E1,
    light3Color: 0x18C02C,
    light4Color: 0xee3bcf
};
let plane;
const simplex = new SimplexNoise();
const mouse = new THREE.Vector2();
const mousePlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
const mousePosition = new THREE.Vector3();
const raycaster = new THREE.Raycaster();
let noiseInput = 50 
let heightInput = 50
let objects = [];
let introgeometry, material;
let hMap, hMap0, nx, ny;

init();

function init() {
    renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById('reveal-effect'),
        antialias: true,
        alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(conf.perspective, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = conf.cameraZ;

    scene = new THREE.Scene();
    introgeometry = new THREE.BoxGeometry(conf.objectWidth, conf.objectWidth, conf.objectThickness);
    noiseInput.value = 101 - conf2.xyCoef;
    heightInput.value = conf2.zCoef * 100 / 25;
    document.body.addEventListener('click', e => {
        if (!document.body.classList.contains('revealed') && !document.body.classList.contains('revealing')) {
            scene.remove(imagemesh);
            setTimeout(startName, 2000, "Hi, I'm Siddharth Nachane", 0);
            setTimeout(startList, 2000);
            startAnim();
        } else {
            updateLightsColors();
        }
    });
    updateSize();
    window.addEventListener('resize', updateSize, false);
    window.addEventListener('load', initScene);
    document.addEventListener('mousemove', e => {
        const v = new THREE.Vector3();
        camera.getWorldDirection(v);
        v.normalize();
        mousePlane.normal = v;
        mouse.x = e.clientX / width * 2 - 1;
        mouse.y = -(e.clientY / height) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        raycaster.ray.intersectPlane(mousePlane, mousePosition);
    });
    animate();
};

function startName(name, i) {
    document.getElementById("name").innerHTML = document.getElementById("name").innerHTML.slice(0, -2);//-2 because 𝖨 takes 2 characters
    if (i < name.length) {
        document.getElementById("name").innerHTML += (name.charAt(i++) + "𝖨");
        setTimeout(startName, 100, name, i);
    }
    else{
        i=8;
        document.getElementById("name").innerHTML = document.getElementById("name").innerHTML.slice(0, i) + "<b><mark></mark></b>" + document.getElementById("name").innerHTML.slice(i);
        startHighlight(name, i);
    }
}
function startHighlight(name,i) {
    if (i < name.length) {
        let j = document.getElementById("name").innerHTML.indexOf("</mark></b>");
        document.getElementById("name").innerHTML = document.getElementById("name").innerHTML.slice(0, j)+name.charAt(i)+ "</mark></b>" + document.getElementById("name").innerHTML.slice(j+12);
        setTimeout(startHighlight, 50, name, ++i);
    }
}
async function startList() {
    let wait = false
    if (typing){
      document.getElementById("list").innerHTML = document.getElementById("list").innerHTML.slice(0, -2);//-2 because 𝖨 takes 2 characters
      document.getElementById("list").innerHTML += (list[wordCount].charAt(letterCount++) + "𝖨");
      if (letterCount>=list[wordCount].length){
        letterCount--;
        typing = false;
        wait = true;
        setTimeout(startList, 500);
      }
    }
    else{
      document.getElementById("list").innerHTML = document.getElementById("list").innerHTML.slice(0, -3);
      document.getElementById("list").innerHTML += "𝖨";
      if (--letterCount<0){
        letterCount=0
        wordCount = wordCount+1>=list.length?0:wordCount+1
        typing = true;
        wait = true;
        setTimeout(startList, 250);
      }
    }
    if (!wait){
      let max=140, min=80;
      setTimeout(startList, Math.floor(Math.random() * (max - min + 1) + min));
    }
    
}


function initScene() {
    onResize();
    scene = new THREE.Scene();
    initObjects();
    initLights();
}

function initLights() {
    ambient = new THREE.AmbientLight(conf.ambientColor)
    scene.add(ambient);
    alight1 = new THREE.PointLight(0xffffff);
    alight1.position.z = 10000;
    scene.add(alight1);
    alight2 = new THREE.PointLight(0xffffff);
    alight2.position.z = 0;
    scene.add(alight2);
    const r = 30;
    const y = 10;
    const lightDistance = 500;
    // light = new THREE.AmbientLight(conf2.ambientColor);
    // scene.add(light);

    light1 = new THREE.PointLight(conf2.light1Color, conf2.lightIntensity, lightDistance);
    light1.position.set(0, y, r);
    scene.add(light1);
    light2 = new THREE.PointLight(conf2.light2Color, conf2.lightIntensity, lightDistance);
    light2.position.set(0, -y, -r);
    scene.add(light2);
    light3 = new THREE.PointLight(conf2.light3Color, conf2.lightIntensity, lightDistance);
    light3.position.set(r, y, 0);
    scene.add(light3);
    light4 = new THREE.PointLight(conf2.light4Color, conf2.lightIntensity, lightDistance);
    light4.position.set(-r, y, 0);
    scene.add(light4);

}

function initObjects() {
    loader = new THREE.TextureLoader();
    imagematerial = new THREE.MeshLambertMaterial({
        //map: loader.load('images/start.jpg')
        map: loader.load(image())
    });
    imagegeometry = new THREE.PlaneGeometry(8, 8);
    imagemesh = new THREE.Mesh(imagegeometry, imagematerial);
    imagemesh.position.set(0, 0, 50)
    scene.add(imagemesh);
    let mat = new THREE.MeshLambertMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide
    });
    // let mat = new THREE.MeshPhongMaterial({ color: 0xffffff });
    // let mat = new THREE.MeshStandardMaterial({ color: 0x808080, roughness: 0.5, metalness: 0.8 });
    let geo = new THREE.PlaneBufferGeometry(wWidth, wHeight, wWidth / 2, wHeight / 2);
    plane = new THREE.Mesh(geo, mat);
    scene.add(plane);
    plane.rotation.x = -Math.PI / 2 - 0.2;
    plane.position.y = -25;
    camera.position.z = 60;
    objects = [];
    nx = Math.round(wWidth / conf.objectWidth) + 1;
    ny = Math.round(wHeight / conf.objectWidth) + 1;
    let mesh, x, y;
    for (let i = 0; i < nx; i++) {
        for (let j = 0; j < ny; j++) {
            material = new THREE.MeshLambertMaterial({
                color: conf.color,
                transparent: true,
                opacity: 1
            });
            mesh = new THREE.Mesh(introgeometry, material);
            x = -wWidth / 2 + i * conf.objectWidth;
            y = -wHeight / 2 + j * conf.objectWidth;
            mesh.position.set(x, y, 0);
            objects.push(mesh);
            scene.add(mesh);
        }
    }
    document.body.classList.add('loaded');
}

function startAnim() {
    setTimeout(setInterval(function() {
        if (ambient.intensity > 0) {
            ambient.intensity -= 0.01;
            alight1.intensity -= 0.01;
            alight2.intensity -= 0.01
        }
    }, 50), 2500);
    document.body.classList.remove('revealed');
    document.body.classList.add('revealing');
    objects.forEach(mesh => {
        mesh.rotation.set(0, 0, 0);
        mesh.material.opacity = 1;
        mesh.position.z = 0;
        let delay = TMath.randFloat(1, 2);
        let rx = TMath.randFloatSpread(2 * Math.PI);
        let ry = TMath.randFloatSpread(2 * Math.PI);
        let rz = TMath.randFloatSpread(2 * Math.PI);
        TweenMax.to(mesh.rotation, 2, {
            x: rx,
            y: ry,
            z: rz,
            delay: delay
        });
        TweenMax.to(mesh.position, 2, {
            z: 80,
            delay: delay + 0.5,
            ease: Power1.easeOut
        });
        TweenMax.to(mesh.material, 2, {
            opacity: 0,
            delay: delay + 0.5
        });
    });
    setTimeout(() => {
        document.body.classList.add('revealed');
        document.body.classList.remove('revealing');
    }, 2500);
}

function animate() {
    requestAnimationFrame(animate);
    animatePlane();
    animateLights();
    renderer.render(scene, camera);
};

function animatePlane() {
    gArray = plane.geometry.attributes.position.array;
    const time = Date.now() * 0.0002;
    for (let i = 0; i < gArray.length; i += 3) {
        gArray[i + 2] = simplex.noise4D(gArray[i] / conf2.xyCoef, gArray[i + 1] / conf2.xyCoef, time, mouse.x + mouse.y) * conf2.zCoef;
    }
    plane.geometry.attributes.position.needsUpdate = true;
    plane.geometry.computeBoundingSphere();
}

function animateLights() {
    const time = Date.now() * 0.001;
    const d = 50;
    light1.position.x = Math.sin(time * 0.1) * d;
    light1.position.z = Math.cos(time * 0.2) * d;
    light2.position.x = Math.cos(time * 0.3) * d;
    light2.position.z = Math.sin(time * 0.4) * d;
    light3.position.x = Math.sin(time * 0.5) * d;
    light3.position.z = Math.sin(time * 0.6) * d;
    light4.position.x = Math.sin(time * 0.7) * d;
    light4.position.z = Math.cos(time * 0.8) * d;
}

function updateLightsColors() {
    conf2.light1Color = chroma.random().hex();
    conf2.light2Color = chroma.random().hex();
    conf2.light3Color = chroma.random().hex();
    conf2.light4Color = chroma.random().hex();
    light1.color = new THREE.Color(conf2.light1Color);
    light2.color = new THREE.Color(conf2.light2Color);
    light3.color = new THREE.Color(conf2.light3Color);
    light4.color = new THREE.Color(conf2.light4Color);
}

function onResize() {
    width = window.innerWidth;
    cx = width / 2;
    height = window.innerHeight;
    cy = height / 2;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    size = getRendererSize();
    wWidth = size[0];
    wHeight = size[1];
}

function updateSize() {
    width = window.innerWidth;
    cx = width / 2;
    height = window.innerHeight;
    cy = height / 2;
    if (renderer && camera) {
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        const wsize = getRendererSize();
        wWidth = wsize[0];
        wHeight = wsize[1];
    }
}

function getRendererSize() {
    const cam = new THREE.PerspectiveCamera(camera.fov, camera.aspect);
    const vFOV = cam.fov * Math.PI / 180;
    const height = 2 * Math.tan(vFOV / 2) * Math.abs(conf.cameraZ);
    const width = (height * cam.aspect) + 200;
    return [width, height];
}

function image() {
    return 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD//gAfQ29tcHJlc3NlZCBieSBqcGVnLXJlY29tcHJlc3P/2wCEAAQEBAQEBAQEBAQGBgUGBggHBwcHCAwJCQkJCQwTDA4MDA4MExEUEA8QFBEeFxUVFx4iHRsdIiolJSo0MjRERFwBBAQEBAQEBAQEBAYGBQYGCAcHBwcIDAkJCQkJDBMMDgwMDgwTERQQDxAUER4XFRUXHiIdGx0iKiUlKjQyNEREXP/CABEIAgACAAMBIgACEQEDEQH/xAAdAAEBAAIDAQEBAAAAAAAAAAAAAQgJBQYHBAID/9oACAEBAAAAAM/ahUKhUKhUKhUKhUKhUKlQqFQqFQqFQqFQqFQqFRYVCoVCoVCoVCoVCoVCoCoVCoVCoVCoVCoVCoVCxUKhUKhUKhUKhUKhUKhQhUKhUKh1Xx3znzzrvHfy5fsfffTvW+2lQqFQqFSoVCoVCvxjtjHjl5vLKllPRMj8pMgv2VCoVCosKhUKheqYU4b9KqWVLKlldxzGzg7MhUKhUBUKhUOAwDwv46V3TIP3T1D0TuH0/vjerdC8f8Zx46TLOSzT2BcsqFQqFCFQqGI+uDrNnaMwMufXFQqFnkeIWInV07Psdy5sKhUKlQqFRw+rvF+Xu2eOYfJFQqFQ+TDvAjpMuTu0LnVQqFSoVCo801I+eT7M7c8uThUKhUKnG4JYHfHPQtt/pqFQqLCoVHhupPgZ6ttR9XQqFQqFQvk+q/yqc/tq90KhUBUKjxHUPxMym2nfUhUKhUKhU4nWDiu5Xbh7vUKhYqFR5lpu4GZsbJiFQqFQqFQmt3CW89uN9ShUKEKjhNMPnkzZ2SVCoVCoVCoVNbOFF9D3RcuqFSoVDVFjBMqNqtQqFQqFQqFQ1U4szJ3bBUKiwqGJOrmer7l+QQqFQqFQqFQvFaa/K5tBy9hUBUOC0i9Z+3c56qhUKhUKhUKhU8i01/J2feByqoUIXXHg7c/dgCFQqYt49eiZo8oVCoVCoa/MBpnJsZqFSoXqmj7ju7buPvhUKmCWu+u+bOMiKhUKhULx2kjpXI7wO2QqVCsAMAZsozWhUKjRT1lLcy9jfKlQqFQqYVa17n7n+VFhX40cdL7PvG5AqFQ0Bsj++Yax3zZtkVUKhUKj+Wi/rHc94f8AaoCpjnqOudGxQqFQugKZV7UsedY3QbcytjfLFQqFQuuXBu7esg0LFRrWwsbofW1QqFaAblbtQfBrcw1jvmzbIqoVCoV5HpemaWyyFCGknznuu8dUKhU0BzKnarDHnWN0G3MrY5ypUKhUmjnpXpG7QqVDrGiqZdbQ6hUKjQFcrdp5Xwa3MNY75s2yKqFQqGr7ERvP7bUWFxx1H3ZXmkhUKhoDZV7UVQx51j9AtzK2N8sVCoXCbW1du2Q6ArCrWvNvuQMKhULoCmVe1KoV8GtzDWO97NcjKhUK8F0+TZJm1ChNdeC13eegFQqFaAblbtQQqGPOsfoFuZWx7kyoVPPNItzt2HlSo1kYdN9/2qhUKmgOZU7VYVCvg1uYax7zuDVCo+DQkzF2bqlQ1b4lzfz/AEqFQqNAVyt2nlQqGPWsboF3P+vIVBoDmWW0uosLqxxPu/v9IVCoaA2Ve1FUKhcd9Y/Qpud9hhULNAVyz2lICtZGHM308rCoVC6AplXtSqFQ43W7hxJ7tuHFQr4dCEzC2eQsVNdmCt3gd8KhUK0A3K3aghUMfdYHQ7cxNkfKFQqecaSbnbsPKEYV6124L3pUKhU0BzKnarCo+DXDhj+b3vZtkZCoVHgWoBspzTVKhjxqKmyXNioVCo0BXK3aeVGPusPoM/eZexnl4VCoYWa1ptvyOqLC9U0Wsu9oSFQqGgNlXtRVOF114ZSd92eZCoVCoXVviT+t6vZ0BU0kec933jwqFQugKZV7UqmOusnoa5k7I+QQqFQs0cdK9H3bIUI1r4Vtz/rqoVCtANyt2oOJ1y4Zx3rZrkbUKhUK8j0vTNHZbCpUMetREzj2NVCoVNAcyp2q4/6v+g25k7FedqFQqFTXNg3dvGQhUqFmjXpvZ95H3QqFRoCuSPfMNPxe+bO8hVQqFQqcZo86z3PeSVFhU194DXZZmgVCoaK+ryz9ZlbIvvVCoVCoww1pM/c/1QFR1zRvx3dt2nJVCoXBPXbZ3vZ9kIVCoVCo+fSD0nkd3fcKhYqF1z4M3PvYEhUKmLuPXfc1eVKhUKhUNf2Akzm2L1ChCuG0g9Y+zct62VCoVCoVCoVDyfTN8faN33MIVKhUYkaunqm5Hl6hUKhUKhUKhxmmfy27RcuEKiwqDVDjBcptqn7hUKhUKhUKhNUmL1yf2u2FQFQrh9LfntzY2SFQqFQqFQqDWrhZfQ9zHYoVChCo80028BM1dlFQqFQqFQqE1r4V3ntxnqcKhUqFQvheoviplLtE5QqFQqFQqHFauMXryu3D3iFQqVCoVPCtS3AvU9p3rdQqFQqFQ8k1X+W3nts/vEKhUWFQqHl+pfzq/Vndnr95UKhUKj5MCMEPjvoW2f1SFQqAqFQrhtXOMFd1zxzQ/uhUKhU47ELAfpMuUGz7n4VCoWKhUKhiLrk6vZ2fLvL/ANcVCoV4/iLiF1lO07HMuLCoVChCoVCuJ1+YWccl7pkN7V693bu/1/vj+l9I8n8Lx/6TK5HNTYDy6FQqFSoVCoVDq+FGGvTJUsqWVLL3LMrM/uNQqFQqLCoVCoVP5eCYrY6ebpUsqfr0XIjKjIT9KhUKhUBUKhUKhU6p5H5f0fq/F/v7e2949I9o7OhUKhUKhQhUKhUKhUKhUKhUKhUKlQqFQqFQqFQqFQqFQqFSoVCoVCoVCoVCoVCoVCosKhUKhUKhUKhUKhUKhUBUKhUKhUKhUKhUKhUKhf/EABQBAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQIQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/9oACAEDEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/8QAMhAAAQIFBQEAAgICAgEFAAMAAgEhAAMFEjIEBgciUQgQMREUExUWIDcXIyQlQRgnYf/aAAgBAQABDABGgztZMgC11yVo7Ty8BGgztZMgC11yVo7Ty8BGgztZMgC11yVo7Ty8BGgztZMgC11yVo7Ty8BGgztZMgC11yVo7Ty8BGgztZMgC11yVo7Ty8BGgztZMgC11yVo7Ty8BGgztZMgC11yVo7Ty8BGgztZMgC11yVo7Ty8BGgztZMgC11yVo7Ty8BGgztZMgC11yVo7Ty8BGgztZMgC11yVo7Ty8BGgztZMgC11yVoM7WTIAtdclaO08vARoM7WTIAtdclaO08vARoM7WTIAtdclaO08vARoM7WTIAtdclaO08vARoM7WTIAtdclaO08vARoM7WTIAtdclaO08vARoM7WTIAtdclaO08vARoM7WTIAtdclaO08vARoM7WTIAtdclaO08vARoM7WTIAtdclaO08vARoM7WTIAtdclaO08vARoM7WTIAtdclaO08vARoM7WTIAtdclaO08vAALXXJWjtPLwEaDO1kyALXXJWjtPLwEaDO1kyALXXJWjtPLwEaDO1kyALXXJWjtPLwEaDO1kyALXXJWjtPLwEaDO1kyALXXJWjtPLwEaDO1kyALXXJWjtPLwEaDO1kyALXXJWjtPLwEaDO1kyALXXJWjtPLwEaDO1kyALXXJWjtPLwEaDO1kyALXXJWjtPLwEaDO1kyALXXJWjtPLwEaDO1kyALXXJWjtPLwEaFaO08vARoM7WTIAtdclaO08vARoM7WTIAtdclaO08vARoM7WTIAtdclaO08vARoM7WTIAtdclaO08vARoM7WTIAtdclaO08vARoM7WTIAtdclaO08vARoM7WTIAtdclaO08vARoM7WTIAtdclaO08vARoM7WTIAtdclaO08vARoM7WTIAtdclaO08vARoM7WTIAtdclaO08vARoM7WTIAtdclaO08vARoM7WTLtPLwEaDO1kyALXXJWjtPLwEaDO1kyALXXJWjtPLwEaDO1kyALXXJWjtPLwEaDO1kyALXXJWjtPLwEaDO1kyALXXJWjtPLwEaDO1kyALXXJWjtPLwEaDO1kyALXXJWjtPLwEaDO1kyALXXJWjtPLwEaDO1kyALXXJWjtPLwEaDO1kyALXXJWjtPLwEaDO1kyALXXJWjtPLwEaDO1kyALXXJWjtPLwEaDO1kyALXXJGgztZMgC11yVo7Ty8BGgztZMgC11yVo7Ty8BGgztZMgC11yVo7Ty8BGgztZMgC11yVo7Ty8BGgztZMgC11yVo7Ty8BGjcfIWxtrIUqv7upFPm1X6t4Uod/wDir2rqs+ofcWzpAqlH2TWdVGv+4K9ObQbB0EgZ/wBs8oG2k2/tmQB/Z3L54yNvhEn7J5bkr/K6Xb5xpftvlGWqf2qBtmeMj7ir6qH+y2DoJyUv7j2kdiVfYtW0sUn614Xqwoky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'
}