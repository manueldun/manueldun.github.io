#version 300 es
precision mediump float;

layout(location=0)in vec3 position;

void main()
{
    gl_Position = vec4(position.xyz,1.0);
}