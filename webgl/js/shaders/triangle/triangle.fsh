#version 300 es
precision mediump float;


in vec3 interpolatingWorldSpacePosition;
in vec3 interpolatingNormal;





out vec4 resultIlumination;


void main()
{



  resultIlumination = vec4(1.0,0.0,0.0,1.0);
}
