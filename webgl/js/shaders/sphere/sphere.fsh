#version 300 es
precision mediump float;
#define M_PI 3.1415926535897932384626433832795


in vec3 interpolatingWorldSpacePosition;
in vec3 interpolatingNormal;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform vec3 cameraPosition;

uniform vec3 diffuseConstant;
uniform vec3 specularConstant;
uniform vec3 ambientConstant;
uniform float shininessConstant;

//uniform float lightIntensity;
//uniform vec3 lightDirection;

out vec4 resultIlumination;


void main()
{


  vec3 normal = normalize(interpolatingNormal);


  vec3 lightDirection=normalize(vec3(1.0,1.0,0.0));

	vec3 diffuseComponent = (diffuseConstant)*clamp(dot(normal,lightDirection),0.0f,1.0f);

	vec3 reflectionVector = normalize(reflect(lightDirection,normal));
	vec3 viewDirection = normalize(cameraPosition-interpolatingWorldSpacePosition);

	vec3 specularComponent = (specularConstant)*pow(clamp(dot(reflectionVector,viewDirection),0.0f,1.0f),shininessConstant);

	resultIlumination = vec4((diffuseComponent + specularComponent*((shininessConstant+2.0f)/2.0f))*(1.0f/M_PI),1.0);
  resultIlumination = vec4(1.0,0.0,0.0,1.0);
}
