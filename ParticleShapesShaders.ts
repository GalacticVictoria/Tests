import {registerStart} from "./Yuu API/RegisterStart";
import { Color } from "./Yuu API/Basic Types/Color";
import { Quaternion } from "./Yuu API/Basic Types/Quaternion";
import { Vector3 } from "./Yuu API/Basic Types/Vector3";
import { spawnPrimitive } from "./Yuu API/SpawnPrimitive";


registerStart(start);
function start() {

    const Particle1 = spawnPrimitive.sphere(
        3,
        2,
        new Vector3(-8.0, 1.5, -8.0),
        0.5,
        Quaternion.one,
        new Color(0.0, 1.0, 0.0),
        1.0,
        `None`,
        `Animated`,
        undefined);


        const Particle2 = spawnPrimitive.sphere(
        30,
        30,
        new Vector3(-6.0, 1.5, -8.0),
        0.5,
        Quaternion.one,
        new Color(0.0, 1.0, 0.0),
        1.0,
        `None`,
        `Animated`,
        undefined);



        const Particle3 = spawnPrimitive.cube(
        new Vector3(-4.0, 1.5, -8.0),
        new Vector3(0.05, 0.5, 0.05),
        Quaternion.one,
        new Color(0.0, 1.0, 0.0),
        1.0,
        false,
        `Animated`,
        undefined);



    const Particle4 = spawnPrimitive.cone(
        3,
        new Vector3(-2.0, 1.5, -8.0),
        0.5,
        Quaternion.one,
        new Color(0.0, 1.0, 0.0),
        1.0,
        `None`,
        `Animated`,
        undefined);

        Particle4.rot = new Quaternion(1.0, 0.0, 0.0, 0.0);
        Particle4.scale = new Vector3(0.5, 1.5, 0.5);




    
}