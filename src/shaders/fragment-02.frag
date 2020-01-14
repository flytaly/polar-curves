#define PI 3.1415926

uniform float u_time;
uniform vec2 u_resolution;
uniform bool u_isPolar;
uniform float u_period;
uniform float u_radius;
uniform float u_amplitude;
uniform float u_width;
uniform float u_blur;
uniform float u_length;
uniform float u_repeat;

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

    float t = mod(u_time * 0.05, 2. * PI);

    polar.x -= mod(u_time * 0.05, 2. * PI);
    polar.y -= u_radius;

    // float amplitude = u_amplitude;
    float amplitude = cos(t) * 0.06 + u_amplitude;
    // float period = u_period;
    float period = u_period;
    float len = (5. - u_length);

    float fraction = mod(polar.x + t, 2. * PI / u_repeat) * len;
    float fraction2 = mod(polar.x + t + PI / 2., 2. * PI / u_repeat) * len;

    vec4 colorR = vec4(.6, 0., 0., 1.);
    vec4 colorG = vec4(0., 0.8, 0., 1.);
    vec4 colorB = vec4(0., 0., 0.6, 1.);
    vec4 colorY = vec4(.8, .8, .0, 1.);
    vec4 colorGrey = vec4(.2, .2, .2, 1.);
    vec4 colorGrey2 = vec4(0.9, 0.9, 0.9, 1.);
    vec4 color1 = colorGrey;
    vec4 color2 = colorGrey;

    vec4 color = vec4(1., 1., 1., 1.);
    color = clamp(color1 * sinCurve(polar, period, amplitude, u_width) - fraction, 0., 1.);

    polar.x += PI / period;
    color = max(color1*sinCurve(polar, period, amplitude, u_width) - fraction2, color);

    fraction = mod(t - polar.x, 2. * PI / u_repeat) * len;
    fraction2 = mod(t -polar.x - PI / 2., 2. * PI / u_repeat) * len;

    polar.x += mod(u_time * 0.1, 2. * PI);
    polar.x -= PI / period *0.5;
    color = max(color2*sinCurve(polar, period, amplitude*1.1, u_width) - fraction, color);
    polar.x -= PI / period;
    color += max(color2*sinCurve(polar, period, amplitude*1.1, u_width) - fraction2, color);


    gl_FragColor = color;
}
