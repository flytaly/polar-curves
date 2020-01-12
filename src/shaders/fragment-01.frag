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

    float fraction = mod(polar.x + t + PI * 0.5, 2.*PI);
    float fraction4 = mod(-polar.x + t, PI*0.5);

    vec4 color = vec4(0., 0., 0., 0.);
    vec4 colorR = vec4(0.8, 0., 0., 1.);
    vec4 colorGrey = vec4(.0, .0, .0, .3);
    vec4 colorGrey2 = vec4(0.3, 0.3, 0.3, 1.);
    vec4 currentColor = colorGrey2;

    color = clamp(currentColor * sinCurve(polar, period, amplitude*0.3, u_width*1.5), 0., 1.);
    color += clamp(currentColor * sinCurve(polar, period, amplitude*0.3, u_width*1.5) - fraction4, 0., 1.);

    polar.y += 0.2;
    polar.x += t;
    color += clamp(colorR * sinCurve(polar, period, sin(t*2.)*0.04 + amplitude, u_width), 0., 1.);

    polar.y -= 0.11;
    polar.x -= t*1.5;
    color += clamp(currentColor * sinCurve(vec2(polar.x, polar.y), period, amplitude*0.9, u_width), 0., 1.);


    // color = clamp(colorG * sinCurve(polar, 10., u_amplitude*0.3, u_width*1.5) , 0., 1.);
    // gl_FragColor = vec4(vec4(0.,0.,0., 1.)*fraction4);
    gl_FragColor = vec4(color);
}
