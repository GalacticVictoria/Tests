import {registerStart} from "./Yuu API/RegisterStart";
import { Color } from "./Yuu API/Basic Types/Color";
import { Quaternion } from "./Yuu API/Basic Types/Quaternion";
import { Vector3 } from "./Yuu API/Basic Types/Vector3";
import { spawnPrimitive } from "./Yuu API/SpawnPrimitive";


registerStart(start);
function start() {

    const Particle1 = spawnPrimitive.sphere(
        3,
        3,
        new Vector3(-8.0, 1.5, -8.0),
        0.5,
        Quaternion.one,
        new Color(0.0, 1.0, 0.0),
        1.0,
        `None`,
        `Animated`,
        undefined);


    
}