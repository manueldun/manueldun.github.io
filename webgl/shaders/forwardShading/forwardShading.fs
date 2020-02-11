#version 300 es
precision mediump float;
#define M_PI 3.1415926535897932384626433832795

in vec2 v_uv;
in vec3 v_normal;
in vec3 v_pos;
in vec3 v_cameraPosition;

uniform sampler2D diffuseTexture;

out vec4 resultIlumination;


//model view projection
uniform mat4 modelMat;
uniform mat4 viewMat;
uniform mat4 projectionMat;

void main()
{

  vec3 sunLight = normalize(vec3(1.0,1.0,1.0));
  vec2 flippedUV= v_uv;
  flippedUV.y= -flippedUV.y+1.0;
  vec3 outputTexture=texture(diffuseTexture, flippedUV).xyz;
  resultIlumination = vec4(outputTexture*clamp(0.0, 1.0, dot(normalize(v_normal),sunLight)),1.0)*0.5+vec4(outputTexture*0.5,1.0);
  resultIlumination = vec4(sqrt(resultIlumination.rgb),1.0);
  //resultIlumination = vec4(vec3(length(v_pos-v_cameraPosition)),1.0);

}
