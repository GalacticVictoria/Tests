
import { crystalMesh } from "./MeshesGeometry";
import { Color } from "./Yuu API/Basic Types/Color";
import { Quaternion } from "./Yuu API/Basic Types/Quaternion";
import { Vector2 } from "./Yuu API/Basic Types/Vector2";
import { Vector3 } from "./Yuu API/Basic Types/Vector3";
import { registerStart } from "./Yuu API/RegisterStart";
import { Entity } from "./Yuu API/Entity";
import { inWorldConsole } from "./Yuu API/Console";



export type ExportedMeshData = {
  verts: Float32Array;
  uvs: Float32Array;
  triangles: Int32Array;
};

function unpackVerts(flat: Float32Array): Vector3[] {
  const verts: Vector3[] = [];

  for (let i = 0; i < flat.length; i += 3) {
    verts.push(new Vector3(
      flat[i],
      flat[i + 1],
      flat[i + 2]
    ));
  }

  return verts;
}

function unpackUVs(flat: Float32Array): Vector2[] {
  const uvs: Vector2[] = [];

  for (let i = 0; i < flat.length; i += 2) {
    uvs.push(new Vector2(
      flat[i],
      flat[i + 1]
    ));
  }

  return uvs;
}

export function customMesh(
  meshData: ExportedMeshData,
  pos: Vector3,
  scale: Vector3 = Vector3.one,
  rot: Quaternion = Quaternion.one,
  color: Color = Color.white,
  alphaTransparency = 1,
  colliderType: 'None' | 'Convex' | 'Concave' = 'None',
  type: BaseNodeTypes = "Empty",
  parent?: Entity
): Entity {

  const entity = new Entity(
    pos,
    rot,
    Vector3.one,
    parent,
    type
  );

  entity.mesh.create(
    unpackVerts(meshData.verts),
    unpackUVs(meshData.uvs),
    Array.from(meshData.triangles)
  );

  entity.mesh.color.set(
    color,
    Math.min(1, alphaTransparency)
  );

  if (colliderType !== "None" && entity.mesh.nodeID) {
    entity.collider.createFromMeshNode(
      entity.mesh.nodeID,
      colliderType
    );
  }

  entity.scale = scale;

  return entity;
}


export function customMeshWithShader(
  meshData: ExportedMeshData,
  shaderCode: string,
  pos: Vector3,
  scale: Vector3 = Vector3.one,
  rot: Quaternion = Quaternion.one,
  color: Color = Color.white,
  alphaTransparency = 1,
  colliderType: 'None' | 'Convex' | 'Concave' = 'None',
  type: BaseNodeTypes = "Empty",
  parent?: Entity
): Entity {

  const entity = customMesh(
    meshData,
    pos,
    scale,
    rot,
    color,
    alphaTransparency,
    colliderType,
    type,
    parent
  );

  if (entity.mesh.nodeID) {
    Godot.shader.applyToMesh(
      entity.mesh.nodeID,
      shaderCode
    );
  }

  return entity;
}

registerStart(start);
function start() {

     inWorldConsole.visible(true, new Vector3(4,1.5,-1.5));

    console.log("Crystal verts:", crystalMesh.verts.length);
    console.log("Crystal triangles:", crystalMesh.triangles.length);


    const crystal = customMesh(
        crystalMesh,
        new Vector3(6, 1.5, -1.5),
        new Vector3(1, 1, 1),
        Quaternion.one,
        new Color(0,0,1),
        1,
        "Convex",
        "Empty",
        undefined);


}
