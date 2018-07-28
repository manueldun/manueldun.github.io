#version 300 es
precision mediump float;

layout(location=0)in vec3 position;

out vec3 interpolatingWorldSpacePosition;
out vec3 interpolatingNormal;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;



void main()
{
  mat4 mvp = projectionMatrix*viewMatrix*modelMatrix;

	interpolatingWorldSpacePosition = position;


	gl_Position=mvp*vec4(position,1.0f);
}
