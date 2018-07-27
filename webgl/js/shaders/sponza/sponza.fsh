#version 300 es
precision mediump float;
#define M_PI 3.1415926535897932384626433832795


in vec3 interpolating_worldSpacePosition;
in vec2 interpolating_uv;
in vec3 interpolating_T;
in vec3 interpolating_B;
in vec3 interpolating_N;

//model view projection
uniform mat4 modelMat;
uniform mat4 viewMat;
uniform mat4 projectionMat;
//camera position
uniform vec3 cameraPos;

//material constants
uniform vec3 diffuseConstant;
uniform vec3 specularConstant;
uniform vec3 ambientConstant;
uniform float shininessConstant;


//textures
uniform sampler2D diffuseMap;
uniform sampler2D specularMap;
uniform sampler2D ambientMap;
uniform sampler2D bumpMap;


out vec3 resultIlumination;


void main()
{
  float centerTextel = texture(bumpMap,interpolating_uv).r;

  float rightTextel = textureOffset(bumpMap,interpolating_uv,ivec2(1,0)).r;
	float leftTextel = textureOffset(bumpMap,interpolating_uv,ivec2(-1,0)).r;
  float upperTextel = textureOffset(bumpMap,interpolating_uv,ivec2(0,1)).r;
	float bottomTextel = textureOffset(bumpMap,interpolating_uv,ivec2(0,-1)).r;

	float normalx = (centerTextel-rightTextel)+(leftTextel-centerTextel);
	float normaly = (centerTextel-upperTextel)+(bottomTextel-centerTextel);
	float normalz = 0.5f;

	vec3 objectSpaceNormal =  vec3(normalx,normaly,normalz);


  mat3 TBN = 	mat3(interpolating_T,interpolating_B, interpolating_N);

  vec3 tangentSpaceNormal = normalize(TBN*objectSpaceNormal);//normal map from tangent space


  vec3 light_LocalSpace = -normalize(vec3(1.0f,-1.0f,-1.0f));

	vec3 diffuseTexture = texture(diffuseMap,interpolating_uv).rgb;
	vec3 specularTexture = texture(specularMap,interpolating_uv).rgb;
	vec3 ambientTexture = texture(ambientMap,interpolating_uv).rgb;

	vec3 diffuseComponent = (diffuseTexture)*clamp(dot(tangentSpaceNormal,light_LocalSpace),0.0f,1.0f);

	vec3 reflectionVector = normalize(reflect(-light_LocalSpace,tangentSpaceNormal));
	vec3 viewDirection = normalize(cameraPos-interpolating_worldSpacePosition);
	float m = shininessConstant;
	vec3 specularComponent = (specularTexture)*pow(clamp(dot(reflectionVector,viewDirection),0.0f,1.0f),m);

	float lightIntensity = 0.7f;
	resultIlumination = (diffuseComponent + specularComponent*((m+2.0f)/2.0f))*(1.0f/M_PI)*lightIntensity;
  resultIlumination = vec3(1.0,0.0,0.0);

}
