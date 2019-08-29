#version 300 es
precision mediump float;


layout(location=0)in vec3 pos;
layout(location=1)in vec3 normal;
layout(location=2)in vec2 uv;
layout(location=3)in vec3 tangent;
layout(location=4)in vec3 bitangent;


uniform mat4 modelMat;
uniform mat4 viewMat;
uniform mat4 projectionMat;

out vec3 interpolating_worldSpacePosition;
out vec2 interpolating_uv;
out vec3 interpolating_T;
out vec3 interpolating_B;
out vec3 interpolating_N;



void main()
{
	mat4 mvp = projectionMat*viewMat*modelMat;

	interpolating_worldSpacePosition = pos;
	interpolating_uv = uv;

	interpolating_T = tangent;
	interpolating_B = bitangent;
	interpolating_N = normal;


	gl_Position=mvp*vec4(pos,1.0f);
}
