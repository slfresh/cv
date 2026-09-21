/*
 * Gargantua – real-time black hole as a raw WebGL1 fragment shader
 * (ray bending, accretion disc, orbiting planets, nebulae). No libraries.
 *
 * This experiment used to run behind the CV pages. It now lives on its own page so the
 * CV stays calm and readable. Guards on this page:
 *   - prefers-reduced-motion  -> one static frame, animation only after pressing Start
 *   - phones / touch devices  -> starts paused, device-pixel-ratio 1, fewer ray steps
 *   - hidden tab              -> animation pauses, resumes when the tab is visible again
 *   - lost WebGL context      -> handled, re-initialised when the context comes back
 *   - no WebGL                -> CSS poster + message instead of a blank canvas
 */
(function () {
  'use strict';

  var canvas = document.getElementById('lab-canvas');
  if (!canvas) return;

  var stage = document.getElementById('lab-stage');
  var startBtn = document.getElementById('lab-toggle');
  var statusEl = document.getElementById('lab-status');
  var swallowInput = document.getElementById('lab-swallow');
  var journeyInput = document.getElementById('lab-journey');

  var lang = (document.documentElement.getAttribute('lang') || 'de').toLowerCase().indexOf('en') === 0 ? 'en' : 'de';
  var TEXT = {
    de: { start: 'Animation starten', pause: 'Animation pausieren', paused: 'Pausiert', running: 'Läuft',
          reduced: 'Reduzierte Bewegung ist aktiv – es wird ein Standbild gezeigt. Die Animation startet erst auf Knopfdruck.',
          lowPower: 'Auf Mobilgeräten startet die Animation pausiert, um Akku zu sparen.',
          noWebgl: 'Dieser Browser unterstützt kein WebGL – hier wird nur ein Standbild gezeigt.',
          lost: 'Der Grafikkontext ging verloren – wird neu aufgebaut …' },
    en: { start: 'Start animation', pause: 'Pause animation', paused: 'Paused', running: 'Running',
          reduced: 'Reduced motion is on – showing a still frame. The animation only starts when you press the button.',
          lowPower: 'On mobile devices the animation starts paused to save battery.',
          noWebgl: 'This browser does not support WebGL – showing a still image instead.',
          lost: 'The graphics context was lost – rebuilding …' }
  }[lang];

  var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var lowPower = window.matchMedia && window.matchMedia('(max-width: 767px), (pointer: coarse)').matches;
  var MAX_STEPS = lowPower ? 40 : 64;
  var DPR_CAP = lowPower ? 1 : 1.5;

  function setStatus(msg) { if (statusEl) statusEl.textContent = msg || ''; }

  function showPoster(msg) {
    if (stage) stage.classList.add('lab-no-webgl');
    if (startBtn) startBtn.hidden = true;
    setStatus(msg);
  }

  var gl = null;
  try {
    var ctxOptions = { antialias: false, alpha: false, powerPreference: 'low-power' };
    gl = canvas.getContext('webgl', ctxOptions) || canvas.getContext('experimental-webgl', ctxOptions);
  } catch (e) { gl = null; }
  if (!gl) { showPoster(TEXT.noWebgl); return; }

  // Simple full-screen quad vertex shader
  var vsSource = [
    'attribute vec2 position;',
    'void main() {',
    '  gl_Position = vec4(position, 0.0, 1.0);',
    '}'
  ].join('\n');

  // Relativistic Raymarching GLSL Fragment Shader
  var fsSource = [
    'precision highp float;',
    'uniform float u_time;',
    'uniform vec2 u_resolution;',
    'uniform vec2 u_mouse;',
    'uniform float u_swallow;',
    'uniform vec2 u_bh_center;',
    'uniform float u_scroll;',
    
    'float hash(vec2 p) {',
    '  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);',
    '}',
    
    'float noise(vec2 p) {',
    '  vec2 i = floor(p);',
    '  vec2 f = fract(p);',
    '  vec2 u = f * f * (3.0 - 2.0 * f);',
    '  return mix(mix(hash(i + vec2(0.0,0.0)), hash(i + vec2(1.0,0.0)), u.x),',
    '             mix(hash(i + vec2(0.0,1.0)), hash(i + vec2(1.0,1.0)), u.x), u.y);',
    '}',
    
    'float fbm(vec2 p) {',
    '  float v = 0.0;',
    '  float a = 0.5;',
    '  vec2 shift = vec2(100.0);',
    '  mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));',
    '  for (int i = 0; i < 4; ++i) {',
    '    v += a * noise(p);',
    '    p = rot * p * 2.0 + shift;',
    '    a *= 0.5;',
    '  }',
    '  return v;',
    '}',
    
    'float getStar(vec3 d) {',
    '  vec3 p = d * 260.0;',
    '  float n = noise(p.xy * 1.6) * noise(p.yz * 1.6);',
    '  n = pow(n, 7.8);',
    '  return n * 1.9;',
    '}',
    
    'vec3 getNebula(vec2 uv, float time, float swallow) {',
    '  vec3 color = vec3(0.0);',
    '  // Nebula 1: Bottom-Left (Cyan/Teal with Orange Core)',
    '  vec2 p1 = vec2(-0.45, -0.25) + vec2(cos(time * 0.05), sin(time * 0.05)) * 0.06;',
    '  float d1 = length(uv - p1);',
    '  color += vec3(0.02, 0.12, 0.22) * exp(-d1 * 2.8) * (1.0 - swallow * 0.75);',
    '  color += vec3(0.25, 0.12, 0.02) * exp(-d1 * 8.0) * (1.0 - swallow * 0.75);',
    '  // Nebula 2: Top-Right (Teal/Cyan with Amber Core)',
    '  vec2 p2 = vec2(0.45, 0.18) + vec2(cos(time * 0.04 + 1.0), sin(time * 0.04 + 1.0)) * 0.05;',
    '  float d2 = length(uv - p2);',
    '  color += vec3(0.0, 0.18, 0.24) * exp(-d2 * 2.4) * (1.0 - swallow * 0.75);',
    '  color += vec3(0.24, 0.16, 0.04) * exp(-d2 * 6.5) * (1.0 - swallow * 0.75);',
    '  // Nebula 3: Mid-Bottom (Crimson/Magenta)',
    '  vec2 p3 = vec2(-0.1, -0.48) + vec2(cos(time * 0.065 + 3.0), sin(time * 0.065 + 3.0)) * 0.07;',
    '  float d3 = length(uv - p3);',
    '  color += vec3(0.16, 0.02, 0.12) * exp(-d3 * 3.2) * (1.0 - swallow * 0.75);',
    '  color += vec3(0.25, 0.08, 0.02) * exp(-d3 * 7.5) * (1.0 - swallow * 0.75);',
    '  return color;',
    '}',
    
    'void main() {',
    '  vec2 bh_pixel = vec2(u_bh_center.x, u_resolution.y - u_bh_center.y);',
    '  vec2 uv = (gl_FragCoord.xy - bh_pixel) / u_resolution.y;',
    '  float R_min = 0.035;',
    '  float R_max = 0.22;',
    '  float R_bh = R_min + (R_max - R_min) * u_swallow;',
    '  float yaw = u_mouse.x * 0.4;',
    '  float pitch = u_mouse.y * 0.3 + 0.3;',
'  float cam_dist = 1.0 - u_swallow * 0.25;',
    '  vec3 cam_pos = vec3(sin(yaw) * cos(pitch), sin(pitch), -cos(yaw) * cos(pitch)) * cam_dist;',
    '  vec3 target = vec3(0.0, 0.0, 0.0);',
    '  vec3 forward = normalize(target - cam_pos);',
    '  vec3 right = normalize(cross(forward, vec3(0.0, 1.0, 0.0)));',
    '  vec3 up = cross(right, forward);',
    '  float R_mars = 0.0065;',
    '  float R_earth = 0.012;',
    '  float R_saturn = 0.020;',
    '  float R_sun = 0.040;',
    '  float a_mars = u_time * 0.55;',
    '  vec3 mars_pos = vec3(cos(a_mars) * 0.20, sin(a_mars) * 0.04, sin(a_mars) * 0.19);',
    '  float a_earth = u_time * 0.38 + 1.5;',
    '  vec3 earth_pos = vec3(cos(a_earth) * 0.32, sin(a_earth) * -0.06, sin(a_earth) * 0.31);',
    '  float a_saturn = u_time * 0.20 + 3.2;',
    '  vec3 saturn_pos = vec3(cos(a_saturn) * 0.45, sin(a_saturn) * 0.08, sin(a_saturn) * 0.44);',
    '  vec3 ring_normal = normalize(vec3(0.15, 0.98, 0.12));',
    '  float a_sun = u_time * 0.12 + 4.5;',
    '  vec3 sun_orbit_pos = vec3(cos(a_sun) * 0.65, sin(a_sun) * -0.12, sin(a_sun) * 0.63);',
    '  float sun_transition = smoothstep(0.0, 0.4, u_scroll);',
    '  vec3 sun_pos = mix(cam_pos * 0.35, sun_orbit_pos, sun_transition);',
    '  float fov = 1.15;',
    '  vec3 rd = normalize(forward + uv.x * right * fov + uv.y * up * fov);',
    '  vec3 ro = cam_pos;',
    '  vec3 p = ro;',
    '  vec3 d = rd;',
    '  vec4 color_acc = vec4(0.0);',
    '  float opacity_acc = 0.0;',
    '  float dt = 0.025;',
    '  const int MAX_STEPS = 64;',
    '  float disk_in = R_bh * 1.5;',
    '  float disk_out = R_bh * 4.8;',
    '  float G = 0.038 * (R_bh / R_max);',
    '  vec3 prev_p = p;',
    '  bool hit_hole = false;',
    '  for (int i = 0; i < MAX_STEPS; i++) {',
    '    prev_p = p;',
    '    p += d * dt;',
    '    float dist = length(p);',
    '    vec3 to_center = -p;',
    '    vec3 force = normalize(to_center) * (G / (dist * dist * dist));',
    '    d = normalize(d + force * dt);',
    '    if (dist < R_bh) {',
    '      hit_hole = true;',
    '      break;',
    '    }',
    '    // Relativistic intersections with Sun and planets',
    '    vec3 seg_v = p - prev_p;',
    '    float seg_len = length(seg_v);',
    '    vec3 seg_u = seg_v / seg_len;',
    '    // 1. Sun',
    '    vec3 w_sun = sun_pos - prev_p;',
    '    float t_sun = clamp(dot(w_sun, seg_u), 0.0, seg_len);',
    '    vec3 close_sun = prev_p + seg_u * t_sun;',
    '    float dist_sun = length(close_sun - sun_pos);',
    '    if (dist_sun < R_sun) {',
    '      vec3 hit_p = close_sun;',
    '      vec3 N = normalize(hit_p - sun_pos);',
    '      float solar_noise = fbm(N.xy * 12.0 + vec2(u_time * 0.9, N.z * 6.0 - u_time * 0.4));',
    '      solar_noise += fbm(N.zy * 24.0 - u_time * 1.5) * 0.35;',
    '      solar_noise = smoothstep(0.15, 0.85, solar_noise);',
    '      vec3 sun_color = mix(vec3(1.0, 0.42, 0.02), vec3(1.0, 0.96, 0.78), solar_noise);',
    '      float edge_fresnel = 1.0 - max(0.0, dot(N, -seg_u));',
    '      float polar_angle = atan(N.y, N.x);',
    '      float flare_noise = noise(vec2(polar_angle * 6.0 - u_time * 3.5, u_time * 1.8));',
    '      float limb_flares = smoothstep(0.4, 0.85, flare_noise) * pow(edge_fresnel, 2.5);',
    '      sun_color += vec3(1.0, 0.30, 0.01) * limb_flares * 3.8;',
    '      float corona = pow(edge_fresnel, 4.0);',
    '      sun_color += vec3(1.0, 0.35, 0.05) * corona * 2.5;',
    '      color_acc.rgb += sun_color * (1.0 - opacity_acc);',
    '      opacity_acc = 1.0;',
    '      break;',
    '    } else if (dist_sun < R_sun * 1.6) {',
    '      float corona_glow = (1.0 - (dist_sun - R_sun) / (R_sun * 0.6));',
    '      vec3 N_glow = normalize(close_sun - sun_pos);',
    '      float polar_angle = atan(N_glow.y, N_glow.x);',
    '      float flare_filament = noise(vec2(polar_angle * 8.0 - u_time * 4.2, (dist_sun - R_sun) * 20.0));',
    '      float corona_pattern = pow(corona_glow, 2.8) * (0.6 + 0.4 * flare_filament);',
    '      color_acc.rgb += vec3(1.0, 0.35, 0.04) * corona_pattern * 0.22 * (1.0 - opacity_acc);',
    '    }',
    '    // 2. Earth',
    '    vec3 w_earth = earth_pos - prev_p;',
    '    float t_earth = clamp(dot(w_earth, seg_u), 0.0, seg_len);',
    '    vec3 close_earth = prev_p + seg_u * t_earth;',
    '    float dist_earth = length(close_earth - earth_pos);',
    '    float env_earth = R_earth * 1.15;',
    '    if (dist_earth < env_earth) {',
    '      vec3 L_sun = normalize(sun_pos - earth_pos);',
    '      float scatter_factor = pow(max(0.0, dot(L_sun, -seg_u)), 2.0);',
    '      float limb = (env_earth - dist_earth) / (env_earth - R_earth);',
    '      limb = clamp(limb, 0.0, 1.0);',
    '      float glow_int = pow(limb, 3.0) * (0.2 + 0.8 * scatter_factor);',
    '      vec3 glow_color = vec3(0.25, 0.55, 1.0) * glow_int * 1.8;',
    '      if (dist_earth < R_earth) {',
    '        vec3 hit_p = close_earth;',
    '        vec3 N = normalize(hit_p - earth_pos);',
    '        float angle_rot = u_time * 0.15;',
    '        vec3 N_rot = vec3(N.x * cos(angle_rot) - N.z * sin(angle_rot), N.y, N.x * sin(angle_rot) + N.z * cos(angle_rot));',
    '        vec3 tangent = normalize(cross(N, abs(N.y) > 0.99 ? vec3(0.0, 0.0, 1.0) : vec3(0.0, 1.0, 0.0)));',
    '        vec3 bitangent = cross(N, tangent);',
    '        vec3 T_rot = vec3(tangent.x * cos(angle_rot) - tangent.z * sin(angle_rot), tangent.y, tangent.x * sin(angle_rot) + tangent.z * cos(angle_rot));',
    '        vec3 B_rot = vec3(bitangent.x * cos(angle_rot) - bitangent.z * sin(angle_rot), bitangent.y, bitangent.x * sin(angle_rot) + bitangent.z * cos(angle_rot));',
    '        float eps = 0.025;',
    '        float h_c = fbm(N_rot.xy * 6.0 + vec2(N_rot.z * 3.0));',
    '        vec3 n_r_t = N_rot + T_rot * eps;',
    '        float h_t = fbm(n_r_t.xy * 6.0 + vec2(n_r_t.z * 3.0));',
    '        vec3 n_r_b = N_rot + B_rot * eps;',
    '        float h_b = fbm(n_r_b.xy * 6.0 + vec2(n_r_b.z * 3.0));',
    '        vec3 N_bumped = normalize(N - (tangent * (h_t - h_c) + bitangent * (h_b - h_c)) * 0.08);',
    '        vec3 earth_surf = mix(vec3(0.04, 0.16, 0.44), vec3(0.10, 0.30, 0.12), smoothstep(0.48, 0.52, h_c));',
    '        if (h_c > 0.52) {',
    '          earth_surf = mix(earth_surf, vec3(0.30, 0.24, 0.15), smoothstep(0.52, 0.65, h_c));',
    '        }',
    '        float cloud_rot = u_time * 0.20;',
    '        vec3 N_cloud = vec3(N.x * cos(cloud_rot) - N.z * sin(cloud_rot), N.y, N.x * sin(cloud_rot) + N.z * cos(cloud_rot));',
    '        float clouds = fbm(N_cloud.xy * 8.0 + vec2(N_cloud.z * 4.0));',
    '        clouds = smoothstep(0.45, 0.65, clouds);',
    '        earth_surf = mix(earth_surf, vec3(0.88, 0.88, 0.92), clouds * 0.75);',
    '        vec3 V = -seg_u;',
    '        vec3 H = normalize(L_sun + V);',
    '        float is_ocean = 1.0 - smoothstep(0.46, 0.50, h_c);',
    '        is_ocean *= (1.0 - clouds);',
    '        float spec_ocean = pow(max(0.0, dot(N_bumped, H)), 96.0) * 1.5;',
    '        float spec_land = pow(max(0.0, dot(N_bumped, H)), 10.0) * 0.15;',
    '        float spec = mix(spec_land, spec_ocean, is_ocean);',
    '        vec3 L_disk = normalize(-earth_pos);',
    '        vec3 col_disk = vec3(1.0, 0.75, 0.4) * 1.5;',
    '        vec3 col_sun = vec3(1.0, 0.95, 0.85) * 1.8;',
    '        float diff_disk = max(0.0, dot(N_bumped, L_disk));',
    '        float diff_sun = max(0.0, dot(N_bumped, L_sun));',
    '        vec3 lighting = col_disk * diff_disk + col_sun * (diff_sun + spec);',
    '        lighting = max(lighting, vec3(0.03));',
    '        vec3 final_surf = earth_surf * lighting;',
    '        final_surf += glow_color * 0.5;',
    '        color_acc.rgb += final_surf * (1.0 - opacity_acc);',
    '        opacity_acc = 1.0;',
    '        break;',
    '      } else {',
    '        float envelope_opacity = glow_int * 0.65;',
    '        color_acc.rgb += glow_color * (1.0 - opacity_acc);',
    '        opacity_acc += envelope_opacity * (1.0 - opacity_acc);',
    '      }',
    '    }',
    '    // 3. Mars',
    '    vec3 w_mars = mars_pos - prev_p;',
    '    float t_mars = clamp(dot(w_mars, seg_u), 0.0, seg_len);',
    '    vec3 close_mars = prev_p + seg_u * t_mars;',
    '    float dist_mars = length(close_mars - mars_pos);',
    '    float env_mars = R_mars * 1.15;',
    '    if (dist_mars < env_mars) {',
    '      vec3 L_sun = normalize(sun_pos - mars_pos);',
    '      float scatter_factor = pow(max(0.0, dot(L_sun, -seg_u)), 2.0);',
    '      float limb = (env_mars - dist_mars) / (env_mars - R_mars);',
    '      limb = clamp(limb, 0.0, 1.0);',
    '      float glow_int = pow(limb, 3.0) * (0.2 + 0.8 * scatter_factor);',
    '      vec3 glow_color = vec3(0.85, 0.32, 0.12) * glow_int * 1.4;',
    '      if (dist_mars < R_mars) {',
    '        vec3 hit_p = close_mars;',
    '        vec3 N = normalize(hit_p - mars_pos);',
    '        float angle_rot_mars = u_time * 0.22;',
    '        vec3 N_rot = vec3(N.x * cos(angle_rot_mars) - N.z * sin(angle_rot_mars), N.y, N.x * sin(angle_rot_mars) + N.z * cos(angle_rot_mars));',
    '        vec3 tangent = normalize(cross(N, abs(N.y) > 0.99 ? vec3(0.0, 0.0, 1.0) : vec3(0.0, 1.0, 0.0)));',
    '        vec3 bitangent = cross(N, tangent);',
    '        vec3 T_rot = vec3(tangent.x * cos(angle_rot_mars) - tangent.z * sin(angle_rot_mars), tangent.y, tangent.x * sin(angle_rot_mars) + tangent.z * cos(angle_rot_mars));',
    '        vec3 B_rot = vec3(bitangent.x * cos(angle_rot_mars) - bitangent.z * sin(angle_rot_mars), bitangent.y, bitangent.x * sin(angle_rot_mars) + bitangent.z * cos(angle_rot_mars));',
    '        float eps = 0.02;',
    '        float h_c = fbm(N_rot.xy * 8.0 + vec2(N_rot.z * 4.0));',
    '        vec3 n_r_t = N_rot + T_rot * eps;',
    '        float h_t = fbm(n_r_t.xy * 8.0 + vec2(n_r_t.z * 4.0));',
    '        vec3 n_r_b = N_rot + B_rot * eps;',
    '        float h_b = fbm(n_r_b.xy * 8.0 + vec2(n_r_b.z * 4.0));',
    '        vec3 N_bumped = normalize(N - (tangent * (h_t - h_c) + bitangent * (h_b - h_c)) * 0.15);',
    '        vec3 mars_surf = mix(vec3(0.68, 0.26, 0.10), vec3(0.44, 0.14, 0.05), h_c);',
    '        float polar_cap = smoothstep(0.85, 0.92, N.y);',
    '        mars_surf = mix(mars_surf, vec3(0.95, 0.95, 0.98), polar_cap);',
    '        vec3 V = -seg_u;',
    '        vec3 H = normalize(L_sun + V);',
    '        float spec = pow(max(0.0, dot(N_bumped, H)), 14.0) * 0.2;',
    '        vec3 L_disk = normalize(-mars_pos);',
    '        vec3 col_disk = vec3(1.0, 0.75, 0.4) * 1.5;',
    '        vec3 col_sun = vec3(1.0, 0.95, 0.85) * 1.8;',
    '        float diff_disk = max(0.0, dot(N_bumped, L_disk));',
    '        float diff_sun = max(0.0, dot(N_bumped, L_sun));',
    '        vec3 lighting = col_disk * diff_disk + col_sun * (diff_sun + spec);',
    '        lighting = max(lighting, vec3(0.03));',
    '        vec3 final_surf = mars_surf * lighting;',
    '        final_surf += glow_color * 0.4;',
    '        color_acc.rgb += final_surf * (1.0 - opacity_acc);',
    '        opacity_acc = 1.0;',
    '        break;',
    '      } else {',
    '        float envelope_opacity = glow_int * 0.5;',
    '        color_acc.rgb += glow_color * (1.0 - opacity_acc);',
    '        opacity_acc += envelope_opacity * (1.0 - opacity_acc);',
    '      }',
    '    }',
    '    // 4. Saturn',
    '    vec3 w_sat = saturn_pos - prev_p;',
    '    float t_sat = clamp(dot(w_sat, seg_u), 0.0, seg_len);',
    '    vec3 close_sat = prev_p + seg_u * t_sat;',
    '    float dist_sat = length(close_sat - saturn_pos);',
    '    float env_sat = R_saturn * 1.08;',
    '    if (dist_sat < env_sat) {',
    '      vec3 L_sun = normalize(sun_pos - saturn_pos);',
    '      float scatter_factor = pow(max(0.0, dot(L_sun, -seg_u)), 2.0);',
    '      float limb = (env_sat - dist_sat) / (env_sat - R_saturn);',
    '      limb = clamp(limb, 0.0, 1.0);',
    '      float glow_int = pow(limb, 3.0) * (0.2 + 0.8 * scatter_factor);',
    '      vec3 glow_color = vec3(0.85, 0.72, 0.52) * glow_int * 1.2;',
    '      if (dist_sat < R_saturn) {',
    '        vec3 hit_p = close_sat;',
    '        vec3 N = normalize(hit_p - saturn_pos);',
    '        float angle_rot_saturn = u_time * 0.08;',
    '        vec3 N_rot = vec3(N.x * cos(angle_rot_saturn) - N.z * sin(angle_rot_saturn), N.y, N.x * sin(angle_rot_saturn) + N.z * cos(angle_rot_saturn));',
    '        vec3 tangent = normalize(cross(N, abs(N.y) > 0.99 ? vec3(0.0, 0.0, 1.0) : vec3(0.0, 1.0, 0.0)));',
    '        vec3 bitangent = cross(N, tangent);',
    '        vec3 T_rot = vec3(tangent.x * cos(angle_rot_saturn) - tangent.z * sin(angle_rot_saturn), tangent.y, tangent.x * sin(angle_rot_saturn) + tangent.z * cos(angle_rot_saturn));',
    '        vec3 B_rot = vec3(bitangent.x * cos(angle_rot_saturn) - bitangent.z * sin(angle_rot_saturn), bitangent.y, bitangent.x * sin(angle_rot_saturn) + bitangent.z * cos(angle_rot_saturn));',
    '        float eps = 0.025;',
    '        float h_c = sin(N_rot.y * 32.0) * 0.5 + 0.5 + fbm(vec2(N_rot.y * 10.0, N_rot.x * 2.0)) * 0.35;',
    '        vec3 n_r_t = N_rot + T_rot * eps;',
    '        float h_t = sin(n_r_t.y * 32.0) * 0.5 + 0.5 + fbm(vec2(n_r_t.y * 10.0, n_r_t.x * 2.0)) * 0.35;',
    '        vec3 n_r_b = N_rot + B_rot * eps;',
    '        float h_b = sin(n_r_b.y * 32.0) * 0.5 + 0.5 + fbm(vec2(n_r_b.y * 10.0, n_r_b.x * 2.0)) * 0.35;',
    '        vec3 N_bumped = normalize(N - (tangent * (h_t - h_c) + bitangent * (h_b - h_c)) * 0.04);',
    '        vec3 saturn_surf = mix(vec3(0.60, 0.48, 0.32), vec3(0.82, 0.68, 0.44), h_c);',
    '        float shadow_t = -dot(hit_p - saturn_pos, ring_normal) / dot(L_sun, ring_normal);',
    '        float sun_shadow = 1.0;',
    '        if (shadow_t > 0.001) {',
    '          vec3 shadow_intersect = hit_p + L_sun * shadow_t;',
    '          float shadow_dist = length(shadow_intersect - saturn_pos);',
    '          if (shadow_dist > R_saturn * 1.4 && shadow_dist < R_saturn * 3.0) {',
    '            float ring_norm = (shadow_dist - R_saturn * 1.4) / (R_saturn * 1.6);',
    '            float ring_pattern = sin(ring_norm * 45.0) * 0.5 + 0.5;',
    '            sun_shadow = 0.25 * (1.0 - ring_pattern);',
    '          }',
    '        }',
    '        vec3 V = -seg_u;',
    '        vec3 H = normalize(L_sun + V);',
    '        float spec = pow(max(0.0, dot(N_bumped, H)), 18.0) * 0.25;',
    '        vec3 L_disk = normalize(-saturn_pos);',
    '        vec3 col_disk = vec3(1.0, 0.75, 0.4) * 1.5;',
    '        vec3 col_sun = vec3(1.0, 0.95, 0.85) * 1.8;',
    '        float diff_disk = max(0.0, dot(N_bumped, L_disk));',
    '        float diff_sun = max(0.0, dot(N_bumped, L_sun)) * sun_shadow;',
    '        vec3 lighting = col_disk * diff_disk + col_sun * (diff_sun + spec);',
    '        lighting = max(lighting, vec3(0.03));',
    '        vec3 final_surf = saturn_surf * lighting;',
    '        final_surf += glow_color * 0.35;',
    '        color_acc.rgb += final_surf * (1.0 - opacity_acc);',
    '        opacity_acc = 1.0;',
    '        break;',
    '      } else {',
    '        float envelope_opacity = glow_int * 0.4;',
    '        color_acc.rgb += glow_color * (1.0 - opacity_acc);',
    '        opacity_acc += envelope_opacity * (1.0 - opacity_acc);',
    '      }',
    '    }',
    '    // 5. Saturn Rings',
    '    float d_prev_sat = dot(prev_p - saturn_pos, ring_normal);',
    '    float d_curr_sat = dot(p - saturn_pos, ring_normal);',
    '    if (d_prev_sat * d_curr_sat < 0.0) {',
    '      float t = -d_prev_sat / (d_curr_sat - d_prev_sat);',
    '      vec3 intersect = mix(prev_p, p, t);',
    '      float dist_from_saturn = length(intersect - saturn_pos);',
    '      float ring_inner = R_saturn * 1.4;',
    '      float ring_outer = R_saturn * 3.0;',
    '      if (dist_from_saturn > ring_inner && dist_from_saturn < ring_outer) {',
    '        float ring_norm = (dist_from_saturn - ring_inner) / (ring_outer - ring_inner);',
    '        float ring_pattern = sin(ring_norm * 45.0) * 0.5 + 0.5;',
    '        ring_pattern += noise(vec2(ring_norm * 120.0, 0.0)) * 0.45;',
    '        ring_pattern = clamp(ring_pattern, 0.0, 1.0);',
    '        vec3 ring_color = mix(vec3(0.50, 0.40, 0.28), vec3(0.80, 0.72, 0.60), ring_pattern);',
    '        float ring_opacity = (0.15 + 0.50 * ring_pattern) * (1.0 - smoothstep(0.9, 1.0, ring_norm)) * smoothstep(0.0, 0.1, ring_norm);',
    '        vec3 L_sun = normalize(sun_pos - intersect);',
    '        float planet_shadow = 1.0;',
    '        float t_closest = dot(saturn_pos - intersect, L_sun);',
    '        if (t_closest > 0.001) {',
    '          vec3 p_closest = intersect + L_sun * t_closest;',
    '          if (length(p_closest - saturn_pos) < R_saturn) {',
    '            planet_shadow = 0.0;',
    '          }',
    '        }',
    '        vec3 L_disk = normalize(-saturn_pos);',
    '        vec3 col_disk = vec3(1.0, 0.75, 0.4) * 1.5;',
    '        vec3 col_sun = vec3(1.0, 0.95, 0.85) * 1.8;',
    '        float diff_disk = abs(dot(ring_normal, L_disk));',
    '        float diff_sun = abs(dot(ring_normal, L_sun)) * planet_shadow;',
    '        vec3 ring_light = col_disk * diff_disk + col_sun * diff_sun;',
    '        ring_light = max(ring_light, vec3(0.05));',
    '        vec3 final_ring = ring_color * ring_light;',
    '        color_acc.rgb += final_ring * ring_opacity * (1.0 - opacity_acc);',
    '        opacity_acc += ring_opacity * (1.0 - opacity_acc);',
    '      }',
    '    }',
    '    if (prev_p.y * p.y < 0.0) {',
    '      float t = -prev_p.y / (p.y - prev_p.y);',
    '      vec3 intersect = mix(prev_p, p, t);',
    '      float d_center = length(intersect.xz);',
    '      if (d_center > disk_in && d_center < disk_out) {',
    '        float dist_norm = (d_center - disk_in) / (disk_out - disk_in);',
    '        float density = smoothstep(0.0, 0.15, dist_norm) * (1.0 - smoothstep(0.15, 1.0, dist_norm));',
    '        float angle = atan(intersect.z, intersect.x);',
    '        float speed = 1.8 * sqrt(1.0 / d_center);',
    '        float noise_val = fbm(vec2(d_center * 15.0 - u_time * 2.2, angle * 5.0 + u_time * speed));',
    '        density *= 0.35 + 0.65 * noise_val;',
    '        float spark_noise = noise(vec2(d_center * 35.0 - u_time * 6.2, angle * 12.0 + u_time * 10.0));',
    '        if (spark_noise > 0.82 && u_swallow > 0.5) {',
    '          density += (spark_noise - 0.82) * 1.8 * u_swallow;',
    '        }',
    '        vec3 disk_color = vec3(0.0);',
    '        if (dist_norm < 0.25) {',
    '          disk_color = mix(vec3(1.0, 1.0, 1.0), vec3(1.0, 0.88, 0.55), dist_norm / 0.25);',
    '        } else if (dist_norm < 0.65) {',
    '          disk_color = mix(vec3(1.0, 0.88, 0.55), vec3(0.95, 0.45, 0.08), (dist_norm - 0.25) / 0.40);',
    '        } else {',
    '          disk_color = mix(vec3(0.95, 0.45, 0.08), vec3(0.65, 0.12, 0.04), (dist_norm - 0.65) / 0.35);',
    '        }',
    '        float opacity = density * 0.45;',
    '        color_acc.rgb += disk_color * opacity * (1.0 - opacity_acc);',
    '        opacity_acc += opacity * (1.0 - opacity_acc);',
    '        if (opacity_acc >= 0.98) {',
    '          break;',
    '        }',
    '      }',
    '    }',
    '  }',
    '  vec3 final_color = vec3(0.0);',
    '  if (hit_hole) {',
    '    final_color = color_acc.rgb;',
    '  } else {',
    '    float star_brightness = getStar(d);',
    '    vec3 star_color = vec3(star_brightness) * (1.0 - u_swallow * 0.75);',
    '    final_color = color_acc.rgb + star_color * (1.0 - opacity_acc);',
    '  }',
    '  float dist_from_center = length(uv);',
    '  float photon_sphere = smoothstep(R_bh * 1.015, R_bh * 0.995, dist_from_center) * smoothstep(R_bh * 0.975, R_bh * 0.995, dist_from_center);',
    '  final_color += vec3(1.0, 0.92, 0.75) * photon_sphere * 0.45;',
    '  vec3 nebula_color = getNebula(d.xy, u_time, u_swallow);',
    '  final_color = mix(final_color, max(final_color, nebula_color), 1.0 - opacity_acc);',
    '  gl_FragColor = vec4(final_color, 1.0);',
    '}'
  ].join('\n');

  // Ray-march step count is a compile-time constant in GLSL ES 1.0 – pick it per device.
  fsSource = fsSource.replace('const int MAX_STEPS = 64;', 'const int MAX_STEPS = ' + MAX_STEPS + ';');

  var program = null;
  var loc = {};

  function compileShader(source, type) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader compile error:', gl.getShaderInfoLog(shader));
      return null;
    }
    return shader;
  }

  function initGL() {
    var vs = compileShader(vsSource, gl.VERTEX_SHADER);
    var fs = compileShader(fsSource, gl.FRAGMENT_SHADER);
    if (!vs || !fs) return false;

    program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      return false;
    }

    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);

    var positionLoc = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    loc.time = gl.getUniformLocation(program, 'u_time');
    loc.res = gl.getUniformLocation(program, 'u_resolution');
    loc.mouse = gl.getUniformLocation(program, 'u_mouse');
    loc.swallow = gl.getUniformLocation(program, 'u_swallow');
    loc.center = gl.getUniformLocation(program, 'u_bh_center');
    loc.scroll = gl.getUniformLocation(program, 'u_scroll');
    canvas.width = 0; // force a viewport update on the next draw
    return true;
  }

  if (!initGL()) { showPoster(TEXT.noWebgl); return; }

  // Pointer steering (eased), relative to the canvas – never to the whole page.
  var pointer = { x: 0.5, y: 0.5 };
  var eased = { x: 0.5, y: 0.5 };
  canvas.addEventListener('pointermove', function (e) {
    var r = canvas.getBoundingClientRect();
    if (!r.width || !r.height) return;
    pointer.x = (e.clientX - r.left) / r.width;
    pointer.y = (e.clientY - r.top) / r.height;
  });
  canvas.addEventListener('pointerleave', function () { pointer.x = 0.5; pointer.y = 0.5; });

  function syncSize() {
    var dpr = Math.min(DPR_CAP, window.devicePixelRatio || 1);
    var w = Math.max(1, Math.floor(canvas.clientWidth * dpr));
    var h = Math.max(1, Math.floor(canvas.clientHeight * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    }
  }

  function draw(seconds) {
    syncSize();
    eased.x += (pointer.x - eased.x) * 0.08;
    eased.y += (pointer.y - eased.y) * 0.08;

    gl.useProgram(program);
    gl.uniform1f(loc.time, seconds);
    gl.uniform2f(loc.res, canvas.width, canvas.height);
    gl.uniform2f(loc.mouse, eased.x * 2 - 1, -(eased.y * 2 - 1));
    gl.uniform1f(loc.swallow, swallowInput ? parseFloat(swallowInput.value) || 0 : 0);
    // Black hole sits in the centre of the canvas (device pixels, y measured from the top).
    gl.uniform2f(loc.center, canvas.width * 0.5, canvas.height * 0.5);
    gl.uniform1f(loc.scroll, journeyInput ? parseFloat(journeyInput.value) || 0 : 0);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  var running = false;
  var rafId = 0;
  var elapsed = 12; // start a few seconds in – the still frame looks better than t = 0
  var lastNow = 0;
  var resumeOnVisible = false;

  function updateButton() {
    if (!startBtn) return;
    startBtn.textContent = running ? TEXT.pause : TEXT.start;
    startBtn.setAttribute('aria-pressed', running ? 'true' : 'false');
  }

  function frame(now) {
    if (!running) return;
    elapsed += Math.min(0.1, (now - lastNow) / 1000);
    lastNow = now;
    draw(elapsed);
    rafId = window.requestAnimationFrame(frame);
  }

  function start() {
    if (running || !program) return;
    running = true;
    lastNow = window.performance.now();
    rafId = window.requestAnimationFrame(frame);
    updateButton();
    setStatus(TEXT.running);
  }

  function stop(msg) {
    running = false;
    if (rafId) window.cancelAnimationFrame(rafId);
    rafId = 0;
    updateButton();
    setStatus(msg || TEXT.paused);
  }

  if (startBtn) {
    startBtn.addEventListener('click', function () { if (running) stop(); else start(); });
  }

  // While paused, moving a slider still redraws the single still frame.
  [swallowInput, journeyInput].forEach(function (input) {
    if (!input) return;
    input.addEventListener('input', function () { if (!running && program) draw(elapsed); });
  });
  window.addEventListener('resize', function () { if (!running && program) draw(elapsed); });

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      resumeOnVisible = running;
      if (running) stop();
    } else if (resumeOnVisible) {
      resumeOnVisible = false;
      start();
    }
  });

  canvas.addEventListener('webglcontextlost', function (e) {
    e.preventDefault();
    resumeOnVisible = false;
    var wasRunning = running;
    stop(TEXT.lost);
    program = null;
    canvas.setAttribute('data-resume', wasRunning ? '1' : '0');
  });
  canvas.addEventListener('webglcontextrestored', function () {
    if (!initGL()) { showPoster(TEXT.noWebgl); return; }
    draw(elapsed);
    if (canvas.getAttribute('data-resume') === '1') start(); else stop();
  });

  // First paint: always one still frame. Auto-start only on capable, motion-friendly devices.
  draw(elapsed);
  updateButton();
  if (reducedMotion) {
    setStatus(TEXT.reduced);
  } else if (lowPower) {
    setStatus(TEXT.lowPower);
  } else {
    start();
  }
})();
