#version 300 es

layout(location=0)in vec3 position;



uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

void main()
{
    mat4 mvp = viewMatrix*projectionMatrix*modelMatrix;
    
}
