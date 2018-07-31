#version 300 es
precision mediump float;

layout(location=0)in vec3 position;
layout(location=1)in vec3 normal;
layout(location=3)in vec2 uvCoordinates;

out vec3 interpolatingWorldSpacePosition;
out vec3 interpolatingNormal;
out vec2 interpolatingUV;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;



void main()
{
  mat4 mvp = projectionMatrix*viewMatrix*modelMatrix;

	interpolatingWorldSpacePosition = position;
	interpolatingNormal = normal;
  interpolatingUV = uvCoordinates;

	gl_Position=mvp*vec4(position,1.0f);
}
