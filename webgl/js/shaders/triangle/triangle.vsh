#version 300 es
precision mediump float;

layout(location=0)in vec3 position;

out vec3 interpolatingWorldSpacePosition;
out vec3 interpolatingNormal;





void main()
{

	interpolatingWorldSpacePosition = position;


	gl_Position=vec4(position,1.0f);
}
