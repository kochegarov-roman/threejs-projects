uniform float time;
uniform float progress;
uniform sampler2D texture1;
uniform vec4 resolution;
varying vec2 vUv;

varying float vColorRandoms;

uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;

float PI = 3.141592653589793238;
void main()	{

	float alpha = 1.- smoothstep(-0.2, 0.5, length(gl_PointCoord - vec2(0.5)));
	alpha *=0.5;

	vec3 finalColor = uColor1;
	if (vColorRandoms > 0.35 && vColorRandoms < 0.66){
		finalColor = uColor2;
	} else if (vColorRandoms > 0.66) {
		finalColor = uColor3;
	}

	float gradient = smoothstep(0.38, 0.55, vUv.y);
	gl_FragColor = vec4(finalColor, alpha * gradient);
}