uniform float time;
uniform float progress;
uniform sampler2D uTexture1;
uniform sampler2D uTexture2;
uniform vec4 resolution;
varying vec2 vUv;
varying vec3 vPosition;
float PI = 3.141592653589793238;


vec2 mirrored(vec2 v) {
	vec2 m = mod(v, 2.);
	return mix(m, 2.0 - m, step(1.0, m));
}

float tri(float p) {
	return mix(p, 1.0 - p, step(0.5, p))*2.;
}

void main()	{

  // for easy
	// vec4 t1 = texture2D(uTexture1, vUv);
	// vec4 t2 = texture2D(uTexture2, vUv);
	// float sweep = step(vUv.y, progress);
	// vec4 finalTexture = mix(t1, t2, sweep);

  // gl_FragColor = finalTexture;

  // for other
	float p = progress;
	vec2 vUv1 = vUv;

	float delayValue = p*7. - vUv.y*2.0 + vUv.x - 2.;
	delayValue = clamp(delayValue, 0., 1.);

	float accel = 0.1;

	vec2 translateValue = vec2(p) + delayValue*accel;
	vec2 translateValue1 = vec2(-0.5, 1.)*translateValue;
	vec2 translateValue2 = vec2(-0.5, 1.)*(translateValue - 1. - accel);

	vec2 w = sin(sin(time)*vec2(0, 0.3) + vUv.yx*vec2(0,4.))*vec2(0, 0.5);
	vec2 xy = w*(tri(p)*0.5 + tri(delayValue)*0.5);

	vec2 uv1 = vUv1 + translateValue1 + xy;
	vec2 uv2 = vUv1 + translateValue2 + xy;

	vec4 rgba1 = texture2D(uTexture1, mirrored(uv1));
	vec4 rgba2 = texture2D(uTexture2, mirrored(uv2));

	vec4 rgba = mix(rgba1, rgba2, delayValue);
	gl_FragColor = rgba;
}