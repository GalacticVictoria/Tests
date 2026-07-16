import { Color } from "./Yuu API/Basic Types/Color";
import { Quaternion } from "./Yuu API/Basic Types/Quaternion";
import { Vector3 } from "./Yuu API/Basic Types/Vector3";
import { registerStart } from "./Yuu API/RegisterStart";
import { spawnPrimitive } from "./Yuu API/SpawnPrimitive";






registerStart(start);
function start() {

    //Sphere Emission

    const Esphere1 = spawnPrimitive.sphere(
        30,
        30,
        new Vector3(0, -4.0, 0),
        1,
        Quaternion.one, new Color(0, 0, 0),
        1,
        "Sphere",
        "Static",
        undefined);

    const Emission1 = `shader_type spatial;
render_mode blend_mix, depth_draw_opaque, cull_back, diffuse_burley, specular_schlick_ggx;

// --- Exposed to the Inspector, matching the Blender Group's inputs ---
uniform vec4 line_color : source_color = vec4(0.01, 0.0, 0.02, 1.0);
uniform float line_strength : hint_range(0.0, 2000.0) = 75.0;
uniform float blend_amount : hint_range(0.0, 0.999) = 0.25;

// --- Base surface (from the Principled BSDF inside the group) ---
uniform vec4 base_color : source_color = vec4(0.0, 0.0, 0.0, 0.0);
uniform float metallic_amount : hint_range(0.0, 1.0) = 1.0;
uniform float roughness_amount : hint_range(0.0, 1.0) = 1.0;

// --- Color Ramp thresholds (from the B-Spline stops in the original ramp) ---
uniform float ramp_low : hint_range(0.0, 1.0) = 0.1;
uniform float ramp_high : hint_range(0.0, 1.0) = 0.9;

void fragment() {
	// NORMAL and VIEW are already in view space in Godot's fragment stage,
	// so this dot product is the direct equivalent of Blender's
	// Layer Weight "Facing" output (abs(dot(incoming, normal))).
	float ndotv = abs(dot(NORMAL, VIEW));

	// Blender's Layer Weight remaps "Blend" before applying it as an exponent:
	// blend < 0.5 -> 2*blend,  blend >= 0.5 -> 0.5 / (1 - blend)
	float remapped_blend = blend_amount < 0.5
		? 2.0 * blend_amount
		: 0.5 / max(1.0 - blend_amount, 0.0001);

	// Blender's "Facing" output is inverted from raw NdotV — it's a cheap
	// Fresnel-style ratio: near 0 when the surface faces the camera
	// straight-on, near 1 at grazing/silhouette angles.
	float facing = 1.0 - pow(clamp(ndotv, 0.0, 1.0), remapped_blend);

	// The original Color Ramp is really a hard step dressed up as a gradient
	// (its two stops are only ~0.018 apart), so smoothstep reproduces it well.
	float line_mask = smoothstep(ramp_low, ramp_high, facing);

	ALBEDO = base_color.rgb;
	METALLIC = metallic_amount;
	ROUGHNESS = roughness_amount;

	// Mix Shader(Fac) -> BSDF at Fac=0, Emission at Fac=1.
	// Godot has no "Mix Shader" node, so the emissive line is layered on top
	// via EMISSION, gated by the same mask.
	EMISSION = mix(vec3(0.0), line_color.rgb * line_strength, line_mask);
}`;

    if (Esphere1.mesh.nodeID) {
        Godot.shader.applyToMesh(Esphere1.mesh.nodeID, Emission1)
    }


    //Magic Portal Shader Variants

    const MPplane1 = spawnPrimitive.plane(
        "Front",
        new Vector3(0, 4.0, -1.5),
        new Vector3(3.2, 1.8, 1),
        Quaternion.one, new Color(0, 0.2, 0.5),
        1,
        "Convex",
        "Animated",
        undefined);


    const MagicPortal1 = `shader_type spatial;

uniform vec2 resolution = vec2(1920.0,1080.0);
uniform float direction: hint_range(-1.0, 1.0, 0.01) = 0.5;
uniform float brightness: hint_range(0.0, 30.0, 0.01) = 30.0;
uniform float speed: hint_range(0.0, 10.0, 0.01) = 0.8;
uniform float octaves: hint_range(1.0, 200.0, 0.1) = 100.0;
uniform float shift: hint_range(0.0, 10.0, 0.01) = 1.0;
uniform float strech: hint_range(1.0, 100.0, 0.1) = 8.0;
uniform float alpha_threshold: hint_range(0.0, 1.0, 0.01) = 0;

//palette group
uniform vec3 b: source_color = vec3(0.5, 0.5, 0.5);
uniform vec3 c: source_color = vec3(0.5, 0.5, 0.5);
uniform vec3 d: source_color = vec3(1.0, 1.0, 1.0);
uniform vec3 e: source_color = vec3(0.0, 0.33, 0.67);

vec3 palette(float t){
	return b + c * cos(TAU * (d * t + e));
}

mat2 rotate(float a) {
	float sa = sin(a);
	float ca = cos(a);
	return mat2(vec2(ca, sa), vec2(-sa,ca));
}

vec3 fbm(vec3 ray) { //fbm = fractal brownian motion
	vec3 result = vec3(0.0);
	float time = TIME * speed;
	for (float i = 0.0; i < octaves; i++) {
		vec3 p = result;
		p.z += time + i * shift * 0.01;
		p.z /= strech * 1.0;
		p.xy *= rotate(p.z);
		result += length(sin(p.yz + time) + cos(p.zz + time)) * ray;
	}
	return result;
}

void fragment() {
	vec2 uv = UV - 0.5; //moves coordinate origin to center
	uv.x *= resolution.x / resolution.y;
	vec3 ray = vec3(uv, direction);
	vec3 result = fbm(ray);
	float t = brightness / length(result);
	vec3 color = palette(t * 0.09 + TIME * 0.05) * t;
	float avg = (color.r + color.g + color.b) / 3.0;
	
	
	ALBEDO = color;
	ALPHA = avg <= alpha_threshold ? 0.0 : 1.0;
}`;

    if (MPplane1.mesh.nodeID) {
        Godot.shader.applyToMesh(MPplane1.mesh.nodeID, MagicPortal1)
    }





    const MPplane2 = spawnPrimitive.plane(
        "Front",
        new Vector3(4.0, 4.0, -1.5),
        new Vector3(3.2, 1.8, 1),
        Quaternion.one, new Color(0, 0.2, 0.5),
        1,
        "Convex",
        "Animated",
        undefined);


    const MagicPortal2 = `shader_type spatial;

uniform vec2 resolution = vec2(1920.0,1080.0);
uniform float direction: hint_range(-1.0, 1.0, 0.01) = 0.1;
uniform float brightness: hint_range(0.0, 30.0, 0.01) = 10.0;
uniform float speed: hint_range(0.0, 10.0, 0.01) = 0.8;
uniform float octaves: hint_range(1.0, 200.0, 0.1) = 100.0;
uniform float shift: hint_range(0.0, 10.0, 0.01) = 1.0;
uniform float strech: hint_range(1.0, 100.0, 0.1) = 0.5;
uniform float alpha_threshold: hint_range(0.0, 1.0, 0.01) = 0;

//palette group
uniform vec3 b: source_color = vec3(0.5, 0.5, 0.5);
uniform vec3 c: source_color = vec3(0.5, 0.5, 0.5);
uniform vec3 d: source_color = vec3(1.0, 1.0, 1.0);
uniform vec3 e: source_color = vec3(0.0, 0.33, 0.67);

vec3 palette(float t){
	return b + c * cos(TAU * (d * t + e));
}

mat2 rotate(float a) {
	float sa = sin(a);
	float ca = cos(a);
	return mat2(vec2(ca, sa), vec2(-sa,ca));
}

vec3 fbm(vec3 ray) { //fbm = fractal brownian motion
	vec3 result = vec3(0.0);
	float time = TIME * speed;
	for (float i = 0.0; i < octaves; i++) {
		vec3 p = result;
		p.z += time + i * shift * 0.01;
		p.z /= strech * 1.0;
		p.xy *= rotate(p.z);
		result += length(sin(p.yx + time) + cos(p.xz + time)) * ray;
	}
	return result;
}

void fragment() {
	vec2 uv = UV - 0.5; //moves coordinate origin to center
	uv.x *= resolution.x / resolution.y;
	vec3 ray = vec3(uv, direction);
	vec3 result = fbm(ray);
	float t = brightness / length(result);
	float dist = length(uv);
	vec3 color = palette(dist * 1.0 + TIME * -0.2) * t;
	float avg = (color.r + color.g + color.b) / 3.0;
	
	
	ALBEDO = color;
	ALPHA = avg <= alpha_threshold ? 0.0 : 1.0;
}`;

    if (MPplane2.mesh.nodeID) {
        Godot.shader.applyToMesh(MPplane2.mesh.nodeID, MagicPortal2)
    }




    const MPplane3 = spawnPrimitive.plane(
        "Front",
        new Vector3(0, 1.5, -1.5),
        new Vector3(3.2, 1.8, 1),
        Quaternion.one, new Color(0, 0.2, 0.5),
        1,
        "Convex",
        "Animated",
        undefined);


    const MagicPortal3 = `shader_type spatial;
    
    uniform vec2 resolution = vec2(1920.0,1080.0);
    uniform vec3 line_color: source_color = vec3(0.0,1.0,0.0);
    uniform float direction: hint_range(-1.0, 1.0, 0.01) = 0.5;
    uniform float brightness: hint_range(0.0, 30.0, 0.01) = 15.0;
    uniform float speed: hint_range(0.0, 10.0, 0.01) = 1.0;
    uniform float octaves: hint_range(1.0, 200.0, 0.1) = 100.0;
    uniform float shift: hint_range(0.0, 10.0, 0.01) = 1.0;
    uniform float strech: hint_range(1.0, 100.0, 0.1) = 10.0;
    uniform float alpha_threshold: hint_range(0.0, 1.0, 0.01) = 0;
    
    mat2 rotate(float a) {
        float sa = sin(a);
        float ca = cos(a);
        return mat2(vec2(ca, sa), vec2(-sa,ca));
        }
        
        vec3 fbm(vec3 ray) { //fbm = fractal brownian motion
        vec3 result = vec3(0.0);
        float time = TIME * speed;
        for (float i = 0.0; i < octaves; i++) {
            vec3 p = result;
            p.z += time + i * shift * 0.01;
            p.z /= strech * 1.0;
            p.xy *= rotate(p.z);
            result += length(sin(p.yx + time) + cos(p.xz + time)) * ray;
            }
            return result;
            }
            
            void fragment() {
                vec2 uv = UV - 0.5; //moves coordinate origin to center
                uv.x *= resolution.x / resolution.y;
                vec3 ray = vec3(uv, direction);
                vec3 result = fbm(ray);
                vec3 color = vec3(brightness / length(result)) * line_color;
                float avg = (color.r + color.g + color.b) / 3.0;
                
                
                ALBEDO = color;
                ALPHA = avg <= alpha_threshold ? 0.0 : 1.0;
                }`;

    if (MPplane3.mesh.nodeID) {
        Godot.shader.applyToMesh(MPplane3.mesh.nodeID, MagicPortal3)
    }




    //Fractal Flower Shader Variants


    const FFplane1 = spawnPrimitive.plane(
        "Front",
        new Vector3(-8.0, 4.0, -1.5),
        new Vector3(3.2, 1.8, 1),
        Quaternion.one, new Color(0, 0.2, 0.5),
        1,
        "Convex",
        "Animated",
        undefined);

    const fractalFlower1 = `shader_type spatial;
    
    uniform vec2 resolution = vec2(1920.0, 1080.0);
    uniform float speed: hint_range(0.0, 10.0, 0.01) = 1.5;
    uniform float iterations: hint_range(0.0, 10.0, 1.0) = 1.0;
    uniform float slices: hint_range(1.0, 100.0, 1.0) = 0.0;
    uniform float warp: hint_range(1.0, 100.0, 0.1) = 30.0;
    
    uniform vec3 a: source_color = vec3(0.5, 0.5, 0.5);
    uniform vec3 b: source_color = vec3(0.5, 0.5, 0.5);
    uniform vec3 c: source_color = vec3(1.0, 1.0, 1.0);
    uniform vec3 d: source_color = vec3(0.0, 0.33, 0.67);
    
    vec3 palette(float t) {
    return a + b * cos(TAU * (c * t + d));
    }
    
    
    void fragment() {
    vec2 uv = UV - 0.5;
    uv.x *= resolution.x / resolution.y;
    float time = TIME * speed;
    vec3 result = vec3(0.0);
    vec2 polar = vec2(atan(uv.x, uv.y), length(uv));
    
    for (float i = 0.0; i < iterations; i++) {
        float angle = polar.x * (slices + i);
        float shape = abs(sin(angle)) + 1.0;
        uv = fract(uv * shape) - 0.5;
        float dist = length(uv) * exp(-polar.y) * shape;
        dist = 0.01 / abs(sin(dist * warp + angle + time) / warp);
        vec3 color = palette(polar.y + shape + i + time * 0.1);
        result += color * dist * shape;
    }
    
    ALBEDO = result;
    ALPHA = 1.0;
    }
    
                
    `
    if (FFplane1.mesh.nodeID) {
        Godot.shader.applyToMesh(FFplane1.mesh.nodeID, fractalFlower1)
    }



    const FFplane2 = spawnPrimitive.plane(
        "Front",
        new Vector3(-4.0, 4.0, -1.5),
        new Vector3(3.2, 1.8, 1),
        Quaternion.one, new Color(0, 0.2, 0.5),
        1,
        "Convex",
        "Animated",
        undefined);

    const fractalFlower2 = `shader_type spatial;
    
    uniform vec2 resolution = vec2(1920.0, 1080.0);
    uniform float speed: hint_range(0.0, 10.0, 0.01) = 1.0;
    uniform float iterations: hint_range(0.0, 10.0, 1.0) = 1.0;
    uniform float slices: hint_range(1.0, 100.0, 1.0) = 4.0;
    uniform float warp: hint_range(1.0, 100.0, 0.1) = 10.0;
    
    uniform vec3 a: source_color = vec3(0.5, 0.5, 0.5);
    uniform vec3 b: source_color = vec3(0.5, 0.5, 0.5);
    uniform vec3 c: source_color = vec3(1.0, 1.0, 1.0);
    uniform vec3 d: source_color = vec3(0.0, 0.33, 0.33);
    
    vec3 palette(float t) {
    return a + b * cos(TAU * (c * t + d));
    }
    
    
    void fragment() {
    vec2 uv = UV - 0.5;
    uv.x *= resolution.x / resolution.y;
    float time = TIME * speed;
    vec3 result = vec3(0.0);
    vec2 polar = vec2(atan(uv.x, uv.y), length(uv));
    
    for (float i = 0.0; i < iterations; i++) {
        float angle = polar.x * (slices + i);
        float shape = abs(sin(angle)) + 1.0;
        uv = fract(uv * shape) - 0.5;
        float dist = length(uv) * exp(-polar.y) * shape;
        dist = 0.01 / abs(sin(dist * warp + angle + time) / warp);
        vec3 color = palette(polar.y + shape + i + time * 0.1);
        result += color * dist * shape;
    }
    
    ALBEDO = result;
    ALPHA = 1.0;
    }
    
                
    `
    if (FFplane2.mesh.nodeID) {
        Godot.shader.applyToMesh(FFplane2.mesh.nodeID, fractalFlower2)
    }


    const FFplane3 = spawnPrimitive.plane(
        "Front",
        new Vector3(-8.0, 1.5, -1.5),
        new Vector3(3.2, 1.8, 1),
        Quaternion.one, new Color(0, 0.2, 0.5),
        1,
        "Convex",
        "Animated",
        undefined);

    const fractalFlower3 = `shader_type spatial;
    
    uniform vec2 resolution = vec2(1920.0, 1080.0);
    uniform float speed: hint_range(0.0, 10.0, 0.01) = 1.0;
    uniform float iterations: hint_range(0.0, 10.0, 1.0) = 4.0;
    uniform float slices: hint_range(1.0, 100.0, 1.0) = 6.0;
    uniform float warp: hint_range(1.0, 100.0, 0.1) = 2.0;
    
    uniform vec3 a: source_color = vec3(0.5, 0.5, 0.5);
    uniform vec3 b: source_color = vec3(0.5, 0.5, 0.5);
    uniform vec3 c: source_color = vec3(1.0, 1.0, 1.0);
    uniform vec3 d: source_color = vec3(0.0, 0.33, 0.67);
    
    vec3 palette(float t) {
    return a + b * cos(TAU * (c * t + d));
    }
    
    
    void fragment() {
    vec2 uv = UV - 0.5;
    uv.x *= resolution.x / resolution.y;
    float time = TIME * speed;
    vec3 result = vec3(0.0);
    vec2 polar = vec2(atan(uv.x, uv.y), length(uv));
    
    for (float i = 0.0; i < iterations; i++) {
        float angle = polar.x * (slices + i);
        float shape = abs(sin(angle)) + 1.0;
        uv = fract(uv * shape) - 0.5;
        float dist = length(uv) * exp(-polar.y) * shape;
        dist = 0.01 / abs(sin(dist * warp + angle + time) / warp);
        vec3 color = palette(polar.y + shape + i + time * 0.1);
        result += color * dist * shape;
    }
    
    ALBEDO = result;
    ALPHA = 1.0;
    }
    
                
    `
    if (FFplane3.mesh.nodeID) {
        Godot.shader.applyToMesh(FFplane3.mesh.nodeID, fractalFlower3)
    }



    const FFplane4 = spawnPrimitive.plane(
        "Front",
        new Vector3(-4.0, 1.5, -1.5),
        new Vector3(3.2, 1.8, 1),
        Quaternion.one, new Color(0, 0.2, 0.5),
        1,
        "Convex",
        "Animated",
        undefined);

    const fractalFlower4 = `shader_type spatial;
        
        uniform vec2 resolution = vec2(1920.0, 1080.0);
uniform float speed: hint_range(0.0, 10.0, 0.01) = 1.0;
uniform float iterations: hint_range(0.0, 10.0, 1.0) = 1.0;
uniform float slices: hint_range(1.0, 100.0, 1.0) = 10.0;
uniform float warp: hint_range(1.0, 100.0, 0.1) = 10.0;

uniform vec3 a: source_color = vec3(0.5, 0.5, 0.5);
uniform vec3 b: source_color = vec3(0.5, 0.5, 0.5);
uniform vec3 c: source_color = vec3(1.0, 1.0, 1.0);
uniform vec3 d: source_color = vec3(0.0, 0.33, 0.67);

vec3 palette(float t) {
	return a + b * cos(TAU * (c * t + d));
}


void fragment() {
	vec2 uv = UV - 0.5;
	uv.x *= resolution.x / resolution.y;
	float time = TIME * speed;
	vec3 result = vec3(0.0);
	vec2 polar = vec2(atan(uv.x, uv.y), length(uv));
	
	for (float i = 0.0; i < iterations; i++) {
		float angle = polar.x * (slices + i);
		float shape = abs(sin(angle)) + 1.0;
		uv = fract(uv * shape) - 0.5;
		float dist = length(uv) * exp(-polar.y) * shape;
		dist = 0.01 / abs(sin(dist * warp + angle + time) / warp);
		vec3 color = palette(polar.y + shape + i + time * 0.1);
		result += color * dist * shape;
	}
	
	ALBEDO = result;
	ALPHA = 1.0;
}

                
`
    if (FFplane4.mesh.nodeID) {
        Godot.shader.applyToMesh(FFplane4.mesh.nodeID, fractalFlower4)
    }




}

