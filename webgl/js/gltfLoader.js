import  getString  from "toolkit.js";
export function loadGLTF(path)
{
    const gltfJSON = JSON.parse(getString(path));
    if(gltfJSON.asset.version !=="2.0")
    {
        throw "asset version not found";
    }

    
}   