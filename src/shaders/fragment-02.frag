#define PI 3.1415926

uniform float u_time;
uniform vec2 u_resolution;
uniform bool u_isPolar;
uniform float u_period;
uniform float u_radius;
uniform float u_amplitude;
uniform float u_width;
uniform float u_blur;

varying vec2 vUv;

float drawLine(float pos, float lineCenter, float width, float blur){
    float start = lineCenter - width * 0.5;
    float end  = lineCenter + width * 0.5;
    return smoothstep(start - blur, start, pos) - smoothstep(end, end + blur, pos);
}

float sinCurve(vec2 st, float period, float amplitude, float width) {
    float line = sin(st.x * period) * amplitude;
    return drawLine(st.y, line, width, u_blur);
}

void main()	{
    vec2 uv = (vUv -  0.5) * u_resolution.xy / min(u_resolution.x, u_resolution.y);

    vec2 polar = vec2(atan(uv.x, uv.y), length(uv));
    if (!u_isPolar) polar = uv;

    float t = mod(u_time * 0.1, 2. * PI);

    // [-P; P] => [0; 2*PI]
    polar.x += PI;
    polar.y -= u_radius;

    float amplitude = (sin(t)+2.) * 0.2 * u_amplitude;
    float period = u_period;


    gl_FragColor = vec4(1., 0., 0., 1.);
}
