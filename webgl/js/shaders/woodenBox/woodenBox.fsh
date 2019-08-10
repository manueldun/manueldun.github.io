#version 300 es
precision mediump float;
#define M_PI 3.1415926535897932384626433832795

in vec2 v_uv;

uniform sampler2D woodenTexture;

out vec4 resultIlumination;


//model view projection
uniform mat4 modelMat;
uniform mat4 viewMat;
uniform mat4 projectionMat;

void main()
{
  vec4 outputTexture=texture(woodenTexture, v_uv);
	resultIlumination = outputTexture;
}
