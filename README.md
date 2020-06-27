# WebGL_Tutorial 
# with Video Texture Mapping

## File Manifest
- index.html
- /js
- /css
- /resouce

 ## 1. Project description
### 1.1. Contents
    Going further from the WEBGL image textures learned in the subject, 
    you can insert videos into cubes through video textures 
    I created a function that can be played back, and based on this, 
    I made a tutorial to help other colleagues learn.
<br/>

#### 1.1.1. Description of service
![1](https://user-images.githubusercontent.com/46476398/85922171-30c80a00-b8bc-11ea-9e03-92dec7f3cd4d.png)
#### 1.1.2. Example of video mapping
![2](https://user-images.githubusercontent.com/46476398/85922169-2efe4680-b8bc-11ea-9b40-602b7645de48.png)
#### 1.1.3. References
![3](https://user-images.githubusercontent.com/46476398/85922170-30c80a00-b8bc-11ea-8240-b3aa51bb8191.png)
### Improvement List
	I tried to implement the ability to insert a video on each of the six sides of the cube, 
	but it didn't work. I hope to try it out next time.
<br/>

 ## 2. Video mapping details

### 2.1. Basic Structures
- Video and Canvas size is 550 x 640
- Vertex Shader code
 
```c
attribute highp vec3 myVertex; \
attribute highp vec4 myColor; \
attribute highp vec2 myUV; \
attribute highp vec3 myNormal; \
uniform mediump mat4 Pmatrix; \
uniform mediump mat4 Vmatrix; \
uniform mediump mat4 Mmatrix; \
varying mediump vec4 color; \
varying mediump vec2 texCoord;\
void main(void)  \
{ \
	gl_Position = Pmatrix*Vmatrix*Mmatrix*vec4(myVertex, 1.0);\
	color = myColor;\
	texCoord = myUV; \
}';
```
Model, View, Projective Matrices are Uniform.<br>
Position and color Matrices are attribute<br>
Return color vColor is varying to return to Fragment Shader.

- Fragment Shader code
```c
var fragmentShaderSource = '\
varying mediump vec4 color; \
varying mediump vec2 texCoord;\
uniform sampler2D sampler2d; \
void main(void) \
{ \
	gl_FragColor = texture2D(sampler2d, texCoord); \
}';
```
color is returned from Vertex Shader.




### 2.2. Video mapping setting

The cube.js file can be controlled through an event listener.
~~~javascript
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
~~~




## Copyright
(CC-NC-BY) JEON HYUNBIN 2020

## References
- https://html5-templates.com/preview/bootstrap-scrolling-sticky-menu.html
- https://webglfundamentals.org/webgl/lessons/webgl-3d-textures.html
- https://git.ajou.ac.kr/hwan/webgl-tutorial/-/tree/master/student2019
- https://en.wikipedia.org/wiki/Texture_mapping
