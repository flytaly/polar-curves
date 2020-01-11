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

float sinCurve(vec2 st, float period, float amplitude) {
    float amp = amplitude;
    float line = sin(st.x * period) * amp;
    return drawLine(st.y, line, u_width, u_blur);
}

void main()	{
    vec2 uv = (vUv -  0.5) * u_resolution.xy / min(u_resolution.x, u_resolution.y);

    vec2 polar = vec2(atan(uv.y, uv.x), length(uv));
    if (!u_isPolar) polar = uv;
    polar.y -= u_radius;

    float t = mod(u_time * 0.3, 2. * PI);

    polar.x += t;

    float t2 = fract(u_time/20.);
    float curveLen = 0.05;


    vec4 color = vec4(0., 0., 0., 0.);
    vec4 color0 = vec4(0., 0., 0., 1.);
    vec4 color1 = vec4(1., 0., 0., 1.);
    vec4 color2 = vec4(0., 1., 0., 1.);
    vec4 color3 = vec4(0., 0., 1., 1.);
    color = color0 * sinCurve(polar, u_period, sin(t)*u_amplitude);
    // color += clamp(color0 * sinCurve(polar, u_period, cos(t)*u_amplitude), 0., 1.);
    // color += color0 * sinCurve(polar, u_period, u_amplitude*0.5);
    // color += color0 * sinCurve(vec2(polar.x, polar.y+0.09), u_period, u_amplitude*0.9);

    gl_FragColor = vec4(color);
}
