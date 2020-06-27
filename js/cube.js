// //(CC-NC-BY) Jeon Hyun Bin 2020


var gl;

function testGLError(functionLastCalled) {

    var lastError = gl.getError();

    if (lastError != gl.NO_ERROR) {
        alert(functionLastCalled + " failed (" + lastError + ")");
        return false;
    }

    return true;
}

function initialiseGL(canvas) {
    try {
        // Try to grab the standard context. If it fails, fallback to experimental
        gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        gl.viewport(0, 0, canvas.width, canvas.height);
    } catch (e) {}

    if (!gl) {
        alert("Unable to initialise WebGL. Your browser may not support it");
        return false;
    }

    return true;
}


var elementOfVideo;
var texture;
var shaderProgram;


function textureUpdate() {
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, elementOfVideo);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.bindTexture(gl.TEXTURE_2D, texture);
}


function initialiseBuffer() {

    texture = gl.createTexture();
    elementOfVideo = document.getElementById("video");

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
        new Uint8Array([0, 0, 255, 255]));


    var interval;

    elementOfVideo.addEventListener("canplaythrough", function() {
        elementOfVideo.play();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        interval = setInterval(renderScene, 3000);
    }, true);

    elementOfVideo.addEventListener("ended", function() {
        elementOfVideo.play();
    }, true);

    var vertexData = [-0.5, 0.5, 0.5, 1.0, 1.0, 1.0, 0.5, 0.0, 1.0, 0.0, 1.0, 0.0,
        0.5, 0.5, 0.5, 1.0, 1.0, 1.0, 0.5, 1.0, 1.0, 0.0, 1.0, 0.0,
        0.5, 0.5, -0.5, 1.0, 1.0, 1.0, 0.5, 1.0, 1.0, 0.0, 1.0, 0.0,

        0.5, 0.5, -0.5, 0.0, 0.0, 0.0, 0.5, 1.0, 1.0, 0.0, 0.0, -1.0,
        0.5, -0.5, -0.5, 0.0, 0.0, 0.0, 0.5, 1.0, 0.0, 0.0, 0.0, -1.0, -0.5, -0.5, -0.5, 0.0, 0.0, 0.0, 0.5, 0.0, 0.0, 0.0, 0.0, -1.0,

        -0.5, 0.5, -0.5, 0.0, 0.0, 0.0, 0.5, 0.0, 1.0, 0.0, 0.0, -1.0,
        0.5, 0.5, -0.5, 0.0, 0.0, 0.0, 0.5, 1.0, 1.0, 0.0, 0.0, -1.0, -0.5, -0.5, -0.5, 0.0, 0.0, 0.0, 0.5, 0.0, 0.0, 0.0, 0.0, -1.0,

        -0.5, 0.5, 0.5, 1.0, 1.0, 1.0, 0.5, 0.0, 1.0, 0.0, 1.0, 0.0,
        0.5, 0.5, -0.5, 1.0, 1.0, 1.0, 0.5, 1.0, 1.0, 0.0, 1.0, 0.0, -0.5, 0.5, -0.5, 1.0, 1.0, 1.0, 0.5, 0.0, 1.0, 0.0, 1.0, 0.0,

        0.5, -0.5, 0.5, 1.0, 0.5, 0.0, 0.5, 0.0, 1.0, 1.0, 0.0, 0.0,
        0.5, 0.5, -0.5, 1.0, 0.5, 0.0, 0.5, 1.0, 1.0, 1.0, 0.0, 0.0,
        0.5, 0.5, 0.5, 1.0, 0.5, 0.0, 0.5, 1.0, 1.0, 1.0, 0.0, 0.0,

        0.5, -0.5, 0.5, 1.0, 0.5, 0.0, 0.5, 0.0, 1.0, 1.0, 0.0, 0.0,
        0.5, -0.5, -0.5, 1.0, 0.5, 0.0, 0.5, 0.0, 1.0, 1.0, 0.0, 0.0,
        0.5, 0.5, -0.5, 1.0, 0.5, 0.0, 0.5, 1.0, 1.0, 1.0, 0.0, 0.0,

        -0.5, -0.5, 0.5, 0.0, 0.0, 1.0, 0.5, 0.0, 1.0, 1.0, 2.0, 2.0,
        0.5, -0.5, 0.5, 0.0, 0.0, 1.0, 0.5, 0.0, 1.0, 1.0, -1.0, 2.0,
        0.5, 0.5, 0.5, 0.0, 0.0, 1.0, 0.5, 0.0, 1.0, 1.0, 2.0, -1.0,

        -0.5, 0.5, -0.5, 1.0, 0.0, 0.0, 0.5, 0.0, 1.0, -1.0, 0.0, 0.0, -0.5, -0.5, -0.5, 1.0, 0.0, 0.0, 0.5, 0.0, 0.0, -1.0, 0.0, 0.0, -0.5, -0.5, 0.5, 1.0, 0.0, 0.0, 0.5, 0.0, 0.0, -1.0, 0.0, 0.0,

        -0.5, 0.5, 0.5, 1.0, 0.0, 0.0, 0.5, 0.0, 1.0, -1.0, 0.0, 0.0, -0.5, 0.5, -0.5, 1.0, 0.0, 0.0, 0.5, 0.0, 1.0, -1.0, 0.0, 0.0, -0.5, -0.5, 0.5, 1.0, 0.0, 0.0, 0.5, 0.0, 0.0, -1.0, 0.0, 0.0,

        0.5, -0.5, -0.5, 0.0, 1.0, 0.0, 0.5, 1.0, 0.0, 0.0, -1.0, 0.0,
        0.5, -0.5, 0.5, 0.0, 1.0, 0.0, 0.5, 1.0, 0.0, 0.0, -1.0, 0.0, -0.5, -0.5, 0.5, 0.0, 1.0, 0.0, 0.5, 0.0, 0.0, 0.0, -1.0, 0.0,

        -0.5, -0.5, -0.5, 0.0, 1.0, 0.0, 0.5, 0.0, 0.0, 0.0, -1.0, 0.0,
        0.5, -0.5, -0.5, 0.0, 1.0, 0.0, 0.5, 1.0, 0.0, 0.0, -1.0, 0.0, -0.5, -0.5, 0.5, 0.0, 1.0, 0.0, 0.5, 0.0, 0.0, 0.0, -1.0, 0.0,

        -0.5, -0.5, 0.5, 0.0, 0.0, 1.0, 0.5, 0.0, 1.0, 1.0, 1.0, 1.0,
        0.5, 0.5, 0.5, 0.0, 0.0, 1.0, 0.5, 0.0, 1.0, 1.0, 0.0, 0.0, -0.5, 0.5, 0.5, 0.0, 0.0, 1.0, 0.5, 0.0, 1.0, 1.0, 1.0, 0.0,
    ];

    // Generate a buffer object
    gl.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);
    return testGLError("initialiseBuffers");
}

function initialiseShaders() {

    var fragmentShaderSource = '\
	varying mediump vec4 color; \
	varying mediump vec2 texCoord;\
	uniform sampler2D sampler2d; \
	void main(void) \
	{ \
		gl_FragColor = texture2D(sampler2d, texCoord); \
	}';

    gl.fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(gl.fragShader, fragmentShaderSource);
    gl.compileShader(gl.fragShader);
    if (!gl.getShaderParameter(gl.fragShader, gl.COMPILE_STATUS)) {
        alert("Failed to compile the fragment shader.\n" + gl.getShaderInfoLog(gl.fragShader));
        return false;
    }

    var vertexShaderSource = '\
			attribute highp vec3 myVertex; \
			attribute highp vec4 myColor; \
			attribute highp vec2 myUV; \
			attribute highp vec3 myNormal; \
			uniform mediump mat4 Pmatrix; \
			uniform mediump mat4 Vmatrix; \
			uniform mediump mat4 Mmatrix; \
			uniform mediump mat4 Nmatrix; \
			varying mediump vec4 color; \
			varying mediump vec2 texCoord;\
			void main(void)  \
			{ \
				gl_Position = Pmatrix*Vmatrix*Mmatrix*vec4(myVertex, 1.0);\
				color = myColor;\
				texCoord = myUV; \
			}';

    gl.vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(gl.vertexShader, vertexShaderSource);
    gl.compileShader(gl.vertexShader);
    if (!gl.getShaderParameter(gl.vertexShader, gl.COMPILE_STATUS)) {
        alert("Failed to compile the vertex shader.\n" + gl.getShaderInfoLog(gl.vertexShader));
        return false;
    }

    gl.programObject = gl.createProgram();

    gl.attachShader(gl.programObject, gl.fragShader);
    gl.attachShader(gl.programObject, gl.vertexShader);

    gl.bindAttribLocation(gl.programObject, 0, "myVertex");
    gl.bindAttribLocation(gl.programObject, 1, "myColor");
    gl.bindAttribLocation(gl.programObject, 2, "myUV");

    gl.linkProgram(gl.programObject);

    if (!gl.getProgramParameter(gl.programObject, gl.LINK_STATUS)) {
        alert("Failed to link the program.\n" + gl.getProgramInfoLog(gl.programObject));
        return false;
    }

    gl.useProgram(gl.programObject);

    return testGLError("initialiseShaders");
}

function toProjM(angle, ratio, min, max) {
    var caledAngle = Math.tan((angle * .5) * Math.PI / 180);
    return [
        0.5 / caledAngle, 0, 0, 0,
        0, 0.5 * ratio / caledAngle, 0, 0,
        0, 0, -(max + min) / (max - min), -1,
        0, 0, (-2 * max * min) / (max - min), 0
    ];
}

var viewM = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
var movM = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
var projM = toProjM(30, 1.0, 1, 8.0);


viewM[14] = viewM[14] - 4;

function toIdxFromMatrix(matrix) {

    matrix[0] = 1;
    matrix[1] = 0;
    matrix[2] = 0;
    matrix[3] = 0;
    matrix[4] = 0;

    matrix[5] = 1;
    matrix[6] = 0;
    matrix[7] = 0;
    matrix[8] = 0;
    matrix[9] = 0;

    matrix[10] = 1;
    matrix[11] = 0;
    matrix[12] = 0;
    matrix[13] = 0;
    matrix[14] = 0;
    matrix[15] = 1;

}

function storeAndMul(resultM, M1, M2) {

    m0 = M1[0];
    m1 = M1[1];
    m2 = M1[2];
    m3 = M1[3];
    m4 = M1[4];
    m5 = M1[5];
    m6 = M1[6];
    m7 = M1[7];
    m8 = M1[8];
    m9 = M1[9];
    m10 = M1[10];
    m11 = M1[11];
    m12 = M1[12];
    m13 = M1[13];
    m14 = M1[14];
    m15 = M1[15];

    k0 = M2[0];
    k1 = M2[1];
    k2 = M2[2];
    k3 = M2[3];
    k4 = M2[4];
    k5 = M2[5];
    k6 = M2[6];
    k7 = M2[7];
    k8 = M2[8];
    k9 = M2[9];
    k10 = M2[10];
    k11 = M2[11];
    k12 = M2[12];
    k13 = M2[13];
    k14 = M2[14];
    k15 = M2[15];

    a0 = k0 * m0 + k3 * m12 + k1 * m4 + k2 * m8;
    a4 = k4 * m0 + k7 * m12 + k5 * m4 + k6 * m8;
    a8 = k8 * m0 + k11 * m12 + k9 * m4 + k10 * m8;
    a12 = k12 * m0 + k15 * m12 + k13 * m4 + k14 * m8;

    a1 = k0 * m1 + k3 * m13 + k1 * m5 + k2 * m9;
    a5 = k4 * m1 + k7 * m13 + k5 * m5 + k6 * m9;
    a9 = k8 * m1 + k11 * m13 + k9 * m5 + k10 * m9;
    a13 = k12 * m1 + k15 * m13 + k13 * m5 + k14 * m9;

    a2 = k2 * m10 + k3 * m14 + k0 * m2 + k1 * m6;
    a6 = k6 * m10 + k7 * m14 + k4 * m2 + k5 * m6;
    a10 = k10 * m10 + k11 * m14 + k8 * m2 + k9 * m6;
    a14 = k14 * m10 + k15 * m14 + k12 * m2 + k13 * m6;

    a3 = k2 * m11 + k3 * m15 + k0 * m3 + k1 * m7;
    a7 = k6 * m11 + k7 * m15 + k4 * m3 + k5 * m7;
    a11 = k10 * m11 + k11 * m15 + k8 * m3 + k9 * m7;
    a15 = k14 * m11 + k15 * m15 + k12 * m3 + k13 * m7;

    resultM[0] = a0;
    resultM[1] = a1;
    resultM[2] = a2;
    resultM[3] = a3;
    resultM[4] = a4;
    resultM[5] = a5;
    resultM[6] = a6;
    resultM[7] = a7;
    resultM[8] = a8;
    resultM[9] = a9;
    resultM[10] = a10;
    resultM[11] = a11;
    resultM[12] = a12;
    resultM[13] = a13;
    resultM[14] = a14;
    resultM[15] = a15;

}

function mul(m, k) {
    storeAndMul(m, m, k);
}

function translate(m, tx, ty, tz) {
    var tm = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    tm[12] = tx;
    tm[13] = ty;
    tm[14] = tz;
    mul(m, tm);
}


function vecNormalize(vertex) {
    square = vertex[0] * vertex[0] + vertex[1] * vertex[1] + vertex[2] * vertex[2];

    square = Math.sqrt(square);

    if (square < 0.000001)
        return -1;

    vertex[0] /= square;
    vertex[1] /= square;
    vertex[2] /= square;
}

function rotateA(M, Angl, ax) {

    var rotateToA = [0, 0, 0];
    var u_X, u_Y, u_Z;
    var reducedM = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

    var angToCos = Math.cos(Angl);
    var angToCos1 = 1.0 - angToCos;
    var angToSin = Math.sin(Angl);

    rotateToA[0] = ax[0];
    rotateToA[1] = ax[1];
    rotateToA[2] = ax[2];

    if (vecNormalize(rotateToA) == -1)
        return -1;

    u_X = rotateToA[0];
    u_Y = rotateToA[1];
    u_Z = rotateToA[2];

    reducedM[0] = angToCos + u_X * u_X * angToCos1;
    reducedM[1] = u_Y * u_X * angToCos1 + u_Z * angToSin;
    reducedM[2] = u_Z * u_X * angToCos1 - u_Y * angToSin;
    reducedM[3] = 0;

    reducedM[4] = u_X * u_Y * angToCos1 - u_Z * angToSin;
    reducedM[5] = angToCos + u_Y * u_Y * angToCos1;
    reducedM[6] = u_Z * u_Y * angToCos1 + u_X * angToSin;
    reducedM[7] = 0;

    reducedM[8] = u_X * u_Z * angToCos1 + u_Y * angToSin;
    reducedM[9] = u_Y * u_Z * angToCos1 - u_X * angToSin;
    reducedM[10] = angToCos + u_Z * u_Z * angToCos1;
    reducedM[11] = 0;

    reducedM[12] = 0;
    reducedM[13] = 0;
    reducedM[14] = 0;
    reducedM[15] = 1;

    mul(M, reducedM);
}



RV = 0.0;
RVSmall = 0.0;
incRV = 0.05;
incRVSmall = 0.02;

Xtrans = 0.0;
frames = 1;
tempRV = 0.0;

function stopRotate() {
    if (incRV == 0.0) {
        incRV = tempRV;
    } else {
        tempRV = incRV;
        incRV = 0.0;
    }
}



function renderScene() {

    textureUpdate();

    frames += 1;
    rotAxis = [1, 1, 0];

    var Pmatrix = gl.getUniformLocation(gl.programObject, "Pmatrix");
    var Vmatrix = gl.getUniformLocation(gl.programObject, "Vmatrix");
    var Mmatrix = gl.getUniformLocation(gl.programObject, "Mmatrix");


    toIdxFromMatrix(movM);
    rotateA(movM, RV, rotAxis);
    RV += incRV;
    RVSmall += incRVSmall;
    translate(movM, Xtrans, 0.0, 0.0);

    gl.uniformMatrix4fv(Pmatrix, false, projM);
    gl.uniformMatrix4fv(Vmatrix, false, viewM);
    gl.uniformMatrix4fv(Mmatrix, false, movM);

    if (!testGLError("gl.uniformMatrix4fv")) {
        return false;
    }

    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, gl.FALSE, 48, 0);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 4, gl.FLOAT, gl.FALSE, 48, 12);
    gl.enableVertexAttribArray(2);
    gl.vertexAttribPointer(2, 2, gl.FLOAT, gl.FALSE, 48, 28);
    gl.enableVertexAttribArray(3);
    gl.vertexAttribPointer(3, 3, gl.FLOAT, gl.FALSE, 48, 36);


    if (!testGLError("gl.vertexAttribPointer")) {
        return false;
    }

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.blendEquation(gl.FUNC_ADD);

    gl.clearColor(0.2, 0.2, 0.2, 1.0);
    gl.clearDepth(1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLES, 0, 36);

    if (!testGLError("gl.drawArrays")) {
        return false;
    }

    return true;
}

function main() {
    var canvas = document.getElementById("helloapicanvas");

    if (!initialiseGL(canvas)) {
        return;
    }

    if (!initialiseBuffer()) {
        return;
    }

    if (!initialiseShaders()) {
        return;
    }

    requestAnimFrame = (
        function() {
            return function(callback) {
                window.setTimeout(callback, 10, 10);
            };
        })();

    (function renderLoop(param) {
        if (renderScene()) {
            requestAnimFrame(renderLoop);
        }
    })();
}


function createCubePos(sx, sy, sz) {

    var createdVBO = [

        -0.5, 0.5, 0.5, 0.0, 1.0, 1.0, 1.0, // R+B
        -0.5, -0.5, 0.5, 0.0, 1.0, 1.0, 1.0, //
        -0.5, 0.5, -0.5, 0.0, 1.0, 1.0, 1.0, //

        -0.5, -0.5, -0.5, 0.0, 1.0, 1.0, 1.0, // R+B
        -0.5, -0.5, 0.5, 0.0, 1.0, 1.0, 1.0, //
        -0.5, 0.5, -0.5, 0.0, 1.0, 1.0, 1.0, //

        0.5, 0.5, 0.5, 1.0, 0.0, 0.0, 1.0, // Red
        0.5, 0.5, -0.5, 1.0, 0.0, 0.0, 1.0, //
        0.5, -0.5, 0.5, 1.0, 0.0, 0.0, 1.0, //

        0.5, -0.5, -0.5, 1.0, 0.0, 0.0, 1.0, // Red
        0.5, 0.5, -0.5, 1.0, 0.0, 0.0, 1.0, //
        0.5, -0.5, 0.5, 1.0, 0.0, 0.0, 1.0, //

        0.5, 0.5, 0.5, 0.0, 0.0, 1.0, 1.0, // Blue
        -0.5, 0.5, 0.5, 0.0, 0.0, 1.0, 1.0, //
        -0.5, -0.5, 0.5, 0.0, 0.0, 1.0, 1.0, //

        0.5, 0.5, 0.5, 0.0, 0.0, 1.0, 1.0, // Blue
        -0.5, -0.5, 0.5, 0.0, 0.0, 1.0, 1.0, //
        0.5, -0.5, 0.5, 0.0, 0.0, 1.0, 1.0, //

        0.5, 0.5, 0.5, 1.0, 0.0, 1.0, 1.0, // Puple
        -0.5, 0.5, 0.5, 1.0, 0.0, 1.0, 1.0, //
        0.5, 0.5, -0.5, 1.0, 0.0, 1.0, 1.0, //

        -0.5, 0.5, -0.5, 1.0, 0.0, 1.0, 1.0, // Puple
        -0.5, 0.5, 0.5, 1.0, 0.0, 1.0, 1.0, //
        0.5, 0.5, -0.5, 1.0, 0.0, 1.0, 1.0, //

        0.5, -0.5, 0.5, 0.0, 1.0, 0.0, 1.0, // Green
        -0.5, -0.5, 0.5, 0.0, 1.0, 0.0, 1.0, //
        0.5, -0.5, -0.5, 0.0, 1.0, 0.0, 1.0, //

        -0.5, -0.5, -0.5, 0.0, 1.0, 0.0, 1.0, // Green
        -0.5, -0.5, 0.5, 0.0, 1.0, 0.0, 1.0, //
        0.5, -0.5, -0.5, 0.0, 1.0, 0.0, 1.0, //

        0.5, 0.5, -0.5, 1.0, 1.0, 0.0, 1.0, // Yellow
        0.5, -0.5, -0.5, 1.0, 1.0, 0.0, 1.0, //
        -0.5, 0.5, -0.5, 1.0, 1.0, 0.0, 1.0, //

        -0.5, -0.5, -0.5, 1.0, 1.0, 0.0, 1.0, // Yellow
        0.5, -0.5, -0.5, 1.0, 1.0, 0.0, 1.0, //
        -0.5, 0.5, -0.5, 1.0, 1.0, 0.0, 1.0, //
    ];

    return createdVBO;

}