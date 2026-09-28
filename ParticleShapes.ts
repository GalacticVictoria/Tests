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


        const Particle3 = spawnPrimitive.sphere(
        5,
        20,
        new Vector3(-4.0, 1.5, -8.0),
        0.5,
        Quaternion.one,
        new Color(0.0, 1.0, 0.0),
        1.0,
        `None`,
        `Animated`,
        undefined);



        const Particle4 = spawnPrimitive.sphere(
        30,
        30,
        new Vector3(-2.0, 1.5, -8.0),
        0.5,
        Quaternion.one,
        new Color(0.0, 1.0, 0.0),
        1.0,
        `None`,
        `Animated`,
        undefined);

        Particle4.scale = new Vector3(0.5, 1.0, 0.5);



        const Particle5 = spawnPrimitive.cube(
        new Vector3(0.0, 1.5, -8.0),
        new Vector3(0.05, 0.5, 0.05),
        Quaternion.one,
        new Color(0.0, 1.0, 0.0),
        1.0,
        false,
        `Animated`,
        undefined);



        const Particle6 = spawnPrimitive.cone(
        3,
        new Vector3(2.0, 1.5, -8.0),
        0.5,
        Quaternion.one,
        new Color(0.0, 1.0, 0.0),
        1.0,
        `None`,
        `Animated`,
        undefined);

        Particle4.rot = new Quaternion(1.0, 0.0, 0.0, 0.0);
        Particle4.scale = new Vector3(0.05, 0.2, 0.05);


        const Heart = spawnPrimitive.sphere(
        30,
        30,
        new Vector3(4.0, 1.5, -8.0),
        0.5,
        Quaternion.one,
        new Color(0.0, 1.0, 0.0),
        1.0,
        `None`,
        `Animated`,
        undefined);

        

        const HeartShader = `shader_type spatial;

uniform float displacement_strength: hint_range(0.0, 1.0) = 1.0;
uniform vec3 starting_color = vec3(0.5, 0.0 ,0.5);
uniform vec3 ending_color = vec3(1.0, 0.0 ,0.5);

varying float colorshift;

void vertex() {
	float animation = sin(TIME * 2.0) * 0.15 + 0.75;
	
	colorshift = (animation - 0.6) /0.3;
	
	VERTEX.y += abs(1.0 * VERTEX.x) * displacement_strength * animation;
	VERTEX.z = -0.5 * VERTEX.z;
}

void fragment() {
	
	
	vec3 final_color = mix(starting_color, ending_color, colorshift);
	ALBEDO = final_color;
	
	//ALBEDO = vec3(1, 0, 0);
    METALLIC = 0.5;
	ROUGHNESS = 0.7;
}`;

    if(Heart.mesh.nodeID) {
        Godot.shader.applyToMesh(Heart.mesh.nodeID, HeartShader);
    }

    }

