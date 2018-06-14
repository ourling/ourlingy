/**
 * Created by xukai on 2017/5/5.
 */
/* Uses JSONLoader to load objects that have been saved
 * in three.js's json format.  Requires the folder models-json
 * that contains the seven sample models.
 */



let renderer;  // A three.js WebGL or Canvas renderer.
let scene;     // The 3D scene that will be rendered, containing the model.
let camera;    // The camera that takes the picture of the scene.

let model; // The three.js object that represents the model.

let rotateX = 0;   // rotation of model about the x-axis
let rotateY = 0;  // rotation of model about the y-axis

let jsonPath = {}

function GetRequest (){
    let url = location.search; //获取url中"?"符后的字串
    let theRequest = {};
    if (url.indexOf("?") != -1) {
        let str = url.substr(1);
        let strs = str.split("&");
        for(let i = 0; i < strs.length; i ++) {
            theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
        }
    }
    jsonPath = "http://static.westlakevr.cn/json/model/three-dim/" + theRequest.userId + "/" + theRequest.modelId + ".json";
    console.log(theRequest)
}
GetRequest()
/*  This function is called by the init() method.  It simply adds
 *  a light to the scene.  Objects are added later by the loader callback.
 */
function createWorld() {
    let light;  // A light shining from the direction of the camera.
    light = new THREE.DirectionalLight();
    light.position.set(0, 0, 1);
    scene.add(light);
}

/**
 * The callback function that is called by the JSONLoader when it
 * has finished loading the object.  This function creates a three.js
 * function to hold the object.  It translates the object so that
 * its center is in the origin.  It wraps the object in another object
 * that is used to scale and rotate the object.  The scale is set
 * so that the maximum coordinate in its vertices, in absolute
 * value, is scaled to 10.  The rotation is controlled by the arrow
 * keys.
 */
function modelLoadedCallback(geometry, materials) {
    /* create the object from the geometry and materials that were loaded.  There
     can be multiple materials, which can be applied to the object using MeshFaceMaterials.
     Note tha the material can include references to texture images might finish
     loading later. */

    let object = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));

    /* Determine the ranges of x, y, and z in the vertices of the geometry. */

    let xmin = Infinity;
    let xmax = -Infinity;
    let ymin = Infinity;
    let ymax = -Infinity;
    let zmin = Infinity;
    let zmax = -Infinity;
    for (let i = 0; i < geometry.vertices.length; i++) {
        let v = geometry.vertices[i];
        if (v.x < xmin)
            xmin = v.x;
        else if (v.x > xmax)
            xmax = v.x;
        if (v.y < ymin)
            ymin = v.y;
        else if (v.y > ymax)
            ymax = v.y;
        if (v.z < zmin)
            zmin = v.z;
        else if (v.z > zmax)
            zmax = v.z;
    }

    /* translate the center of the object to the origin */
    let centerX = (xmin + xmax) / 2;
    let centerY = (ymin + ymax) / 2;
    let centerZ = (zmin + zmax) / 2;
    let max = Math.max(centerX - xmin, xmax - centerX);
    max = Math.max(max, Math.max(centerY - ymin, ymax - centerY));
    max = Math.max(max, Math.max(centerZ - zmin, zmax - centerZ));
    let scale = 10 / max;
    object.position.set(-centerX, -centerY, -centerZ);
    console.log("Loading finished, scaling object by " + scale);
    console.log("Center at ( " + centerX + ", " + centerY + ", " + centerZ + " )");

    /* Create the wrapper, model, to scale and rotate the object. */

    model = new THREE.Object3D();
    model.add(object);
    model.scale.set(scale, scale, scale);
    rotateX = rotateY = 0;
    scene.add(model);
    render();
}


/**
 * Called when the setting of the model-selection radio buttons is changed.
 * starts loading the model from the specified file and sets the background
 * color for the renderer (since black background doesn't work for all
 * of the models.
 */
function installModel(bgColor) {
    // if (model) {
    //     scene.remove(model);
    // }
    renderer.setClearColor(bgColor);

    let loader = new THREE.JSONLoader();
    loader.load(jsonPath, modelLoadedCallback);
    animate()
}




/**
 *  The render fucntion creates an image of the scene from the point of view
 *  of the camera and displays it in the canvas.  This is called at the end of
 *  init() to produce the initial view of the model, and it is called each time
 *  the user presses an arrow key, return, or home.
 */
function render() {
    renderer.render(scene, camera);
}

/**
 *  An event listener for the keydown event.  It is installed by the init() function.
 */
function doKey(evt) {
    let rotationChanged = true;
    console.log(evt)
    switch (evt.keyCode) {
        case 37:
            rotateY -= 0.05;
            break;        // left arrow
        case 39:
            rotateY += 0.05;
            break;       // right arrow
        case 38:
            rotateX -= 0.05;
            break;        // up arrow
        case 40:
            rotateX += 0.05;
            break;        // down arrow
        case 13:
            rotateX = rotateY = 0;
            break;  // return
        case 36:
            rotateX = rotateY = 0;
            break;  // home
        default:
            rotationChanged = false;
    }
    if (model && rotationChanged) {
        model.rotation.set(rotateX, rotateY, 0);
        render();
        evt.preventDefault();
    }
}

/**
 *  This function is called by the onload event so it will run after the
 *  page has loaded.  It creates the renderer, canvas, and scene objects,
 *  calls createWorld() to add objects to the scene, and renders the
 *  initial view of the scene.  If an error occurs, it is reported.
 */
function init() {
    try {
        let theCanvas = document.getElementById("cnvs");
        let width = theCanvas.width
        let height = theCanvas.height
        if (!theCanvas || !theCanvas.getContext) {
            document.getElementById("message").innerHTML =
                "Sorry, your browser doesn't support canvas graphics.";
            return;
        }
        try {  // try to create a WebGLRenderer
            if (window.WebGLRenderingContext) {
                renderer = new THREE.WebGLRenderer({
                    canvas: theCanvas,
                    antialias: true
                });
            }
        }
        catch (e) {
        }
        if (!renderer) { // If the WebGLRenderer couldn't be created, try a CanvasRenderer.
            renderer = new THREE.CanvasRenderer({canvas: theCanvas});
            renderer.setSize(width, height);
        }
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(80, 1, 0.1, 1000);
        camera.position.z = 30;
        createWorld();
        installModel(0xddffdd);
        render();
        document.addEventListener("keydown", doKey, false);
        document.addEventListener("touchstart", start, false);
        document.addEventListener("touchmove", move, false);
        document.addEventListener("mousedown", startPC, false);
        document.addEventListener("mouseup", endPC, false);
        document.getElementById("r1").checked = true;
    }
    catch (e) {
        // document.getElementById("message").innerHTML = "Sorry, an error occurred: " + e;
    }
}


//首次渲染
function animate() {
    requestAnimationFrame( animate );
    render();
}
let startX = 0
let startY = 0
//移动端
function start(e) {
    console.log(e.cancelable)
    startX = e.changedTouches[0].screenX
    startY = e.changedTouches[0].screenY
}
function move(e) {
    let rotationChanged = true;
    let kX1 = startX  //第一次存储移动开始的手势位置
    let kY1 = startY  //第一次存储移动开始的手势位置
    let moveEndX = e.changedTouches[0].screenX
    let moveEndY = e.changedTouches[0].screenY
    startX = moveEndX //获取移动后的手势位置
    startY = moveEndY //获取移动后的手势位置
    let kX2 = startX //第二次存储移动开始的手势位置
    let kY2 = startY //第二次存储移动开始的手势位置
    let booX = kX2 - kX1  //判断两次手势移动的位置
    let booY = kY2 - kY1  //判断两次手势移动的位置
    //X位置
    if (booX < 0) {
        // console.log("左移")
        rotateY -= 0.05;
    } else if (booX > 0) {
        // console.log("右移")
        rotateY += 0.05;
    } else {
        // console.log("左右未移动")
    }
    //Y位置
    if (booY < 0) {
        // console.log("上移")
        rotateX -= 0.05;
    } else if (booY > 0) {
        // console.log("下移")
        rotateX += 0.05;
    } else {
        // console.log("上下未移动")
    }
    if (model && rotationChanged) {
        model.rotation.set(rotateX, rotateY, 0);
        render();
        e.preventDefault();
    }
}
//PC端
function startPC(e){
    startX = e.screenX
    startY = e.screenY
    document.addEventListener("mousemove", movePC, false);
}
function movePC(e){
    let rotationChanged = true;
    let kX1 = startX  //第一次存储移动开始的手势位置
    let kY1 = startY  //第一次存储移动开始的手势位置
    let moveEndX = e.screenX
    let moveEndY = e.screenY
    startX = moveEndX //获取移动后的手势位置
    startY = moveEndY //获取移动后的手势位置
    let kX2 = startX //第二次存储移动开始的手势位置
    let kY2 = startY //第二次存储移动开始的手势位置
    let booX = kX2 - kX1  //判断两次手势移动的位置
    let booY = kY2 - kY1  //判断两次手势移动的位置
    //X位置
    if (booX < 0) {
        // console.log("左移")
        rotateY -= 0.05;
    } else if (booX > 0) {
        // console.log("右移")
        rotateY += 0.05;
    } else {
        // console.log("左右未移动")
    }
    //Y位置
    if (booY < 0) {
        // console.log("上移")
        rotateX -= 0.05;
    } else if (booY > 0) {
        // console.log("下移")
        rotateX += 0.05;
    } else {
        // console.log("上下未移动")
    }
    if (model && rotationChanged) {
        model.rotation.set(rotateX, rotateY, 0);
        render();
        e.preventDefault();
    }
}
function endPC(e){
    document.removeEventListener("mousemove", movePC, false);
}