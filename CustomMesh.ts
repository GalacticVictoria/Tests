
import { registerStart } from "./Yuu API/RegisterStart";
import { Vector3 } from "./Yuu API/Basic Types/Vector3";
import { Vector2 } from "./Yuu API/Basic Types/Vector2";
import { Quaternion } from "./Yuu API/Basic Types/Quaternion";
import { Entity } from "./Yuu API/Entity";

registerStart(start);

function start() {

 
  // RAW DATA FROM YOUR JSON FILE

  const rawVerts = [
    [-0.16841921210289001, -0.5643641948699951, 3.7384681701660156],
    [-0.16841921210289001, -0.09724806994199753, 4.605650901794434],
    [-0.16841921210289001, -0.09724806994199753, 2.8712854385375977],
    [-0.16841921210289001, 0.3698679208755493, 3.7384681701660156],
    [0.16841921210289001, -0.5643641948699951, 3.7384681701660156],
    [0.16841921210289001, -0.09724806994199753, 4.605650901794434],
    [0.16841921210289001, -0.09724806994199753, 2.8712854385375977],
    [0.16841921210289001, 0.3698679208755493, 3.7384681701660156],
    [0.0, -0.09724798053503036, 2.3242545127868652],
    [0.0, 0.6645312905311584, 3.7384681701660156],
    [0.0, -0.8590273857116699, 3.7384681701660156],
    [0.0, -0.09724804013967514, 5.152681350708008]
  ];

  const rawUVs = [
    [0.375, 0.0], [0.625, 0.25], [0.375, 0.25], [0.625, 0.375],
    [0.375, 0.5], [0.375, 0.375], [0.625, 0.5], [0.375, 0.75],
    [0.375, 0.5], [0.375, 0.875], [0.625, 1.0], [0.375, 1.0],
    [0.375, 0.5], [0.25, 0.75], [0.25, 0.5], [0.75, 0.5],
    [0.875, 0.75], [0.75, 0.75], [0.75, 0.5], [0.625, 0.75],
    [0.625, 0.5], [0.125, 0.5], [0.25, 0.75], [0.125, 0.75],
    [0.625, 0.75], [0.375, 0.875], [0.375, 0.75], [0.375, 0.25],
    [0.625, 0.375], [0.375, 0.375], [0.375, 0.0], [0.625, 0.0],
    [0.625, 0.25], [0.625, 0.375], [0.625, 0.5], [0.375, 0.5],
    [0.625, 0.5], [0.625, 0.75], [0.375, 0.75], [0.375, 0.875],
    [0.625, 0.875], [0.625, 1.0], [0.375, 0.5], [0.375, 0.75],
    [0.25, 0.75], [0.75, 0.5], [0.875, 0.5], [0.875, 0.75],
    [0.75, 0.5], [0.75, 0.75], [0.625, 0.75], [0.125, 0.5],
    [0.25, 0.5], [0.25, 0.75], [0.625, 0.75], [0.625, 0.875],
    [0.375, 0.875], [0.375, 0.25], [0.625, 0.25], [0.625, 0.375]
  ];

  const triangles = [
    0,3,2, 9,6,8, 7,4,6, 10,1,0, 6,10,8, 9,1,11,
    9,5,7, 2,10,0, 5,10,4, 2,9,8, 0,1,3, 9,7,6,
    7,5,4, 10,11,1, 6,4,10, 9,3,1, 9,11,5, 2,8,10,
    5,11,10, 2,3,9
  ];

  // CONVERT RAW ARRAYS → API TYPES

  const verts = rawVerts.map(v => new Vector3(v[0], v[1], v[2]));
  const uvs = rawUVs.map(uv => new Vector2(uv[0], uv[1]));


  // CREATE ENTITY + MESH

  const crystal = new Entity(
    new Vector3(4, 6, -4),
    Quaternion.one,
    Vector3.one,
    undefined,
    "Empty"
  );

  // Ensure UVs length matches verts length; auto-adjust if needed
  if (uvs.length !== verts.length) {
    console.warn(`UV count (${uvs.length}) doesn't match verts count (${verts.length}). Adjusting UVs.`);

    if (uvs.length > verts.length) {
      // Truncate extra UVs
      uvs.length = verts.length;
    }
    else {
      // Pad missing UVs with a centered UV
      while (uvs.length < verts.length) {
        uvs.push(new Vector2(0.5, 0.5));
      }
    }
  }

  crystal.mesh.create(verts, uvs, triangles);

  crystal.rot = new Quaternion(0.7071068, 0, 0, 0.7071068); 

  // Optional: scale it down 
  //crystal.scale = new Vector3(0.2, 0.2, 0.2);
}

