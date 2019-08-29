#version 300 es
precision mediump float;

layout(location=0)in vec3 position;
layout(location=1)in vec2 uv;


out vec2 v_uv;


//model view projection
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

uniform vec3 cameraPosition;
void main()
{
  mat4 mvp = viewMatrix*projectionMatrix*modelMatrix;
  v_uv=uv;
	gl_Position=vec4(position,1.0f)*mvp;
}
