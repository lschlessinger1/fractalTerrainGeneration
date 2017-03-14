var scene, camera, renderer;
var mesh, controls;
// initial number of vertices is 2^n + 1 = (65)
// n = terrainDetail
var terrainDetail = 6, terrainRoughness = 0.8, hillinessFactor = 10;

if (Detector.webgl) {
    init();
    addTerrainMesh(terrainDetail);
    animate();
} else {
    var warning = Detector.getWebGLErrorMessage();
    document.getElementById('container').appendChild(warning);
}

function init() {
    // Create the scene and set the scene size.
    scene = new THREE.Scene();

    var SCREEN_WIDTH = window.innerWidth;
    var SCREEN_HEIGHT = window.innerHeight;
    var aspect = SCREEN_WIDTH / SCREEN_HEIGHT;

    camera = new THREE.PerspectiveCamera( 50, 0.5 * aspect, 1, 10000 );
    // Place camera on x axis
    camera.position.set(2048, 2048, 3000);
    camera.up = new THREE.Vector3(0, 0, 1);
    camera.lookAt(new THREE.Vector3(0, 0, 0));   

    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0xFDF3E7, 1.0);
    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    document.body.appendChild( renderer.domElement );
    
    controls = new THREE.OrbitControls( camera, renderer.domElement );

    var gui = new dat.GUI({
        height : 5 * 32 - 1
    });

    gui.add(this, 'terrainDetail', 1, 8).step(1).name("Detail").onFinishChange(function(value) {
        addTerrainMesh(terrainDetail);
    });

    gui.add(this, 'terrainRoughness', 0, 1).name("Roughness").onFinishChange(function(value) {
        addTerrainMesh(terrainDetail);
    });

    gui.add(this, 'hillinessFactor', 1, 25).name("Hilliness").onFinishChange(function(value) {
        addTerrainMesh(terrainDetail);
    });

    window.addEventListener('resize', onWindowResize, false);
}

function animate() {
    requestAnimationFrame( animate );
    controls.update();
    render();
}

function render() {
    renderer.render( scene, camera );
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function addTerrainMesh(n) {
    scene.remove(mesh);
    var dimen = Math.pow(2, n) + 1;
    var terrain = new Terrain(dimen);
    terrain.generate(terrainRoughness);
    var terrainData = parseData(terrain.data);

    var geometry = new THREE.PlaneGeometry(2048, 2048, dimen - 1, dimen - 1 );

    var material = new THREE.MeshBasicMaterial( { color: 0x7E8F7C, wireframe: true } );

    // assumes geometry.vertices.length = (dimen-1) * (dimen-1)
    for ( var x = 0; x < dimen; x++ ) {
        for ( var y = 0; y < dimen; y++ ) {
            var i = x * dimen + y;
            geometry.vertices[i].z = terrainData[x][y].z * hillinessFactor;
        }
    }

    mesh = new THREE.Mesh( geometry, material );

    scene.add( mesh );
}

// from 2D array data[x][y] = z to 2D array in form: data[x][y] = {x: x_i, y: y_i, z: z_i}
function parseData(data) {
    var dataArr = [];

    for (var x = 0; x < data.length; x++) {
      dataArr[x] = [];

      for (var y = 0; y < data.length; y++) {
        dataArr[x][y] = {x: x, y: y, z: data[x][y]};
    }

}

return dataArr;
}