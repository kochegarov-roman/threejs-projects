uniform float time;
uniform float progress;
uniform sampler2D uNormals;
uniform vec4 resolution;
varying vec2 vUv;
varying vec3 vPosition;

uniform float alphaFactor;

float PI = 3.141592653589793238;

void main()	{
	vec3 color = vec3(0.136, 0.559, 0.832);

	vec2 st = gl_PointCoord.xy;
	float disc = length(st - vec2(0.5));
	float alpha = smoothstep(0.5, 0.48, disc);

	vec4 normalTexture = texture2D(uNormals, st);

	vec3 normal = vec3(normalTexture.rg * 10.0 - 1.0, 0.0); // change after *
	normal.z = sqrt( 1.0 - normal.x * normal.x - normal.y * normal.y);

	normal = normalize(normal);

	vec3 lightPos = vec3(1., 1., 1.);
	float diffuse = max( 0., dot(normal, normalize(lightPos)));

//	vec3 color1 = vec3(0.579, 0.903, 0.983);
	vec3 color1 = vec3(247. / 255., 179. / 255., 119. / 255.);
//	vec3 color1 = vec3(3. / 255., 90. / 255., 197. / 255.);

	gl_FragColor = vec4(color1, alpha*diffuse*alphaFactor);
}