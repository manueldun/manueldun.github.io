#version 300 es
precision mediump float;

layout(location=0)in vec3 position;
layout(location=1)in vec2 uv;
layout(location=2)in vec3 normal;


out vec2 v_uv;
out vec3 v_normal;
out vec3 v_pos;
out vec3 v_cameraPosition;

//model view projection
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform vec3 cameraPosition;

void main()
{
  mat4 mvp = projectionMatrix*viewMatrix*modelMatrix;
  v_uv = uv;
  v_normal = normal;
  v_cameraPosition = (mvp*vec4(cameraPosition,1.0)).xyz;
	gl_Position = mvp*vec4(position,1.0f);
}
