uniform float time;
uniform float progress;
uniform vec4 resolution;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewPosition;
uniform sampler2D uMatcap;
float PI = 3.141592653589793238;

void main()	{
	vec3 normal = normalize(vNormal);
	vec3 viewDir = normalize(vViewPosition);
	vec3 x = normalize(vec3(viewDir.z, 0.0, - viewDir.x));
	vec3 y = cross(viewDir, x);

	vec2 uv = vec2(dot(x, normal), dot(y, normal)) * 0.6 + 0.7;
	vec4 matcapColor = texture2D(uMatcap, uv);

	gl_FragColor = vec4(vUv, 0.0, 1.);
	gl_FragColor = vec4(vNormal, 1.);
	gl_FragColor = matcapColor;
}