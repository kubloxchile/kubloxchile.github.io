//variables globales
let scene, camera, renderer, clock, deltaTime, totalTime; //variables de mi escena THREE
let arToolkitSource, arToolkitContext; //objetos que permiten ejecutar todo lo referente a AR
let marker1, marker2, marker3, marker4, marker5; //marcadores
let mesh1, mesh2; //meshes que van a aparecer al visualizar el marcador 

let raycaster; //permite apuntar o detectar objetos en nuestra aplicacion  

let mouse = new THREE.Vector2();

let INTERSECTED; //guarda info sobre los objetos intersectados por mi raycast

let objects = []; //guarda los objetos que quiero detectar

var sprite1; //variable para el label
var canvas1, context1, texture1; // variables para creacion del label

let RhinoMesh, RhinoMesh2;
let video = document.getElementById('video');

///////////////FUNCIONES////////////////////////////
//funcion principal 
function main() {
    init();
    animate();
}

//ejecutamos la app llamando a main 
main(); //llamado a la funcion main 

function init() {
    ///////CREACION DE UNA ESCENA///////////////////
    scene = new THREE.Scene();
    // mouse = new THREE.Vector2();

    ///////CREACION DE UNA CAMARA///////////////////
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 10000);
    //agrego la camara a mi escena 
    scene.add(camera);

    //raycaster
    raycaster = new THREE.Raycaster();

    ///////CREACION LUCES///////////////////
    let lightSphere = new THREE.Mesh(
        new THREE.SphereGeometry(0.1),
        new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.8
        })
    );


    //luz principal
    let light = new THREE.PointLight(0xffffff, 1, 100); //creo nueva luz 
    light.position.set(0, 4, 4); //indico la posicion de la luz 
    light.castShadow = true; //activo la capacidad de generar sombras.
    light.shadow.mapSize.width = 4096; //resolucion mapa de sombras ancho 
    light.shadow.mapSize.height = 4096;// resolucion mapa de sombras alto


    lightSphere.position.copy(light);


    //agrego objetos luz a mi escena 
    scene.add(light);
    scene.add(lightSphere);

    ///////CREACION DEL RENDERER///////////////////
    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });

    renderer.setClearColor(new THREE.Color('lightgrey'), 0)
    renderer.setSize(1920, 1080);
    renderer.domElement.style.position = 'absolute'
    renderer.domElement.style.top = '0px'
    renderer.domElement.style.left = '0px'
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    document.body.appendChild(renderer.domElement);

    ///////CREACION DE UN COUNTER///////////////////
    clock = new THREE.Clock();
    deltaTime = 1;
    totalTime = 1;

    ////////////////////////////////////////////////////////////
    // setup arToolkitSource
    ////////////////////////////////////////////////////////////

    arToolkitSource = new THREEx.ArToolkitSource({
        sourceType: 'webcam',
    });

    function onResize() {
        arToolkitSource.onResize()
        arToolkitSource.copySizeTo(renderer.domElement)
        if (arToolkitContext.arController !== null) {
            arToolkitSource.copySizeTo(arToolkitContext.arController.canvas)
        }
    }

    arToolkitSource.init(function onReady() {
        onResize()
    });

    // handle resize event
    window.addEventListener('resize', function () {
        onResize()
    });

    ////////////////////////////////////////////////////////////
    // setup arToolkitContext
    ////////////////////////////////////////////////////////////	

    // create atToolkitContext
    arToolkitContext = new THREEx.ArToolkitContext({
        cameraParametersUrl: 'data/camera_para.dat',
        detectionMode: 'mono'
    });

    // copy projection matrix to camera when initialization complete
    arToolkitContext.init(function onCompleted() {
        camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
    });


    ////////////////////////////////////////////////////////////
    // setup markerRoots
    ////////////////////////////////////////////////////////////

    //Marcador 1
    marker1 = new THREE.Group();
    marker1.name = 'marker1';
    scene.add(marker1); //agregamos el marcador a la escena 

    let markerControls1 = new THREEx.ArMarkerControls(arToolkitContext, marker1, {
        type: 'pattern',
        patternUrl: "data/tec1.patt",
    })

     //Marcador 2
     marker2 = new THREE.Group();
     marker2.name = 'marker2';
     scene.add(marker2); //agregamos el marcador a la escena 
 
     let markerControls2 = new THREEx.ArMarkerControls(arToolkitContext, marker2, {
         type: 'pattern',
         patternUrl: "data/tec2.patt",
     })

     //Marcador 3
     marker3 = new THREE.Group();
     marker3.name = 'marker3';
     scene.add(marker3); //agregamos el marcador a la escena 
 
     let markerControls3 = new THREEx.ArMarkerControls(arToolkitContext, marker3, {
         type: 'pattern',
         patternUrl: "data/tec3.patt",
     })

     //Marcador 4
     marker4 = new THREE.Group();
     marker4.name = 'marker4';
     scene.add(marker4); //agregamos el marcador a la escena 
 
     let markerControls4 = new THREEx.ArMarkerControls(arToolkitContext, marker4, {
         type: 'pattern',
         patternUrl: "data/tec4.patt",
     })

     //Marcador 5
     marker5 = new THREE.Group();
     marker5.name = 'marker5';
     scene.add(marker5); //agregamos el marcador a la escena 
 
     let markerControls5 = new THREEx.ArMarkerControls(arToolkitContext, marker5, {
         type: 'pattern',
         patternUrl: "data/tec5.patt",
     })

    ////////////GEOMETRIAS//////////////////////////////////////

    //paso 1 - creo geometria 
    let box = new THREE.CubeGeometry(.5, .5, .5); //plantilla para crear geometrias cubo

    //Paso 2 - creo materiales
    //material 1
    let matBox01 = new THREE.MeshLambertMaterial(
        {
            color: Math.random() * 0xffffff,
            side: THREE.DoubleSide
        }
    );

  

    // //paso 3 - Creo Meshes

    // //mesh1
    // mesh1 = new THREE.Mesh(box, matBox01);
    // mesh1.position.y = .25;
    // mesh1.name = 'Mesh1'; //mensaje a mostrar cuando indicamos el mesh con nuestro mouse


    ////OBJETO RHINO 1///////////////
    new THREE.MTLLoader()
        .setPath('data/models/')
        .load('zorro00.mtl', function (materials) {
            materials.preload();
            new THREE.OBJLoader()
                .setMaterials(materials)
                .setPath('data/models/')
                .load('zorro00.obj', function (object) {
                    object.scale.set(0.01, 0.01, 0.01);
                    marker4.add(object);
                    // objects.push(RhinoMesh);  /////debes agregar Aqui el objeto a objects. 
                    console.log(objects);
                });


        });   

            ////OBJETO RHINO 2///////////////

    new THREE.MTLLoader()
    .setPath('data/models/')
    .load('sala03.mtl', function (materials) {
        materials.preload();
        new THREE.OBJLoader()
            .setMaterials(materials)
            .setPath('data/models/')
            .load('sala03.obj', function (object) {
                object.scale.set(0.03,0.03,0.03);
                marker2.add(object);
                // objects.push(object)
                console.log(objects);
            });


    }); 

    //      ////OBJETO RHINO 3///////////////

    new THREE.MTLLoader()
    .setPath('data/models/')
    .load('profe.mtl', function (materials) {
        materials.preload();
        new THREE.OBJLoader()
            .setMaterials(materials)
            .setPath('data/models/')
            .load('profe.obj', function (object) {
                object.scale.set(0.08,0.08,0.08);
                marker3.add(object);
                // objects.push(object)
                console.log(objects);
            });


    }); 


    //////CREACION VIDEO///////////////
    let geoVideo = new THREE.PlaneBufferGeometry(2,2,4,4); //molde geometria

    // let video =  document.getElementById('video');
    // video.autoplay = false;
    
    video.muted= true;
    video.pause();
    let texture =  new THREE.VideoTexture(video);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter= THREE.LinearFilter;
    texture.format =  THREE.RGBFormat;

    let material1 = new THREE.MeshBasicMaterial(
        {

            map:texture
    }
    );

    mesh1 = new THREE.Mesh(geoVideo, material1);
    mesh1.rotation.x = -Math.PI/2;

    marker5.add(mesh1);



    /////////////////////foto//////////////////////
    let meme001 = new THREE.PlaneBufferGeometry(4,2,4);
	let loader001 = new THREE.TextureLoader();
	let texture001 = loader001.load('./data/logo.jpg')
	let material001 = new THREE.MeshBasicMaterial({map:texture001});

	let foto001 = new THREE.Mesh(meme001, material001);
	foto001.rotation.x = -Math.PI / 2;
	marker1.add(foto001);




  

        
    // /////////CREACION ELEMENTOS TEXTO//////////////////////
    // //CREACION DE CANVAS 
    // canvas1 = document.createElement('canvas');
    // context1 = canvas1.getContext('2d');
    // context1.font = "Bold 20px Arial";
    // context1.fillStyle = "rgba(0,0,0,0.95)";
    // context1.fillText('Hello', 0, 1);

    // //los contenidos del canvas seran usados como textura 
    // let texture2 = new THREE.Texture(canvas1);
    // texture2.needsUpdate = true;


    // //creacion del sprite
    // var spriteMaterial = new THREE.SpriteMaterial(
    //     {
    //         map: texture1
    //     }
    // )
    // sprite1 = new THREE.Sprite(spriteMaterial);
    // sprite1.scale.set(3, 1.5, 3);
    // //sprite1.position.set(5, 5, 0);

    ////////////AGREGAMOS OBJETOS A ESCeNA Y ARRAY OBJECTS


    //Agregamos objetos a detectar a nuestro array objects
    //objects.push(mesh1);

    //agregamos nuestros objetos a la escena mediante el objeto marker1
    // marker1.add(sprite1);
    //marker1.add(mesh1);

    //////////EVENT LISTERNERS/////////////////////////////////
    // document.addEventListener('mousemove', onDocumentMouseMove, false);// detecta movimiento del mouse

}

//////////////FUNCIONES//////////////////////////////////

// function onDocumentMouseMove(event) {
//     event.preventDefault();
//     sprite1.position.set((event.clientX / window.innerWidth) * 2 - 1, - (event.clientY / window.innerHeight) * 2 + 1, 0);
//     sprite1.renderOrder = 999;
//     sprite1.onBeforeRender = function (renderer) { renderer.clearDepth(); }

//     mouse.set((event.clientX / window.innerWidth) * 2 - 1, - (event.clientY / window.innerHeight) * 2 + 1); //mouse pos

//     raycaster.setFromCamera(mouse, camera); //creo el rayo que va desde la camara , pasa por el frustrum 
//     let intersects = raycaster.intersectObjects(objects, false); //buscamos las intersecciones

//     if (intersects.length > 1) {
//         if (intersects[0].object != INTERSECTED) {
//             if (INTERSECTED) {
//                 INTERSECTED.material.color.setHex(INTERSECTED.currentHex);
//             }
//             INTERSECTED = intersects[0].object;
//             INTERSECTED.currentHex = INTERSECTED.material.color.getHex();
//             INTERSECTED.material.color.setHex(0xffff00);

//             if (INTERSECTED.name) {
//                 context1.clearRect(0, 0, 10, 10);
//                 let message = INTERSECTED.name;
//                 let metrics = context1.measureText(message);
//                 let width = metrics.width;
//                 context1.fillStyle = "rgba(0,0,0,0.95)"; // black border
//                 context1.fillRect(0, 0, width + 8, 20 + 8);
//                 context1.fillStyle = "rgba(255,255,255,0.95)"; // white filler
//                 context1.fillRect(2, 2, width + 4, 20 + 4);
//                 context1.fillStyle = "rgba(0,0,0,1)"; // text color
//                 context1.fillText(message, 4, 20);
//                 texture2.needsUpdate = true;
//             }
//             else {
//                 context1.clearRect(0, 0, 10, 10);
//                 texture2.needsUpdate = true;
//             }
//         }

//     }
//     //si no encuentra intersecciones
//     else {
//         if (INTERSECTED) {
//             INTERSECTED.material.color.setHex(INTERSECTED.currentHex); //devolviendo el color original al objeto            
//         }
//         INTERSECTED = null;
//         context1.clearRect(0, 0, 300, 300);
//         texture2.needsUpdate = true;
//     }
// }



function update() {
    // update artoolkit on every frame
    if (arToolkitSource.ready !== false)
        arToolkitContext.update(arToolkitSource.domElement);
}

function render() {
    renderer.render(scene, camera);
}

function animate() {
    requestAnimationFrame(animate);
    deltaTime = clock.getDelta();
    totalTime += deltaTime;
    render();
    update();
    video.play();
}

function playVideo(){
    let video = document.getElementById('video');
    video.muted=true;
	// video.play();
}