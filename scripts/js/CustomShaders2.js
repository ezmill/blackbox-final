var CustomShaders = function(){
	this.passShader = {

		uniforms: THREE.UniformsUtils.merge( [

			{
				"texture"  : { type: "t", value: null },
				"alpha"  : { type: "t", value: null },
				"mouse"  : { type: "v2", value: null },
				"resolution"  : { type: "v2", value: null },
				"time"  : { type: "f", value: null }

			}
		] ),

		vertexShader: [

			"varying vec2 vUv;",
			"void main() {",
			"    vUv = uv;",
			"    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
			"}"
		
		].join("\n"),
		
		fragmentShader: [
			
			"uniform sampler2D texture; ",
			"uniform sampler2D alpha; ",
			"varying vec2 vUv;",

			"void main() {",
			"	vec3 col = texture2D(texture, vUv).rgb;",
			"	vec3 col2 = texture2D(texture, vUv).rgb;",
			"	vec3 alpha = texture2D(alpha, vUv).rgb;",

			// "	if(dot(alpha, vec3(1.0))/3.0 > 0.1){",
			// "   	col = mix( col, col2, dot(alpha, vec3(1.0))/3.0);",
			"	gl_FragColor = vec4(col,1.0);",

			// "	}",

			// "	gl_FragColor = vec4(col,1.0);",
			"}"
		
		].join("\n")
		
	},
	this.colorShader = {

		uniforms: THREE.UniformsUtils.merge( [

			{
				"texture"  : { type: "t", value: null },
				"alpha"  : { type: "t", value: null },
				"mouse"  : { type: "v2", value: null },
				"resolution"  : { type: "v2", value: null },
				"time"  : { type: "f", value: null },
				"r2"  : { type: "f", value: null }

			}
		] ),

		vertexShader: [

			"varying vec2 vUv;",
			"void main() {",
			"    vUv = uv;",
			"    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
			"}"
		
		].join("\n"),
		
		fragmentShader: [
					
			"uniform sampler2D texture;",
			"uniform sampler2D alpha;",
			"uniform vec2 resolution;",
			"uniform vec2 mouse;",
			"uniform float r2;",
			"varying vec2 vUv;",

			"vec3 rainbow(float h) {",
			"  h = mod(mod(h, 1.0) + 1.0, 1.0);",
			"  float h6 = h * 6.0;",
			"  float r = clamp(h6 - 4.0, 0.0, 1.0) +",
			"    clamp(2.0 - h6, 0.0, 1.0);",
			"  float g = h6 < 2.0",
			"    ? clamp(h6, 0.0, 1.0)",
			"    : clamp(4.0 - h6, 0.0, 1.0);",
			"  float b = h6 < 4.0",
			"    ? clamp(h6 - 2.0, 0.0, 1.0)",
			"    : clamp(6.0 - h6, 0.0, 1.0);",
			"  return vec3(r, g, b);",
			"}",

			"vec3 rgb2hsv(vec3 c)",
			"{",
			"    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);",
			"    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));",
			"    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));",
			"    ",
			"    float d = q.x - min(q.w, q.y);",
			"    float e = 1.0e-10;",
			"    return vec3(abs(( (q.z + (q.w - q.y) / (6.0 * d + e))) ), d / (q.x + e), q.x);",
			"}",

			"vec3 hsv2rgb(vec3 c)",
			"{",
			"    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);",
			"    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);",
			"    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);",
			"}",


			"void main(){",

			"  vec4 tex0 = texture2D(texture, vUv);",
			"  vec3 hsv = rgb2hsv(tex0.rgb);",

			"  hsv.r += 0.005;",
			"  //hsv.r = mod(hsv.r, 1.0);",
			"  hsv.g *= 1.001;",
			// "  hsv.b += 0.;",
			"  // hsv.g = mod(hsv.g, 1.0);",
			"  vec3 rgb = hsv2rgb(hsv); ",

			"	vec2 q = vUv;",
		    "	vec2 p = -1.0 + 2.0*q;",
		    "	p.x *= resolution.x/resolution.y;",
	    	"	vec2 m = mouse;",
	    	"	m.x *= resolution.x/resolution.y;",
		    "	float r = sqrt( dot((p - m), (p - m)) );",
		    "	float a = atan(p.y, p.x);",
		    "	vec3 col = texture2D(texture, vUv).rgb;",
		    "	vec4 alpha = texture2D(alpha, vUv);",
		    "	if(r < r2){",
		    "		float f = smoothstep(r2, r2 - 0.5, r);",
		    "		col = mix( col, rgb, f);",
		    "	}",
			"    gl_FragColor = vec4(col, 1.0);",
			// "  gl_FragColor = vec4(rgb,1.0);",
			"}"
		
		].join("\n")
	
	},
	this.colorBlurShader = {

		uniforms: THREE.UniformsUtils.merge( [

			{
				"texture"  : { type: "t", value: null },
				"alpha"  : { type: "t", value: null },
				"mouse"  : { type: "v2", value: null },
				"resolution"  : { type: "v2", value: null },
				"time"  : { type: "f", value: null },
				"r2"  : { type: "f", value: null }

			}
		] ),

		vertexShader: [

			"varying vec2 vUv;",
			"void main() {",
			"    vUv = uv;",
			"    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
			"}"
		
		].join("\n"),
		
		fragmentShader: [
					
			"uniform sampler2D texture;",
			"uniform sampler2D alpha;",
			"uniform vec2 resolution;",
			"uniform vec2 mouse;",
			"uniform float r2;",
			"varying vec2 vUv;",

			"vec3 rainbow(float h) {",
			"  h = mod(mod(h, 1.0) + 1.0, 1.0);",
			"  float h6 = h * 6.0;",
			"  float r = clamp(h6 - 4.0, 0.0, 1.0) +",
			"    clamp(2.0 - h6, 0.0, 1.0);",
			"  float g = h6 < 2.0",
			"    ? clamp(h6, 0.0, 1.0)",
			"    : clamp(4.0 - h6, 0.0, 1.0);",
			"  float b = h6 < 4.0",
			"    ? clamp(h6 - 2.0, 0.0, 1.0)",
			"    : clamp(6.0 - h6, 0.0, 1.0);",
			"  return vec3(r, g, b);",
			"}",

			"vec3 rgb2hsv(vec3 c)",
			"{",
			"    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);",
			"    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));",
			"    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));",
			"    ",
			"    float d = q.x - min(q.w, q.y);",
			"    float e = 1.0e-10;",
			"    return vec3(abs(( (q.z + (q.w - q.y) / (6.0 * d + e))) ), d / (q.x + e), q.x);",
			"}",

			"vec3 hsv2rgb(vec3 c)",
			"{",
			"    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);",
			"    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);",
			"    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);",
			"}",


			"void main(){",
			"vec4 center = texture2D(texture, vUv);",
			"float exponent = 1.0;",
			"vec4 color = vec4(0.0);",
			"float total = 0.0;",
			"for (float x = -4.0; x <= 4.0; x += 2.0) {",
			"    for (float y = -4.0; y <= 4.0; y += 2.0) {",
			"        vec4 sample = texture2D(texture, vUv + vec2(x, y) / resolution);",
			"        float weight = 1.0 - abs(dot(sample.rgb - center.rgb, vec3(0.25)));",
			"        weight = pow(weight, exponent);",
			"        color += sample * weight;",
			"        total += weight;",
			"    }",
			"}",
			"vec4 col2 = color / total;",
			
			"vec2 q = vUv;",
		    "vec2 p = -1.0 + 2.0*q;",
		    "p.x *= resolution.x/resolution.y;",
	    	"vec2 m = mouse;",
	    	"m.x *= resolution.x/resolution.y;",
		    "float r = sqrt( dot((p - m), (p - m)) );",
		    "float a = atan(p.y, p.x);",
		    "vec3 col = texture2D(texture, vUv).rgb;",
		    "vec4 alpha = texture2D(alpha, vUv);",
		    "if(r < r2){",
		    "	float f = smoothstep(r2, r2 - 0.5, r);",
		    "	col = mix( col, col2.rgb, f);",
		    "}",

			"gl_FragColor = vec4(mix(col, alpha.rgb,0.0),1.0);",
			"}"
		
		].join("\n")
	
	},
	this.gradientShader = {
		uniforms: THREE.UniformsUtils.merge( [

			{
				"texture"  : { type: "t", value: null },
				"alpha"  : { type: "t", value: null },
				"mouse"  : { type: "v2", value: null },
				"resolution"  : { type: "v2", value: null },
				"time"  : { type: "f", value: null },
				"r2"  : { type: "f", value: null }

			}
		] ),

		vertexShader: [

			"varying vec2 vUv;",
			"void main() {",
			"    vUv = uv;",
			"    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
			"}"
		
		].join("\n"),
		
		fragmentShader: [
					
			"uniform sampler2D texture;",
			"uniform sampler2D alpha;",
			"uniform vec2 resolution;",
			"uniform vec2 mouse;",
			"uniform float r2;",
			"varying vec2 vUv;",

			"void main(){",

			"vec4 tex = texture2D(texture, vUv);",
		    "vec3 g1 = vec3(1.0,0.0,0.0);",
		    "vec3 g2 = vec3(0.0,1.0,0.0);",
		    "if(dot(tex.rgb, vec3(1.0)) > 1.5){",
		    "    tex.rgb*=g1;",
		    "} else {",
		    "    tex.rgb*=g2;",
		    "}",
			"	vec2 q = vUv;",
		    "	vec2 p = -1.0 + 2.0*q;",
		    "	p.x *= resolution.x/resolution.y;",
	    	"	vec2 m = mouse;",
	    	"	m.x *= resolution.x/resolution.y;",
		    "	float r = sqrt( dot((p - m), (p - m)) );",
		    "	float a = atan(p.y, p.x);",
		    "	vec3 col = texture2D(texture, vUv).rgb;",
		    "	vec4 alpha = texture2D(alpha, vUv);",
		    // "	if(r < r2 && (dot(alpha.rgb, vec3(1.0))/3.0) < 0.1){",
		    "	if(r < r2){",
		    "		float f = smoothstep(r2, r2 - 0.5, r);",
		    "		col = mix( col, tex.rgb, f);",
		    "	}",
			"    gl_FragColor = vec4(col, 1.0);",
			// "  gl_FragColor = vec4(rgb,1.0);",
			"}"
		
		].join("\n")
	
	}
	this.flowShader = {

		uniforms: THREE.UniformsUtils.merge( [

			{
				"texture"  : { type: "t", value: null },
				"alpha"  : { type: "t", value: null },
				"mouse"  : { type: "v2", value: null },
				"resolution"  : { type: "v2", value: null },
				"time"  : { type: "f", value: null },
				"r2"  : { type: "f", value: null }

			}
		] ),

		vertexShader: [

			"varying vec2 vUv;",
			"void main() {",
			"    vUv = uv;",
			"    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
			"}"
		
		].join("\n"),
		
		fragmentShader: [
			
			"uniform vec2 resolution;",
			"uniform float time;",
			"uniform float r2;",
			"uniform sampler2D texture;",
			"uniform sampler2D alpha;",
			"varying vec2 vUv;",
			"uniform vec2 mouse;",

			"void main( void ){",
			"    vec2 uv = vUv;",

			"    vec2 e = 1.0/resolution.xy;",


			"    float am1 = 0.5 + 0.5*0.927180409;",
			"    float am2 = 10.0;",

			"    for( int i=0; i<20; i++ ){",
			"    	float h  = dot( texture2D(texture, uv*0.99         ).xyz, vec3(0.333) );",
			"    	float h1 = dot( texture2D(texture, uv+vec2(e.x,0.0)).xyz, vec3(0.333) );",
			"    	float h2 = dot( texture2D(texture, uv+vec2(0.0,e.y)).xyz, vec3(0.333) );",
			"    	vec2 g = 0.001*vec2( (h-h2), (h-h1) )/e;",
			// "    	vec2 g = 0.001*vec2( (h1-h), (h2-h) )/e;",
			"    	vec2 f = g.yx*vec2(1.0*mouse.x, 1.0*mouse.y);",
			// "    	vec2 f = g.yx*vec2(-1.0,1.0);",

			"   	g = mix( g, f, am1 );",

			"    	uv += 0.00005*g*am2;",
			"    }",

			"    vec3 col2 = texture2D(texture, uv).xyz;",
			"	vec2 q = vUv;",
		    "	vec2 p = -1.0 + 2.0*q;",
		    "	p.x *= resolution.x/resolution.y;",
	    	"	vec2 m = mouse;",
	    	"	m.x *= resolution.x/resolution.y;",
		    "	float r = sqrt( dot((p - m), (p - m)) );",
		    "	float a = atan(p.y, p.x);",
		   "	vec3 col = texture2D(texture, vUv).rgb;",

		   "	vec3 alpha = texture2D(alpha, vUv).rgb;",

		    "	if(r < r2){",
		    "		float f = smoothstep(r2, r2 - 0.5, r);",
		    "		col = mix( col, col2, f);",
		    "	}",

		   "	gl_FragColor = vec4(col,1.0);",

			"}"
		
		].join("\n")
	
	},
	this.blurShader = {

		uniforms: THREE.UniformsUtils.merge( [

			{
				"texture"  : { type: "t", value: null },
				"mouse"  : { type: "v2", value: null },
				"resolution"  : { type: "v2", value: null },
				"time"  : { type: "f", value: null },
				"r2"  : { type: "f", value: null }
			}
		] ),

		vertexShader: [

			"varying vec2 vUv;",
			"void main() {",
			"    vUv = uv;",
			"    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
			"}"
		
		].join("\n"),
		
		fragmentShader: [
			
			"uniform sampler2D texture;",
			"uniform vec2 resolution;",
			"uniform vec2 mouse;",
			"uniform float r2;",

			"varying vec2 vUv;",

			"void main() {",
			"  float step_w = 1.0/resolution.x;",
			"  float step_h = 1.0/resolution.y;",
			"  vec2 tc = vUv;",
			"  vec4 input0 = texture2D(texture,tc);",
			"   ",
			"  vec2 x1 = vec2(step_w, 0.0);",
			"  vec2 y1 = vec2(0.0, step_h);",
			"    ",
			"  input0 += texture2D(texture, tc+x1); // right",
			"  input0 += texture2D(texture, tc-x1); // left",
			"  input0 += texture2D(texture, tc+y1); // top",
			"  input0 += texture2D(texture, tc-y1); // bottom",

			// "  input0 *=0.2;",
			"	vec2 q = vUv;",
		    "	vec2 p = -1.0 + 2.0*q;",
		    "	p.x *= resolution.x/resolution.y;",
	    	"	vec2 m = mouse;",
	    	"	m.x *= resolution.x/resolution.y;",
		    "	float r = sqrt( dot((p - m), (p - m)) );",
		    "	float a = atan(p.y, p.x);",
		    "	vec3 col = texture2D(texture, vUv).rgb;",
		    "	if(r < r2){",
		    "		float f = smoothstep(r2, r2 - 0.5, r);",
		    "		col = mix( col, col, f);",
		    "	}",
			"	gl_FragColor = vec4(col,1.0);",

			// "  gl_FragColor = input0;",
			"}"
		
		].join("\n")
	
	},
	this.sharpenShader = {

		uniforms: THREE.UniformsUtils.merge( [

			{
				"texture"  : { type: "t", value: null },
				"mouse"  : { type: "v2", value: null },
				"resolution"  : { type: "v2", value: null },
				"time"  : { type: "f", value: null }
			}
		] ),

		vertexShader: [

			"varying vec2 vUv;",
			"void main() {",
			"    vUv = uv;",
			"    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
			"}"
		
		].join("\n"),
		
		fragmentShader: [
			
			"uniform sampler2D texture;",
			"uniform vec2 resolution;",
			"varying vec2 vUv;",

			"float kernel[9];",
			"vec2 offset[9];",

			"void main() {",
			"	float step_w = 1.0/resolution.x;",
			"	float step_h = 1.0/resolution.y;",
			"	vec2 tc = vUv;",
			"	vec4 input0 = texture2D(texture,tc);",
			"	kernel[0] = -1.0; kernel[1] = -1.0; kernel[2] = -1.0;",
			"	kernel[3] = -1.0; kernel[4] = 8.0; kernel[5] = -1.0;",
			"	kernel[6] = -1.0; kernel[7] = -1.0; kernel[8] = -1.0;",
			"	offset[0] = vec2(-step_w, -step_h);",
			"	offset[1] = vec2(0.0, -step_h);",
			"	offset[2] = vec2(step_w, -step_h);",
			"	offset[3] = vec2(-step_w, 0.0);",
			"	offset[4] = vec2(0.0, 0.0);",
			"	offset[5] = vec2(step_w, 0.0);",
			"	offset[6] = vec2(-step_w, step_h);",
			"	offset[7] = vec2(0.0, step_h);",
			"	offset[8] = vec2(step_w, step_h);",
			"	input0 += texture2D(texture, tc + offset[0]) * kernel[0];",
			"	input0 += texture2D(texture, tc + offset[1]) * kernel[1];",
			"	input0 += texture2D(texture, tc + offset[2]) * kernel[2];",
			"	input0 += texture2D(texture, tc + offset[3]) * kernel[3];",
			"	input0 += texture2D(texture, tc + offset[4]) * kernel[4];",
			"	input0 += texture2D(texture, tc + offset[5]) * kernel[5];",
			"	input0 += texture2D(texture, tc + offset[6]) * kernel[6];",
			"	input0 += texture2D(texture, tc + offset[7]) * kernel[7];",
			"	input0 += texture2D(texture, tc + offset[8]) * kernel[8];",
			"	float kernelWeight = kernel[0] + kernel[2] + kernel[3] + kernel[4] + kernel[5] + kernel[6] + kernel[7] + kernel[8];",
			"	if (kernelWeight <= 0.0) {",
			"	   kernelWeight = 1.0;",
			"	}",
			"	gl_FragColor = vec4((input0/kernelWeight).rgb, 1.0);",
			"}"
		
		].join("\n")
		},
	this.diffShader = {

		uniforms: THREE.UniformsUtils.merge( [

			{
				"texture"  : { type: "t", value: null },
				"mouse"  : { type: "v2", value: null },
				"resolution"  : { type: "v2", value: null },
				"time"  : { type: "f", value: null },
				"texture2"  : { type: "t", value: null },
				"doDiff"  : { type: "f", value: null },
				// "texture3"  : { type: "t", value: null }

			}
		] ),

		vertexShader: [

			"varying vec2 vUv;",
			"void main() {",
			"    vUv = uv;",
			"    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
			"}"
		
		].join("\n"),
		
		fragmentShader: [
			
			"uniform sampler2D texture;",
			"uniform sampler2D texture2;",
			// "uniform sampler2D texture3;",
			"uniform float doDiff;",
			"varying vec2 vUv;",

			"void main() {",
			"  vec4 tex0 = texture2D(texture, vUv);",
			"  vec4 tex1 = texture2D(texture2, vUv);",
			// "  vec4 tex2 = texture2D(texture3, vUv);",

			"  vec4 fc = (tex1 - tex0);",
			// "  vec4 add = (fc + tex0);",
			"  gl_FragColor = vec4(fc);",
			"}"
		
		].join("\n")
		
	},
	this.diffShader2 = {

		uniforms: THREE.UniformsUtils.merge( [

			{
				"texture"  : { type: "t", value: null },
				"mouse"  : { type: "v2", value: null },
				"resolution"  : { type: "v2", value: null },
				"time"  : { type: "f", value: null },
				"texture2"  : { type: "t", value: null },
				// "texture3"  : { type: "t", value: null }

			}
		] ),

		vertexShader: [

			"varying vec2 vUv;",
			"void main() {",
			"    vUv = uv;",
			"    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
			"}"
		
		].join("\n"),
		
		fragmentShader: [
			
			"uniform sampler2D texture;",
			"uniform sampler2D texture2;",
			// "uniform sampler2D texture3;",
			"varying vec2 vUv;",

			"void main() {",
			"  vec4 tex0 = texture2D(texture, vUv);",
			"  vec4 tex1 = texture2D(texture2, vUv);",
			// "  vec4 tex2 = texture2D(texture3, vUv);",

			"  vec4 fc = (tex1 - tex0);",
			"  vec4 add = (fc + tex0);",
			"  gl_FragColor = vec4(add);",
			"}"
		
		].join("\n")
		
	},
	this.reposShader = {

		uniforms: THREE.UniformsUtils.merge( [

			{
				"texture"  : { type: "t", value: null },
				"alpha"  : { type: "t", value: null },
				"mouse"  : { type: "v2", value: null },
				"resolution"  : { type: "v2", value: null },
				"time"  : { type: "f", value: null },
				"r2"  : { type: "f", value: null }

			}
		] ),

		vertexShader: [

			"varying vec2 vUv;",

			"void main() {",
			"    vUv = uv;",
			"    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
			"}"
		
		].join("\n"),
		
		fragmentShader: [
			

			"varying vec2 vUv;",
			"uniform sampler2D texture;",
			"uniform sampler2D alpha;",
			"uniform vec2 mouse;",
			"uniform vec2 resolution;",

			"uniform float r2;",

			"void main(){",

			"    vec2 tc = vUv;",
			"    vec4 look = texture2D(texture,tc);",
			// "    vec2 offs = vec2(look.y-look.x,look.w-look.z)*0.001;",
			"    vec2 offs = vec2(look.y-look.x,look.w-look.z)*vec2(mouse.x/233.333, mouse.y/233.333);",
			// "    vec2 offs = vec2(look.y-look.x,look.w-look.z)*vec2(0.0, 0.01);",
			"    vec2 coord = offs+tc;",
			"    vec4 repos = texture2D(texture, coord);",
			"    repos*=1.001;",
			// "    gl_FragColor = repos;",

			"	vec2 q = vUv;",
		    "	vec2 p = -1.0 + 2.0*q;",
		    "	p.x *= resolution.x/resolution.y;",
	    	"	vec2 m = mouse;",
	    	"	m.x *= resolution.x/resolution.y;",
		    "	float r = sqrt( dot((p - m), (p - m)) );",
		    "	float a = atan(p.y, p.x);",
		    "	vec3 col = texture2D(texture, vUv).rgb;",
		    "	vec3 alpha = texture2D(alpha, vUv).rgb;",

		    // "	if(dot(alpha, vec3(1.0))/3.0 > 0.1){",
		    // "   	col = mix( col, repos.rgb, dot(alpha, vec3(1.0))/3.0);",
		    // "	}",
// 
		    // "	gl_FragColor = vec4(col,1.0);",
		    "	if(r < r2){",
		    "		float f = smoothstep(r2, r2 - 0.5, r);",
		    "		col = mix( col, repos.rgb, f);",
		    "	}",
			"	gl_FragColor = vec4(col,1.0);",
			"}"
		
		].join("\n")
		
	},
	this.alphaShader = {

		uniforms: THREE.UniformsUtils.merge( [

			{
				"texture"  : { type: "t", value: null },
				"mouse"  : { type: "v2", value: null },
				"resolution"  : { type: "v2", value: null },
				"time"  : { type: "f", value: null }

			}
		] ),

		vertexShader: [

			"varying vec2 vUv;",
			"void main() {",
			"    vUv = uv;",
			"    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
			"}"
		
		].join("\n"),
		
		fragmentShader: [
			
			"uniform sampler2D texture; ",
			"varying vec2 vUv;",

	        "void main() {",
	      
	        "    float avg = dot(texture2D(texture, vUv).rgb, vec3(1.0))/3.0;",
	        // "    if(texture2D(texture, vUv).rgb > 0.1){",
	        "    if(avg > 0.5){",
	        "      gl_FragColor = vec4(texture2D(texture, vUv).rgb, texture2D(texture, vUv).a);",
	        "    }",
	        "    else {",
	        "      discard;",
	        // "      gl_FragColor = vec4(texture2D(texture, vUv).rgb, avg);",
	        "    }",
	        "    ",
			"}"
		].join("\n")
		
	},	
	this.passThroughShader = {
	    uniforms: THREE.UniformsUtils.merge( [

	        {
	            "texture"  : { type: "t", value: null },
	            "mouse"  : { type: "v2", value: null },
	            "resolution"  : { type: "v2", value: null },
	            "texture2"  : { type: "t", value: null },
	            "color"  : { type: "c", value: null }
	        }
	    ] ),

	    vertexShader: [
	        "varying vec2 vUv;",
	        "uniform float time;",
	        "void main() {",
	        "    vUv = uv;",
	        "    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
	        "}"
	    ].join("\n"),

	    fragmentShader: [
	        "uniform sampler2D texture; ",
	        "uniform sampler2D texture2; ",
	        "uniform vec3 color; ",
	        "varying vec2 vUv;",

	        "void main() {",
	        // "    float avg = normalize((texture2D(texture, vUv).rgb + texture2D(texture2, vUv).rgb)*0.5);",
	        // "    float avg = dot(texture2D(texture2, vUv), vec4(1.0))/3.0;",
	        // "    float avg = dot(texture2D(texture, vUv).rgb, vec3(1.0))/3.0;",
	        // "    if(avg < 0.1){",
	        "      gl_FragColor = vec4(texture2D(texture, vUv).rgb, texture2D(texture, vUv).a);",
	        // "      gl_FragColor = vec4(1.0,0.0,0.0,1.0);",
	        // "      gl_FragColor = vec4(color,1.0);",
	        // "    }",
	        // "    else {",
	        // "      discard;",
	        // "    }",
	        "    ",
	        "}"
	    ].join("\n")
	}
	this.warpShader = {
	    uniforms: THREE.UniformsUtils.merge( [

	        {
	            "texture"  : { type: "t", value: null },
	            "mouse"  : { type: "v2", value: null },
	            "time"  : { type: "f", value: null },
	            "resolution"  : { type: "v2", value: null },
	        }
	    ] ),

	    vertexShader: [
	        "varying vec2 vUv;",
	        "uniform float time;",
	        "void main() {",
	        "    vUv = uv;",
	        "    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
	        "}"
	    ].join("\n"),

	    fragmentShader: [
			"uniform vec2 resolution;",
			"uniform float time;",
			"uniform sampler2D texture;",
			"varying vec2 vUv;",
			"uniform vec2 mouse;",

			"void main(){",
			"	vec2 q = (-resolution.xy + 2.0*gl_FragCoord.xy) / resolution.y;",
			// "	vec2 q = vUv;",
			"    vec2 p = q;",
			"    ",
			// "    p += .2*cos( 1.5*p.yx + 1.0*time + vec2(0.1,1.1) );",
			// "	p += .2*cos( 2.4*p.yx + 1.6*time + vec2(4.5,2.6) );",
			// "	p += .2*cos( 3.3*p.yx + 1.2*time + vec2(3.2,3.4) );",
			// "	p += .2*cos( 4.2*p.yx + 1.7*time + vec2(1.8,5.2) );",
			// "	p += .2*cos( 9.1*p.yx + 1.1*time + vec2(6.3,3.9) );",
			"    p += .2*cos( 1.5*p.yx + 1.0*time + vec2(0.1*mouse.x,1.1*mouse.y) );",
			"	p += .2*cos( 2.4*p.yx + 1.6*time + vec2(4.5*mouse.x,2.6*mouse.y) );",
			"	p += .2*cos( 3.3*p.yx + 1.2*time + vec2(3.2*mouse.x,3.4*mouse.y) );",
			"	p += .2*cos( 4.2*p.yx + 1.7*time + vec2(1.8*mouse.x,5.2*mouse.y) );",
			"	p += .2*cos( 9.1*p.yx + 1.1*time + vec2(6.3*mouse.x,3.9*mouse.y) );",

			"	float r = length( p );",
			"    ",
			// "    vec3 col = texture2D( texture, vec2(r,     0.0), 0.0 ).rgb;",
			"    vec3 col = texture2D( texture, p).rgb;",

			"    gl_FragColor = vec4( col, 1.0 );",
			"}"
	    ].join("\n")

	}
	this.warp2 = {
		    uniforms: THREE.UniformsUtils.merge( [

		        {
		            "texture"  : { type: "t", value: null },
		            "alpha"  : { type: "t", value: null },
		            "origTex"  : { type: "t", value: null },
		            "mask"  : { type: "t", value: null },
		            "mouse"  : { type: "v2", value: null },
		            "time"  : { type: "f", value: null },
		            "r2"  : { type: "f", value: null },
		            "resolution"  : { type: "v2", value: null },
		        }
		    ] ),

		    vertexShader: [
		        "varying vec2 vUv;",
		        "uniform float time;",
		        "void main() {",
		        "    vUv = uv;",
		        "    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
		        "}"
		    ].join("\n"),

		    fragmentShader: [
				"uniform vec2 resolution;",
				"uniform float time;",
				"uniform sampler2D texture;",
				"uniform sampler2D origTex;",
				"uniform sampler2D alpha;",
				"uniform sampler2D mask;",
				"varying vec2 vUv;",
				"uniform vec2 mouse;",
				"uniform float r2;",
				"vec3 rgb2hsv(vec3 c)",
				"{",
				"    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);",
				"    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));",
				"    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));",
				"    ",
				"    float d = q.x - min(q.w, q.y);",
				"    float e = 1.0e-10;",
				"    return vec3(abs(( (q.z + (q.w - q.y) / (6.0 * d + e))) ), d / (q.x + e), q.x);",
				"}",

				"vec3 hsv2rgb(vec3 c)",
				"{",
				"    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);",
				"    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);",
				"    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);",
				"}",
				"float rand(vec2 p)",
				"{",
				"    vec2 n = floor(p/2.0);",
				"     return fract(cos(dot(n,vec2(48.233,39.645)))*375.42); ",
				"}",
				"float srand(vec2 p)",
				"{",
				"     vec2 f = floor(p);",
				"    vec2 s = smoothstep(vec2(0.0),vec2(1.0),fract(p));",
				"    ",
				"    return mix(mix(rand(f),rand(f+vec2(1.0,0.0)),s.x),",
				"           mix(rand(f+vec2(0.0,1.0)),rand(f+vec2(1.0,1.0)),s.x),s.y);",
				"}",
				"float noise(vec2 p)",
				"{",
				"     float total = srand(p/128.0)*0.5+srand(p/64.0)*0.35+srand(p/32.0)*0.1+srand(p/16.0)*0.05;",
				"    return total;",
				"}",

				"void main()",
				"{",
				"    float t = time;",
				"    vec2 warp = vec2(noise(gl_FragCoord.xy+t)+noise(gl_FragCoord.xy*0.5+t*3.5),",
				"                     noise(gl_FragCoord.xy+128.0-t)+noise(gl_FragCoord.xy*0.6-t*2.5))*0.5-0.25;",
				// "    vec2 uv = gl_FragCoord.xy / resolution.xy+warp;",
				"	 vec2 mW = warp*mouse;",
				"    vec2 uv = vUv+mW*sin(time);",
				"    vec4 look = texture2D(texture,uv);",
				"    vec2 offs = vec2(look.y-look.x,look.w-look.z)*vec2(mouse.x*uv.x/10.0, mouse.y*uv.y/10.0);",
				"    vec2 coord = offs+vUv;",
				"    vec4 repos = texture2D(texture, coord);",

				// "    gl_FragColor = repos;",
				"  vec4 tex0 = repos;",
				"  vec3 hsv = rgb2hsv(tex0.rgb);",
				"  //hsv.r += 0.01;",
				"  //hsv.r = mod(hsv.r, 1.0);",
				"  //hsv.g *= 1.001;",
				"  // hsv.g = mod(hsv.g, 1.0);",
				"  vec3 rgb = hsv2rgb(hsv); ",

				// "	vec2 q = vUv;",
			    // "	vec2 p = -1.0 + 2.0*q;",
			    // "	p.x *= resolution.x/resolution.y;",
		    	// "	vec2 m = mouse;",
		    	// "	m.x *= resolution.x/resolution.y;",
			    // "	float r = sqrt( dot((p - m), (p - m)) );",
			    // "	float a = atan(p.y, p.x);",
			    // "	vec3 col = texture2D(texture, vUv).rgb;",
			    // "	if(r < r2){",
			    // "		float f = smoothstep(r2, r2 - 0.5, r);",
			    // "		col = mix( col, rgb, f);",
			    // "	}",

			    "	vec4 alpha = texture2D(alpha, vUv);",
			    "	vec4 mask = texture2D(mask, vUv);",
			    "	vec3 col = texture2D(texture, vUv).rgb;",
			    // "	if(dot(mask.rgb, vec3(1.0))/3.0 < 0.00001){",
			    "   	col = mix( col, rgb, dot(alpha.rgb, vec3(1.0))/3.0);",
			    // "	}",

			    "gl_FragColor = vec4(col,1.0);",

				// "	gl_FragColor = vec4(col,1.0);",
				"}"
		    ].join("\n")

		}
	this.bumpShader =  {

		uniforms: THREE.UniformsUtils.merge( [

			{
				"texture"  : { type: "t", value: null },
				"mouse"  : { type: "v2", value: null },
				"resolution"  : { type: "v2", value: null },
				"time"  : { type: "f", value: null },
				"lightWidth"  : { type: "f", value: 9.5 },
				"lightBrightness"  : { type: "f", value: 1.0 }
			}
		] ),

		vertexShader: [

			"varying vec2 vUv;",
			"void main() {",
			"    vUv = uv;",
			"    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
			"}"
		
		].join("\n"),
		
		fragmentShader: [
			
			"uniform sampler2D texture;",
			"uniform vec2 mouse;",
			"uniform float time;",
			"uniform float lightWidth;",
			"uniform float lightBrightness;",
			"varying vec2 vUv;",
			"uniform vec2 resolution;",


			"void main() {",
			"vec2 texelWidth = 1.0/resolution; ",
			"    vec4 input0 = texture2D(texture,vUv);",


			"    float step = 5.0;",
			"    float tl = abs(texture2D(texture, vUv + texelWidth * vec2(-step, -step)).x);   // top left",
			"    float  l = abs(texture2D(texture, vUv + texelWidth * vec2(-step,  0.0)).x);   // left",
			"    float bl = abs(texture2D(texture, vUv + texelWidth * vec2(-step,  step)).x);   // bottom left",
			"    float  t = abs(texture2D(texture, vUv + texelWidth * vec2( 0.0, -step)).x);   // top",
			"    float  b = abs(texture2D(texture, vUv + texelWidth * vec2( 0.0,  step)).x);   // bottom",
			"    float tr = abs(texture2D(texture, vUv + texelWidth * vec2( step, -step)).x);   // top right",
			"    float  r = abs(texture2D(texture, vUv + texelWidth * vec2( step,  0.0)).x);   // right",
			"    float br = abs(texture2D(texture, vUv + texelWidth * vec2( step,  step)).x);   // bottom right",

			"    float mult = 0.01;",

			"    float dX = tr*mult + 2.0*r*mult + br*mult -tl*mult - 2.0*l*mult - bl*mult;",
			"    float dY = bl*mult + 2.0*b*mult + br*mult -tl*mult - 2.0*t*mult - tr*mult;",
			"    ",

			"    vec4 diffuseColor = texture2D(texture, vUv);",

			"    vec3 color = normalize(vec3(dX,dY,1.0/50.0));",
			"    ",
			"    for( int i = 0; i<4; i++){",
			"      color +=color;",
			"    }",

			"    vec3 lightDir = vec3( vec2( mouse.x/resolution.x, 1.0-mouse.y/resolution.y)-(gl_FragCoord.xy / vec2(resolution.x,resolution.y)), lightWidth );",
			"    lightDir.x *= resolution.x/resolution.y;",

			"    float D = length(lightDir);",

			"    vec3 N = normalize(color);",
			"    vec3 L = normalize(lightDir);",
			"    vec3 H = normalize(L);",

			"    vec4 lightColor = input0;",
			"    vec4 ambientColor = vec4(vec3(input0.rgb*lightBrightness),0.5);",
			"    ",
			"    vec3 falloff = vec3(1.0,3.0,20.5);",
			"  ",
			"    vec3 diffuse = (lightColor.rgb * lightColor.a) * max(dot(N, L), 0.0);",
			"    vec3 ambient = ambientColor.rgb * ambientColor.a;",
			"    ",
			"    float shin = 1000.1;",
			"    float sf = max(0.0,dot(N,H));",
			"    sf = pow(sf, shin);",
			"  ",
			"    float attenuation = 1.0 / (falloff.x + (falloff.y*D) + (falloff.z * D * D) );",

			"    vec3 intensity =  ambient+(diffuse+sf ) * attenuation;",
			"    vec3 finalColor = (diffuseColor.rgb * intensity);",

			"    vec3 col = ambient+( finalColor+sf );",

			"    color *=0.5;",
			"    color +=0.5;",

			"    // vec4 C = index == 0 ? vec4(col, 1.0) : vec4(color, 1.0);",
			"    vec4 C = vec4(col, 1.0);",
			"    gl_FragColor = C;",
			"}"
		
		].join("\n")
		
	},
	this.paintShader = {

		uniforms: THREE.UniformsUtils.merge( [

			{
				"texture"  : { type: "t", value: null },
				"mouse"  : { type: "v2", value: null },
				"resolution"  : { type: "v2", value: null },
				"time"  : { type: "f", value: null }

			}
		] ),

		vertexShader: [

			"varying vec2 vUv;",
			"void main() {",
			"    vUv = uv;",
			"    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
			"}"
		
		].join("\n"),
		
		fragmentShader: [
			
			"uniform sampler2D texture; ",
			"uniform vec2 resolution; ",
			"varying vec2 vUv;",

 
			 "const int radius = 1;",

			 "void main() {",
			"	 vec2 src_size = vec2 (1.0 / resolution.x, 1.0 / resolution.y);",
			 "    //vec2 uv = gl_FragCoord.xy/resolution.xy;",
			 "    vec2 uv = vUv;",
			 "    float n = float((radius + 1) * (radius + 1));",
			 "    int i; ",
			"	 int j;",
			 "    vec3 m0 = vec3(0.0); vec3 m1 = vec3(0.0); vec3 m2 = vec3(0.0); vec3 m3 = vec3(0.0);",
			 "    vec3 s0 = vec3(0.0); vec3 s1 = vec3(0.0); vec3 s2 = vec3(0.0); vec3 s3 = vec3(0.0);",
			 "    vec3 c;",

			 "    for (int j = -radius; j <= 0; ++j)  {",
			 "        for (int i = -radius; i <= 0; ++i)  {",
			 "            c = texture2D(texture, uv + vec2(i,j) * src_size).rgb;",
			 "            m0 += c;",
			 "            s0 += c * c;",
			 "        }",
			 "    }",

			 "    for (int j = -radius; j <= 0; ++j)  {",
			 "        for (int i = 0; i <= radius; ++i)  {",
			 "            c = texture2D(texture, uv + vec2(i,j) * src_size).rgb;",
			 "            m1 += c;",
			 "            s1 += c * c;",
			 "        }",
			 "    }",

			 "    for (int j = 0; j <= radius; ++j)  {",
			 "        for (int i = 0; i <= radius; ++i)  {",
			 "            c = texture2D(texture, uv + vec2(i,j) * src_size).rgb;",
			 "            m2 += c;",
			 "            s2 += c * c;",
			 "        }",
			 "    }",

			 "    for (int j = 0; j <= radius; ++j)  {",
			 "        for (int i = -radius; i <= 0; ++i)  {",
			 "            c = texture2D(texture, uv + vec2(i,j) * src_size).rgb;",
			 "            m3 += c;",
			 "            s3 += c * c;",
			 "        }",
			 "    }",


			 "    float min_sigma2 = 1e+2;",
			 "    m0 /= n;",
			 "    s0 = abs(s0 / n - m0 * m0);",

			 "    float sigma2 = s0.r + s0.g + s0.b;",
			 "    if (sigma2 < min_sigma2) {",
			 "        min_sigma2 = sigma2;",
			 "        gl_FragColor = vec4(m0, 1.0);",
			 "    }",

			 "    m1 /= n;",
			 "    s1 = abs(s1 / n - m1 * m1);",

			 "    sigma2 = s1.r + s1.g + s1.b;",
			 "    if (sigma2 < min_sigma2) {",
			 "        min_sigma2 = sigma2;",
			 "        gl_FragColor = vec4(m1, 1.0);",
			 "    }",

			 "    m2 /= n;",
			 "    s2 = abs(s2 / n - m2 * m2);",

			 "    sigma2 = s2.r + s2.g + s2.b;",
			 "    if (sigma2 < min_sigma2) {",
			 "        min_sigma2 = sigma2;",
			 "        gl_FragColor = vec4(m2, 1.0);",
			 "    }",

			 "    m3 /= n;",
			 "    s3 = abs(s3 / n - m3 * m3);",

			 "    sigma2 = s3.r + s3.g + s3.b;",
			 "    if (sigma2 < min_sigma2) {",
			 "        min_sigma2 = sigma2;",
			 "        gl_FragColor = vec4(m3, 1.0);",
			 "    }",
			 "}"
		
		].join("\n")
		
	}
}
var CurvesShader = function(red, green, blue){
        function clamp(lo, value, hi) {
            return Math.max(lo, Math.min(value, hi));
        }
        function splineInterpolate(points) {
            var interpolator = new SplineInterpolator(points);
            var array = [];
            for (var i = 0; i < 256; i++) {
                array.push(clamp(0, Math.floor(interpolator.interpolate(i / 255) * 256), 255));
            }
            return array;
        }

        red = splineInterpolate(red);
        if (arguments.length == 1) {
            green = blue = red;
        } else {
            green = splineInterpolate(green);
            blue = splineInterpolate(blue);
        }
        // createCanvas(red, green, blue);
        var array = [];
        for (var i = 0; i < 256; i++) {
            array.splice(array.length, 0, red[i], green[i], blue[i], 255);
        }
        // console.log(array);
        curveMap = new THREE.DataTexture(array, 256, 1, THREE.RGBAFormat, THREE.UnsignedByteType);
        curveMap.minFilter = curveMap.magFilter = THREE.LinearFilter;
        curveMap.needsUpdate = true;
        // var noiseSize = 256;
        var size = 256;
        var data = new Uint8Array( 4 * size );
        for ( var i = 0; i < size * 4; i ++ ) {
            data[ i ] = array[i] | 0;
        }
        var dt = new THREE.DataTexture( data, 256, 1, THREE.RGBAFormat );
        // dt.wrapS = THREE.ClampToEdgeWrapping;
        // dt.wrapT = THREE.ClampToEdgeWrapping;
        dt.needsUpdate = true;
        // console.log(dt);
        this.uniforms = THREE.UniformsUtils.merge([
            {
                "texture"  : { type: "t", value: null },
                "origTex"  : { type: "t", value: null },
                "curveMap"  : { type: "t", value: dt },
                "alpha"  : { type: "t", value: null },
                "mouse"  : { type: "v2", value: null },
                "resolution"  : { type: "v2", value: null },
                "time"  : { type: "f", value: null },
                "id"  : { type: "i", value: null },
                "id2"  : { type: "i", value: null }

            }
        ]);

        this.vertexShader = [

            "varying vec2 vUv;",
            "void main() {",
            "    vUv = uv;",
            "    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
            "}"
        
        ].join("\n");
        
        this.fragmentShader = [
            
            "uniform sampler2D texture;",
            "uniform sampler2D origTex;",
            "uniform sampler2D alpha;",
            "uniform sampler2D curveMap;",
            "uniform vec2 resolution;",
            "uniform vec2 mouse;",
            "uniform int id;",
            "uniform int id2;",
            "uniform float time;",
            "varying vec2 vUv;",

            "void main(){",
            
            "   vec4 col = texture2D(texture, vUv);",
            "   vec3 alpha = texture2D(alpha, vUv).rgb;",

            "   vec4 curveColor = texture2D(texture, vUv);",
            "   curveColor.r = texture2D(curveMap, vec2(curveColor.r)).r;",
            "   curveColor.g = texture2D(curveMap, vec2(curveColor.g)).g;",
            "   curveColor.b = texture2D(curveMap, vec2(curveColor.b)).b;",

            "   if(dot(alpha, vec3(1.0))/3.0 > 0.1){",
            "        col.rgb = mix( col.rgb, curveColor.rgb, dot(alpha, vec3(1.0))/3.0);",
            "   }",

            "   gl_FragColor = vec4(col.rgb,1.0);",
            "}",


        
        ].join("\n");
}

function SplineInterpolator(points) {
    var n = points.length;
    this.xa = [];
    this.ya = [];
    this.u = [];
    this.y2 = [];

    points.sort(function(a, b) {
        return a[0] - b[0];
    });
    for (var i = 0; i < n; i++) {
        this.xa.push(points[i][0]);
        this.ya.push(points[i][1]);
    }

    this.u[0] = 0;
    this.y2[0] = 0;

    for (var i = 1; i < n - 1; ++i) {
        // This is the decomposition loop of the tridiagonal algorithm. 
        // y2 and u are used for temporary storage of the decomposed factors.
        var wx = this.xa[i + 1] - this.xa[i - 1];
        var sig = (this.xa[i] - this.xa[i - 1]) / wx;
        var p = sig * this.y2[i - 1] + 2.0;

        this.y2[i] = (sig - 1.0) / p;

        var ddydx = 
            (this.ya[i + 1] - this.ya[i]) / (this.xa[i + 1] - this.xa[i]) - 
            (this.ya[i] - this.ya[i - 1]) / (this.xa[i] - this.xa[i - 1]);

        this.u[i] = (6.0 * ddydx / wx - sig * this.u[i - 1]) / p;
    }

    this.y2[n - 1] = 0;

    // This is the backsubstitution loop of the tridiagonal algorithm
    for (var i = n - 2; i >= 0; --i) {
        this.y2[i] = this.y2[i] * this.y2[i + 1] + this.u[i];
    }
}

SplineInterpolator.prototype.interpolate = function(x) {
    var n = this.ya.length;
    var klo = 0;
    var khi = n - 1;

    // We will find the right place in the table by means of
    // bisection. This is optimal if sequential calls to this
    // routine are at random values of x. If sequential calls
    // are in order, and closely spaced, one would do better
    // to store previous values of klo and khi.
    while (khi - klo > 1) {
        var k = (khi + klo) >> 1;

        if (this.xa[k] > x) {
            khi = k; 
        } else {
            klo = k;
        }
    }

    var h = this.xa[khi] - this.xa[klo];
    var a = (this.xa[khi] - x) / h;
    var b = (x - this.xa[klo]) / h;

    // Cubic spline polynomial is now evaluated.
    return a * this.ya[klo] + b * this.ya[khi] + 
        ((a * a * a - a) * this.y2[klo] + (b * b * b - b) * this.y2[khi]) * (h * h) / 6.0;
};

function createCanvas(red, green, blue){
    var canvas = document.createElement("canvas");
    
}
var DenoiseShader = function(){
        this.uniforms = THREE.UniformsUtils.merge([
            {
                "texture"  : { type: "t", value: null },
                "origTex"  : { type: "t", value: null },
                "alpha"  : { type: "t", value: null },
                "mouse"  : { type: "v2", value: null },
                "resolution"  : { type: "v2", value: null },
                "time"  : { type: "f", value: null },
                "r2"  : { type: "f", value: null }

            }
        ]);

        this.vertexShader = [

            "varying vec2 vUv;",
            "void main() {",
            "    vUv = uv;",
            "    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
            "}"
        
        ].join("\n");
        
        this.fragmentShader = [
            
            "uniform sampler2D texture;",
            "uniform sampler2D alpha;",
            "uniform vec2 resolution;",
            "uniform vec2 mouse;",
            "uniform float r2;",
            "uniform float time;",
            "varying vec2 vUv;",

            "void main() {",

                "vec3 col = texture2D(texture, vUv).rgb;",
                "vec4 alpha = texture2D(alpha, vUv);",

                "vec4 center = texture2D(texture, vUv);",
                "float exponent = 1.0;",
                "vec4 color = vec4(0.0);",
                "float total = 0.0;",
                "for (float x = -4.0; x <= 4.0; x += 2.0) {",
                "    for (float y = -4.0; y <= 4.0; y += 2.0) {",
                "        vec4 sample = texture2D(texture, vUv + vec2(x, y) / resolution);",
                "        float weight = 1.0 - abs(dot(sample.rgb - center.rgb, vec3(0.25)));",
                "        weight = pow(weight, exponent);",
                "        color += sample * weight;",
                "        total += weight;",
                "    }",
                "}",
                "vec4 col2 = color / total;",
                
                // "col2*=2.0;",
                // "vec3 col2 = texture2D(texture, vUv).rgb*vec3(2.0,2.0,2.0);",
                "if(dot(alpha.rgb, vec3(1.0))/3.0 > 0.1){",
                // "    col *= vec3(1.0, 0.0, 0.0);   ",
                // "    float f = smoothstep(r2, r2 - 0.5, r);",
                // "    col = mix( col, col2, f);",
                "   col = mix( col, col2.rgb, dot(alpha.rgb, vec3(1.0))/3.0);",
                "}",
                "gl_FragColor = vec4(mix(col, alpha.rgb,0.0),1.0);",
            "}"


        
        ].join("\n");
}
var GlassShader = function(){
        this.uniforms = THREE.UniformsUtils.merge([
            {
                "texture"  : { type: "t", value: null },
                "origTex"  : { type: "t", value: null },
                "alpha"  : { type: "t", value: null },
                "mouse"  : { type: "v2", value: null },
                "mask"  : { type: "t", value: null },
                "resolution"  : { type: "v2", value: null },
                "time"  : { type: "f", value: null },
                "r2"  : { type: "f", value: null }

            }
        ]);
        this.vertexShader = [

            "varying vec2 vUv;",
            "void main() {",
            "    vUv = uv;",
            "    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
            "}"
        
        ].join("\n");
        
        this.fragmentShader = [
            
            "uniform sampler2D texture;",
            "uniform sampler2D alpha;",
            "uniform sampler2D origTex;",
            "uniform sampler2D mask;",
            "uniform vec2 resolution;",
            "uniform vec2 mouse;",
            "uniform float r2;",
            "uniform float time;",
            "varying vec2 vUv;",

            "void main() {",

                "vec3 col = texture2D(texture, vUv).rgb;",
                "vec4 alpha = texture2D(alpha, vUv);",
                "vec4 mask = texture2D(mask, vUv);",
                // "vec4 origTex = texture2D(origTex, vUv);",
                "vec2 uv = gl_FragCoord.xy;",
                "gl_FragColor = texture2D(origTex, uv /= resolution.xy );",
                "uv += gl_FragColor.r / gl_FragColor.g - (sin(time)*0.25) - 1.0;",
                "gl_FragColor -= gl_FragColor - texture2D(texture, uv);",
                // "if(dot(mask.rgb, vec3(1.0))/3.0 < 0.0001){",
                // "    float f = smoothstep(r2, r2 - 0.5, r);",
                // "    col = mix( col, col2.rgb, f);",
                // "   col = mix( col, col2.rgb, dot(alpha.rgb, vec3(1.0))/3.0);",
                // "}",
                // "gl_FragColor = vec4(col,1.0);",
                // "gl_FragColor = col;",
            "}"


        
        ].join("\n");
}
var GradientShader = function(){
        this.uniforms = THREE.UniformsUtils.merge([
            {
                "texture"  : { type: "t", value: null },
                "origTex"  : { type: "t", value: null },
                "alpha"  : { type: "t", value: null },
                "mouse"  : { type: "v2", value: null },
                "resolution"  : { type: "v2", value: null },
                "time"  : { type: "f", value: null },
                "r2"  : { type: "f", value: null },
                "id"  : { type: "i", value: null },
                "id2"  : { type: "i", value: null }

            }
        ]);

        this.vertexShader = [

            "varying vec2 vUv;",
            "void main() {",
            "    vUv = uv;",
            "    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
            "}"
        
        ].join("\n");
        
        this.fragmentShader = [
            
            "uniform sampler2D texture;",
            "uniform sampler2D origTex;",
            "uniform sampler2D alpha;",
            "uniform vec2 resolution;",
            "uniform vec2 mouse;",
            "uniform int id;",
            "uniform int id2;",
            "uniform float time;",
            "uniform float r2;",
            "varying vec2 vUv;",

            "void main()",
            "{",
			"	vec2 uv = vUv;",
			// "	vec4 color = mix(mix(vec4(0.5+0.5*cos(time), 1.0 - uv.yx,0.5), texture2D(texture, vUv), 0.5), texture2D(texture, vUv), (0.5 + 0.5*sin((-sin(time) + uv.x*sin(time)*2.0)*(-1.0 + uv.y*2.0)*5.0)));",
            // "   vec4 mix1 = vec4(0.0, 114.0/255.0, 182.0/255.0, 1.0);",
            // "   vec4 mix2 = vec4(1.0);",
            // "   vec4 mix3 = vec4(122.0/255.0, 175.0/255.0, 255.0/255.0, 1.0);",
            // "   vec4 mix4 = vec4(88.0/255.0, 233.0/255.0, 192.0/255.0, 1.0);",
           "vec4 mix1 = vec4(0.0, 0.0, 1.0, 1.0);",
		   "vec4 mix2 = vec4(1.0);",
		   "vec4 mix3 = vec4(0.0,1.0,0.0, 1.0);",
		   "vec4 mix4 = vec4(1.0,0.0,0.0, 1.0);",
            "   vec4 color1 = mix(mix1, mix2, uv.y*sin(time*2.0));",
            "   vec4 color2 = mix(mix3, mix4, uv.x*cos(time*2.0));",
            "   vec4 color3 = mix(color1, color2, 0.5);",
            // "   vec4 color = mix(color3, texture2D(texture, vUv), 0.5);",
            "   vec4 color = mix(mix(color3, texture2D(texture, vUv), 0.5), texture2D(texture, vUv), (0.5 + 0.5*sin((-sin(time) + uv.x*sin(time)*2.0)*(-1.0 + uv.y*2.0)*5.0)));",

            "	vec3 col = texture2D(texture, vUv).rgb;",
            "	vec3 alpha = texture2D(alpha, vUv).rgb;",
            // "     vec2 q = vUv;",
            // "     vec2 p = -1.0 + 2.0*q;",
            // "     p.x *= resolution.x/resolution.y;",
            // "     vec2 m = mouse;",
            // "     m.x *= resolution.x/resolution.y;",
            // "     float r = sqrt( dot((p - m), (p - m)) );",
            // "     float a = atan(p.y, p.x);",
            // "     if(r < r2){",
            // "            float f = smoothstep(r2, r2 - 0.5, r);",
            // "             col = mix( col, color.rgb, f);",
            // "     }",
	        // "if(dot(alpha.rgb, vec3(1.0))/3.0 > 0.1){",
	        "   col = mix( col, color.rgb, dot(alpha.rgb, vec3(1.0))/3.0);",
            // "}",

            "     gl_FragColor = vec4(col,1.0);",
            "}",


        
        ].join("\n");
}

 var NeonGlowShader = function(){
         this.uniforms = THREE.UniformsUtils.merge([
             {
                 "texture"  : { type: "t", value: null },
                 "origTex"  : { type: "t", value: null },
                 "alpha"  : { type: "t", value: null },
                 "mask" : {type: "t", value: null},
                 "mouse"  : { type: "v2", value: null },
                 "resolution"  : { type: "v2", value: null },
                 "time"  : { type: "f", value: null },
                 "r2"  : { type: "f", value: null }

             }
         ]);
         this.vertexShader = [

             "varying vec2 vUv;",
             "void main() {",
             "    vUv = uv;",
             "    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
             "}"
         
         ].join("\n");
         
         this.fragmentShader = [
             
            "uniform sampler2D texture;",
            "uniform sampler2D alpha;",
            "uniform sampler2D mask;",
            "uniform vec2 resolution;",
            "uniform vec2 mouse;",
            "uniform float r2;",
            "uniform float time;",
            "varying vec2 vUv;",
            
            "vec3 darken( vec3 s, vec3 d )",
            "{",
            "   return min(s,d);",
            "}",

            "vec3 multiply( vec3 s, vec3 d )",
            "{",
            "   return s*d;",
            "}",

            "vec3 colorBurn( vec3 s, vec3 d )",
            "{",
            "   return 1.0 - (1.0 - d) / s;",
            "}",

            "vec3 linearBurn( vec3 s, vec3 d )",
            "{",
            "   return s + d - 1.0;",
            "}",

            "vec3 darkerColor( vec3 s, vec3 d )",
            "{",
            "   return (s.x + s.y + s.z < d.x + d.y + d.z) ? s : d;",
            "}",

            "vec3 lighten( vec3 s, vec3 d )",
            "{",
            "   return max(s,d);",
            "}",

            "vec3 screen( vec3 s, vec3 d )",
            "{",
            "   return s + d - s * d;",
            "}",

            "vec3 colorDodge( vec3 s, vec3 d )",
            "{",
            "   return d / (1.0 - s);",
            "}",

            "vec3 linearDodge( vec3 s, vec3 d )",
            "{",
            "   return s + d;",
            "}",

            "vec3 lighterColor( vec3 s, vec3 d )",
            "{",
            "   return (s.x + s.y + s.z > d.x + d.y + d.z) ? s : d;",
            "}",

            "float overlay( float s, float d )",
            "{",
            "   return (d < 0.5) ? 2.0 * s * d : 1.0 - 2.0 * (1.0 - s) * (1.0 - d);",
            "}",

            "vec3 overlay( vec3 s, vec3 d )",
            "{",
            "   vec3 c;",
            "   c.x = overlay(s.x,d.x);",
            "   c.y = overlay(s.y,d.y);",
            "   c.z = overlay(s.z,d.z);",
            "   return c;",
            "}",

            "float softLight( float s, float d )",
            "{",
            "   return (s < 0.5) ? d - (1.0 - 2.0 * s) * d * (1.0 - d) ",
            "       : (d < 0.25) ? d + (2.0 * s - 1.0) * d * ((16.0 * d - 12.0) * d + 3.0) ",
            "                    : d + (2.0 * s - 1.0) * (sqrt(d) - d);",
            "}",

            "vec3 softLight( vec3 s, vec3 d )",
            "{",
            "   vec3 c;",
            "   c.x = softLight(s.x,d.x);",
            "   c.y = softLight(s.y,d.y);",
            "   c.z = softLight(s.z,d.z);",
            "   return c;",
            "}",

            "float hardLight( float s, float d )",
            "{",
            "   return (s < 0.5) ? 2.0 * s * d : 1.0 - 2.0 * (1.0 - s) * (1.0 - d);",
            "}",

            "vec3 hardLight( vec3 s, vec3 d )",
            "{",
            "   vec3 c;",
            "   c.x = hardLight(s.x,d.x);",
            "   c.y = hardLight(s.y,d.y);",
            "   c.z = hardLight(s.z,d.z);",
            "   return c;",
            "}",

            "float vividLight( float s, float d )",
            "{",
            "   return (s < 0.5) ? 1.0 - (1.0 - d) / (2.0 * s) : d / (2.0 * (1.0 - s));",
            "}",

            "vec3 vividLight( vec3 s, vec3 d )",
            "{",
            "   vec3 c;",
            "   c.x = vividLight(s.x,d.x);",
            "   c.y = vividLight(s.y,d.y);",
            "   c.z = vividLight(s.z,d.z);",
            "   return c;",
            "}",

            "vec3 linearLight( vec3 s, vec3 d )",
            "{",
            "   return 2.0 * s + d - 1.0;",
            "}",

            "float pinLight( float s, float d )",
            "{",
            "   return (2.0 * s - 1.0 > d) ? 2.0 * s - 1.0 : (s < 0.5 * d) ? 2.0 * s : d;",
            "}",

            "vec3 pinLight( vec3 s, vec3 d )",
            "{",
            "   vec3 c;",
            "   c.x = pinLight(s.x,d.x);",
            "   c.y = pinLight(s.y,d.y);",
            "   c.z = pinLight(s.z,d.z);",
            "   return c;",
            "}",

            "vec3 hardMix( vec3 s, vec3 d )",
            "{",
            "   return floor(s + d);",
            "}",

            "vec3 difference( vec3 s, vec3 d )",
            "{",
            "   return abs(d - s);",
            "}",

            "vec3 exclusion( vec3 s, vec3 d )",
            "{",
            "   return s + d - 2.0 * s * d;",
            "}",

            "vec3 subtract( vec3 s, vec3 d )",
            "{",
            "   return s - d;",
            "}",

            "vec3 divide( vec3 s, vec3 d )",
            "{",
            "   return s / d;",
            "}",

            "// rgb<-->hsv functions by Sam Hocevar",
            "// http://lolengine.net/blog/2013/07/27/rgb-to-hsv-in-glsl",
            "vec3 rgb2hsv(vec3 c)",
            "{",
            "   vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);",
            "   vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));",
            "   vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));",
            "   ",
            "   float d = q.x - min(q.w, q.y);",
            "   float e = 1.0e-10;",
            "   return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);",
            "}",

            "vec3 hsv2rgb(vec3 c)",
            "{",
            "   vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);",
            "   vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);",
            "   return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);",
            "}",

            "vec3 hue( vec3 s, vec3 d )",
            "{",
            "   d = rgb2hsv(d);",
            "   d.x = rgb2hsv(s).x;",
            "   return hsv2rgb(d);",
            "}",

            "vec3 color( vec3 s, vec3 d )",
            "{",
            "   s = rgb2hsv(s);",
            "   s.z = rgb2hsv(d).z;",
            "   return hsv2rgb(s);",
            "}",

            "vec3 saturation( vec3 s, vec3 d )",
            "{",
            "   d = rgb2hsv(d);",
            "   d.y = rgb2hsv(s).y;",
            "   return hsv2rgb(d);",
            "}",

            "vec3 luminosity( vec3 s, vec3 d )",
            "{",
            "   float dLum = dot(d, vec3(0.3, 0.59, 0.11));",
            "   float sLum = dot(s, vec3(0.3, 0.59, 0.11));",
            "   float lum = sLum - dLum;",
            "   vec3 c = d + lum;",
            "   float minC = min(min(c.x, c.y), c.z);",
            "   float maxC = max(max(c.x, c.y), c.z);",
            "   if(minC < 0.0) return sLum + ((c - sLum) * sLum) / (sLum - minC);",
            "   else if(maxC > 1.0) return sLum + ((c - sLum) * (1.0 - sLum)) / (maxC - sLum);",
            "   else return c;",
            "}",
            "vec3 sample(const int x, const int y, in vec2 fragCoord)",
            "{",
            "    vec2 uv = fragCoord.xy / resolution.xy * resolution.xy;",
            "    uv = (uv + vec2(x, y)) / resolution.xy;",
            "    return texture2D(texture, uv).xyz;",
            "}",

            "float luminance(vec3 c)",
            "{",
            "    return dot(c, vec3(.2126, .7152, .0722));",
            "}",

            "vec3 filter(in vec2 fragCoord)",
            "{",
            "    vec3 hc =sample(-1,-1, fragCoord) *  1. + sample( 0,-1, fragCoord) *  2.",
            "             +sample( 1,-1, fragCoord) *  1. + sample(-1, 1, fragCoord) * -1.",
            "             +sample( 0, 1, fragCoord) * -2. + sample( 1, 1, fragCoord) * -1.;        ",

            "    vec3 vc =sample(-1,-1, fragCoord) *  1. + sample(-1, 0, fragCoord) *  2.",
            "             +sample(-1, 1, fragCoord) *  1. + sample( 1,-1, fragCoord) * -1.",
            "             +sample( 1, 0, fragCoord) * -2. + sample( 1, 1, fragCoord) * -1.;",

            "    return sample(0, 0, fragCoord) * pow(luminance(vc*vc + hc*hc), .6);",
            "}",
            "float lookup(vec2 p, float dx, float dy)",
            "{",
            "float d = sin(time * 5.0)*0.5 + 1.5; // kernel offset",
            "    vec2 uv = (p.xy + vec2(dx * d, dy * d)) / resolution.xy;",
            "    vec4 c = texture2D(texture, uv.xy);",
            "    ",
            "    // return as luma",
            "    return 0.2126*c.r + 0.7152*c.g + 0.0722*c.b;",
            "}",
            "void main()",
            "{",
            "float d = sin(time * 5.0)*0.5 + 1.5; // kernel offset",

            // "    float u = gl_FragCoord.x / resolution.x;",
            // "    float m = mouse.x / resolution.x;",
            // "    ",
            // "    float l = smoothstep(0., 1. / resolution.y, abs(m - u));",
            // "    ",
            // "    vec2 fc = gl_FragCoord.xy;",
            // "    // fc.y = resolution.y - fragCoord.y;",
            // "    ",
            // "    vec3 cf = filter(fc);",
            // "    vec3 cl = sample(0, 0, fc);",
            // "    vec3 SOBEL = (u < m ? cl : cf) * l;",
// 
            "vec2 p = gl_FragCoord.xy;",
    
            "// simple sobel edge detection",
            "float gx = 0.0;",
            "gx += -1.0 * lookup(p, -1.0, -1.0);",
            "gx += -2.0 * lookup(p, -1.0,  0.0);",
            "gx += -1.0 * lookup(p, -1.0,  1.0);",
            "gx +=  1.0 * lookup(p,  1.0, -1.0);",
            "gx +=  2.0 * lookup(p,  1.0,  0.0);",
            "gx +=  1.0 * lookup(p,  1.0,  1.0);",
            
            "float gy = 0.0;",
            "gy += -1.0 * lookup(p, -1.0, -1.0);",
            "gy += -2.0 * lookup(p,  0.0, -1.0);",
            "gy += -1.0 * lookup(p,  1.0, -1.0);",
            "gy +=  1.0 * lookup(p, -1.0,  1.0);",
            "gy +=  2.0 * lookup(p,  0.0,  1.0);",
            "gy +=  1.0 * lookup(p,  1.0,  1.0);",
            
            "// hack: use g^2 to conceal noise in the video",
            "float g = gx*gx + gy*gy;",
            "float g2 = g * (sin(time) / 2.0 + 0.5);",
            
            "vec4 SOBEL = texture2D(texture, p / resolution.xy);",
            "SOBEL += vec4(g*(235.0/255.0), g*(64.0/255.0), g*(10.0/255.0), 1.0);",
// 
            "vec4 center = texture2D(texture, vUv);",
            "float exponent = 1.0;",
            "vec4 color = vec4(0.0);",
            "float total = 0.0;",
            "for (float x = -4.0; x <= 4.0; x += 2.0) {",
            "    for (float y = -4.0; y <= 4.0; y += 2.0) {",
            "        vec4 sample = texture2D(texture, vUv + vec2(x, y) / resolution);",
            "        float weight = 1.0 - abs(dot(sample.rgb - center.rgb, vec3(0.25)));",
            "        weight = pow(weight, exponent);",
            "        color += sample * weight;",
            "        total += weight;",
            "    }",
            "}",
            "vec4 BLUR = color / total;",
            "vec4 ORIGINAL = texture2D(texture, vUv);",

            // "vec3 FINAL = overlay(BLUR.rgb, SOBEL.rgb);",
            // "FINAL = difference( FINAL, ORIGINAL.rgb);",

            "vec3 FINAL = difference(ORIGINAL.rgb, SOBEL.rgb);",
            "FINAL = overlay( FINAL, BLUR.rgb);",
            "FINAL = saturation(FINAL, SOBEL.rgb);",
            "FINAL = overlay( FINAL, ORIGINAL.rgb);",


            "    vec3 col = texture2D(texture, vUv).rgb;",
            "    vec4 alpha = texture2D(alpha, vUv);",
            "    vec4 mask = texture2D(mask, vUv);",
            "    if((dot(alpha.rgb, vec3(1.0))/3.0 < 0.99999)){",
            "       col = mix( col, FINAL, dot(alpha.rgb, vec3(1.0))/3.0);",
            "    }",

            "    gl_FragColor = vec4(col, 1);",
            // "    gl_FragColor = mask;",
            "}"


         
         ].join("\n");
 }
  var OilPaintShader = function(){
         this.uniforms = THREE.UniformsUtils.merge([
             {
                 "texture"  : { type: "t", value: null },
                 "origTex"  : { type: "t", value: null },
                 "alpha"  : { type: "t", value: null },
                 "mask"  : { type: "t", value: null },
                 "mouse"  : { type: "v2", value: null },
                 "resolution"  : { type: "v2", value: null },
                 "time"  : { type: "f", value: null },
                 "r2"  : { type: "f", value: null }

             }
         ]);

         this.vertexShader = [

             "varying vec2 vUv;",
             "void main() {",
             "    vUv = uv;",
             "    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
             "}"
         
         ].join("\n");
         
         this.fragmentShader = [
             
             "uniform sampler2D texture;",
             "uniform sampler2D alpha;",
             "uniform sampler2D mask;",
             "uniform vec2 resolution;",
             "uniform vec2 mouse;",
             "uniform float r2;",
             "uniform float time;",
             "varying vec2 vUv;",

              "const int radius = 1;",

              "float rand(vec2 co){",
              "  // implementation found at: lumina.sourceforge.net/Tutorials/Noise.html",
              "  return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);",
              "}",

              "float noise2f( in vec2 p )",
              "{",
              "  vec2 ip = vec2(floor(p));",
              "  vec2 u = fract(p);",
              "  // http://www.iquilezles.org/www/articles/morenoise/morenoise.htm",
              "  u = u*u*(3.0-2.0*u);",
              "  //u = u*u*u*((6.0*u-15.0)*u+10.0);",
              "  ",
              "  float res = mix(",
              "    mix(rand(ip),  rand(ip+vec2(1.0,0.0)),u.x),",
              "    mix(rand(ip+vec2(0.0,1.0)),   rand(ip+vec2(1.0,1.0)),u.x),",
              "    u.y)",
              "  ;",
              "  return res*res;",
              "  //return 2.0* (res-10.7);",
              "}",

              "float fbm(vec2 c) {",
              "  float f = 0.0;",
              "  float w = 1.0;",
              "  for (int i = 0; i < 8; i++) {",
              "    f+= w*noise2f(c);",
              "    c*=2.0;",
              "    w*=0.5;",
              "  }",
              "  return f;",
              "}",



              "vec2 cMul(vec2 a, vec2 b) {",
              "  return vec2( a.x*b.x -  a.y*b.y,a.x*b.y + a.y * b.x);",
              "}",

              "float pattern(  vec2 p, out vec2 q, out vec2 r )",
              "{",
              "  q.x = fbm( p  +0.00*time * 2.); // @SLIDER: 5. could represent velocity of wate",
              "  q.y = fbm( p + vec2(1.0));",
              "  ",
              "  r.x = fbm( p +1.0*q + vec2(1.7,9.2)+0.15*time * 2. );",
              "  r.y = fbm( p+ 1.0*q + vec2(8.3,2.8)+0.126*time * 2.);",
              "  //r = cMul(q,q+0.1*time);",
              "  return fbm(p +1.0*r + 0.0* time);",
              "}",

              "const vec3 color1 = vec3(0.101961,0.619608,0.666667);",
              "const vec3 color2 = vec3(0.666667,0.666667,0.498039);",
              "const vec3 color3 = vec3(0,0,0.164706);",
              "const vec3 color4 = vec3(0.666667,1,1);",

              "vec3 darken( vec3 s, vec3 d )",
              "{",
              "  return min(s,d);",
              "}",

              "vec3 multiply( vec3 s, vec3 d )",
              "{",
              "  return s*d;",
              "}",

              "vec3 colorBurn( vec3 s, vec3 d )",
              "{",
              "  return 1.0 - (1.0 - d) / s;",
              "}",

              "vec3 linearBurn( vec3 s, vec3 d )",
              "{",
              "  return s + d - 1.0;",
              "}",

              "vec3 darkerColor( vec3 s, vec3 d )",
              "{",
              "  return (s.x + s.y + s.z < d.x + d.y + d.z) ? s : d;",
              "}",

              "vec3 lighten( vec3 s, vec3 d )",
              "{",
              "  return max(s,d);",
              "}",

              "vec3 screen( vec3 s, vec3 d )",
              "{",
              "  return s + d - s * d;",
              "}",

              "vec3 colorDodge( vec3 s, vec3 d )",
              "{",
              "  return d / (1.0 - s);",
              "}",

              "vec3 linearDodge( vec3 s, vec3 d )",
              "{",
              "  return s + d;",
              "}",

              "vec3 lighterColor( vec3 s, vec3 d )",
              "{",
              "  return (s.x + s.y + s.z > d.x + d.y + d.z) ? s : d;",
              "}",

              "float overlay( float s, float d )",
              "{",
              "  return (d < 0.5) ? 2.0 * s * d : 1.0 - 2.0 * (1.0 - s) * (1.0 - d);",
              "}",

              "vec3 overlay( vec3 s, vec3 d )",
              "{",
              "  vec3 c;",
              "  c.x = overlay(s.x,d.x);",
              "  c.y = overlay(s.y,d.y);",
              "  c.z = overlay(s.z,d.z);",
              "  return c;",
              "}",

              "float softLight( float s, float d )",
              "{",
              "  return (s < 0.5) ? d - (1.0 - 2.0 * s) * d * (1.0 - d) ",
              "    : (d < 0.25) ? d + (2.0 * s - 1.0) * d * ((16.0 * d - 12.0) * d + 3.0) ",
              "           : d + (2.0 * s - 1.0) * (sqrt(d) - d);",
              "}",

              "vec3 softLight( vec3 s, vec3 d )",
              "{",
              "  vec3 c;",
              "  c.x = softLight(s.x,d.x);",
              "  c.y = softLight(s.y,d.y);",
              "  c.z = softLight(s.z,d.z);",
              "  return c;",
              "}",

              "float hardLight( float s, float d )",
              "{",
              "  return (s < 0.5) ? 2.0 * s * d : 1.0 - 2.0 * (1.0 - s) * (1.0 - d);",
              "}",

              "vec3 hardLight( vec3 s, vec3 d )",
              "{",
              "  vec3 c;",
              "  c.x = hardLight(s.x,d.x);",
              "  c.y = hardLight(s.y,d.y);",
              "  c.z = hardLight(s.z,d.z);",
              "  return c;",
              "}",

              "float vividLight( float s, float d )",
              "{",
              "  return (s < 0.5) ? 1.0 - (1.0 - d) / (2.0 * s) : d / (2.0 * (1.0 - s));",
              "}",

              "vec3 vividLight( vec3 s, vec3 d )",
              "{",
              "  vec3 c;",
              "  c.x = vividLight(s.x,d.x);",
              "  c.y = vividLight(s.y,d.y);",
              "  c.z = vividLight(s.z,d.z);",
              "  return c;",
              "}",

              "vec3 linearLight( vec3 s, vec3 d )",
              "{",
              "  return 2.0 * s + d - 1.0;",
              "}",

              "float pinLight( float s, float d )",
              "{",
              "  return (2.0 * s - 1.0 > d) ? 2.0 * s - 1.0 : (s < 0.5 * d) ? 2.0 * s : d;",
              "}",

              "vec3 pinLight( vec3 s, vec3 d )",
              "{",
              "  vec3 c;",
              "  c.x = pinLight(s.x,d.x);",
              "  c.y = pinLight(s.y,d.y);",
              "  c.z = pinLight(s.z,d.z);",
              "  return c;",
              "}",

              "vec3 hardMix( vec3 s, vec3 d )",
              "{",
              "  return floor(s + d);",
              "}",

              "vec3 difference( vec3 s, vec3 d )",
              "{",
              "  return abs(d - s);",
              "}",

              "vec3 exclusion( vec3 s, vec3 d )",
              "{",
              "  return s + d - 2.0 * s * d;",
              "}",

              "vec3 subtract( vec3 s, vec3 d )",
              "{",
              "  return s - d;",
              "}",

              "vec3 divide( vec3 s, vec3 d )",
              "{",
              "  return s / d;",
              "}",

              "//  rgb<-->hsv functions by Sam Hocevar",
              "//  http://lolengine.net/blog/2013/07/27/rgb-to-hsv-in-glsl",
              "vec3 rgb2hsv(vec3 c)",
              "{",
              "  vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);",
              "  vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));",
              "  vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));",
              "  ",
              "  float d = q.x - min(q.w, q.y);",
              "  float e = 1.0e-10;",
              "  return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);",
              "}",

              "vec3 hsv2rgb(vec3 c)",
              "{",
              "  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);",
              "  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);",
              "  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);",
              "}",

              "vec3 hue( vec3 s, vec3 d )",
              "{",
              "  d = rgb2hsv(d);",
              "  d.x = rgb2hsv(s).x;",
              "  return hsv2rgb(d);",
              "}",

              "vec3 color( vec3 s, vec3 d )",
              "{",
              "  s = rgb2hsv(s);",
              "  s.z = rgb2hsv(d).z;",
              "  return hsv2rgb(s);",
              "}",

              "vec3 saturation( vec3 s, vec3 d )",
              "{",
              "  d = rgb2hsv(d);",
              "  d.y = rgb2hsv(s).y;",
              "  return hsv2rgb(d);",
              "}",

              "vec3 luminosity( vec3 s, vec3 d )",
              "{",
              "  float dLum = dot(d, vec3(0.3, 0.59, 0.11));",
              "  float sLum = dot(s, vec3(0.3, 0.59, 0.11));",
              "  float lum = sLum - dLum;",
              "  vec3 c = d + lum;",
              "  float minC = min(min(c.x, c.y), c.z);",
              "  float maxC = max(max(c.x, c.y), c.z);",
              "  if(minC < 0.0) return sLum + ((c - sLum) * sLum) / (sLum - minC);",
              "  else if(maxC > 1.0) return sLum + ((c - sLum) * (1.0 - sLum)) / (maxC - sLum);",
              "  else return c;",
              "}",
              "vec3 sample(const int x, const int y, vec2 delta, vec2 fragCoord)",
              "{",
              "  vec2 uv = (fragCoord.xy + vec2(x, y)) / resolution.xy;",
              "  uv = uv + delta;",
              "  //uv.y = 1.0 - uv.y;",
              "  ",
              "  return texture2D(texture, uv).xyz;",
              "}",



              " void main() ",
              " {",
              "   vec2 src_size = vec2 (1.0 / resolution.x, 1.0 / resolution.y);",
              "     // vec2 uv = fragCoord.xy/resolution.xy;",
              "     vec2 uv = vUv;",
              "     float n = float((radius + 1) * (radius + 1));",
              "     int i; ",
              "   int j;",
              "     vec3 m0 = vec3(0.0); vec3 m1 = vec3(0.0); vec3 m2 = vec3(0.0); vec3 m3 = vec3(0.0);",
              "     vec3 s0 = vec3(0.0); vec3 s1 = vec3(0.0); vec3 s2 = vec3(0.0); vec3 s3 = vec3(0.0);",
              "     vec3 c;",

              "     vec2 q;",
              "  vec2 r;",
              "  vec2 c3 = 1000.0*vUv;",
              "  float f = pattern(c3*0.01,q,r);",
              "  vec3 col = mix(color1,color2,clamp((f*f)*4.0,0.0,1.0));",
              "  col = color2;",
              "  col = mix(col,color3,clamp(length(q),0.0,1.0));",
              "  col = mix(col,color4,clamp(length(r.x),0.0,1.0));",
              "  ",
              "  vec3 col2 = (0.2*f*f*f+0.6*f*f+0.5*f)*col;",
              "  vec2 delta =  col2.xy * 0.025;",
              "   ",
              "  const vec3 lumi = vec3(0.2126, 0.7152, 0.0722);",
              "  ",
              "  vec3 hc =sample(-1,-1,delta,gl_FragCoord.xy) *  1.0 + sample( 0,-1,delta,gl_FragCoord.xy) *  2.0",
              "      +sample( 1,-1,delta,gl_FragCoord.xy) *  1.0 + sample(-1, 1,delta,gl_FragCoord.xy) * -1.0",
              "      +sample( 0, 1,delta,gl_FragCoord.xy) * -2.0 + sample( 1, 1,delta,gl_FragCoord.xy) * -1.0;",
              "    ",
              "  vec3 vc =sample(-1,-1,delta,gl_FragCoord.xy) *  1.0 + sample(-1, 0,delta,gl_FragCoord.xy) *  2.0",
              "      +sample(-1, 1,delta,gl_FragCoord.xy) *  1.0 + sample( 1,-1,delta,gl_FragCoord.xy) * -1.0",
              "      +sample( 1, 0,delta,gl_FragCoord.xy) * -2.0 + sample( 1, 1,delta,gl_FragCoord.xy) * -1.0;",
              "  ",
              "  vec3 c2 = sample(0, 0,delta,gl_FragCoord.xy);",
              "  ",
              "  c2 -= pow(c2, vec3(0.2126, 0.7152, 0.0722)) * pow(dot(lumi, vc*vc + hc*hc), 0.5);",
              "  ",

              "  uv = uv + delta; ",
              "   ",
              "     for (int j = -radius; j <= 0; ++j)  {",
              "         for (int i = -radius; i <= 0; ++i)  {",
              "             c = texture2D(texture, uv + vec2(i,j) * src_size).rgb;",
              "             m0 += c;",
              "             s0 += c * c;",
              "         }",
              "     }",

              "     for (int j = -radius; j <= 0; ++j)  {",
              "         for (int i = 0; i <= radius; ++i)  {",
              "             c = texture2D(texture, uv + vec2(i,j) * src_size).rgb;",
              "             m1 += c;",
              "             s1 += c * c;",
              "         }",
              "     }",

              "     for (int j = 0; j <= radius; ++j)  {",
              "         for (int i = 0; i <= radius; ++i)  {",
              "             c = texture2D(texture, uv + vec2(i,j) * src_size).rgb;",
              "             m2 += c;",
              "             s2 += c * c;",
              "         }",
              "     }",

              "     for (int j = 0; j <= radius; ++j)  {",
              "         for (int i = -radius; i <= 0; ++i)  {",
              "             c = texture2D(texture, uv + vec2(i,j) * src_size).rgb;",
              "             m3 += c;",
              "             s3 += c * c;",
              "         }",
              "     }",


              "     vec4 result = texture2D(texture, vUv);",
              "     vec3 INPUT = texture2D(texture, vUv).rgb;",
              "     vec4 alpha = texture2D(alpha, vUv);",
              "     vec4 mask = texture2D(mask, vUv);",
              "     float min_sigma2 = 1e+2;",
              "     m0 /= n;",
              "     s0 = abs(s0 / n - m0 * m0);",

              "     float sigma2 = s0.r + s0.g + s0.b;",
              "     if (sigma2 < min_sigma2) {",
              "         min_sigma2 = sigma2;",
                       // "  if(dot(alpha.rgb, vec3(1.0))/3.0 < 0.0001){",
                       "    result.rgb = mix( INPUT, m0, dot(alpha.rgb, vec3(1.0))/3.0);",
                       // "  }",
              "    }",

              "     m1 /= n;",
              "     s1 = abs(s1 / n - m1 * m1);",

              "     sigma2 = s1.r + s1.g + s1.b;",
              "     if (sigma2 < min_sigma2) {",
              "        min_sigma2 = sigma2;",
                   // "  if(dot(alpha.rgb, vec3(1.0))/3.0 < 0.0001){",
                   "    result.rgb = mix( INPUT, m1, dot(alpha.rgb, vec3(1.0))/3.0);",
                   // "  }",
              "     }",

              "     m2 /= n;",
              "     s2 = abs(s2 / n - m2 * m2);",

              "     sigma2 = s2.r + s2.g + s2.b;",
              "     if (sigma2 < min_sigma2) {",
              "         min_sigma2 = sigma2;",
                   // "  if(dot(alpha.rgb, vec3(1.0))/3.0 < 0.0001){",
                   "    result.rgb = mix( INPUT, m2, dot(alpha.rgb, vec3(1.0))/3.0);",
                   // "  }",
              "     }",

              "     m3 /= n;",
              "     s3 = abs(s3 / n - m3 * m3);",

              "     sigma2 = s3.r + s3.g + s3.b;",
              "     if (sigma2 < min_sigma2) {",
              "      min_sigma2 = sigma2;",

                  // "  if(dot(alpha.rgb, vec3(1.0))/3.0 < 0.0001){",
                  "    result.rgb = mix( INPUT, m3, dot(alpha.rgb, vec3(1.0))/3.0);",
                   // "  }",

              "     }",
              "  ",

              // "  vec4 res2 = vec4(overlay(screen( result.rgb,c2.rgb), result.rgb) , 1.0);",

              // "  vec3 col3 = texture2D(texture, vUv + col2.xy * 0.05 ).xyz;",
              // "  ",
              "  gl_FragColor = result;",
              // "  gl_FragColor = vec4(saturation(col3,res2.rgb ),1.0);",
              "   ",
              // "  // fragColor = res2;",
              "   ",
              " }",
         
         ].join("\n");
 } 
 var PSDMaskShader = function(){
        this.uniforms = THREE.UniformsUtils.merge([
            {
                "texture"  : { type: "t", value: null },
                "origTex"  : { type: "t", value: null },
                "alpha"  : { type: "t", value: null },
                "mouse"  : { type: "v2", value: null },
                "mask"  : { type: "t", value: null },
                "resolution"  : { type: "v2", value: null },
                "time"  : { type: "f", value: null },
                "r2"  : { type: "f", value: null }

            }
        ]);

        this.vertexShader = [

            "varying vec2 vUv;",
            "void main() {",
            "    vUv = uv;",
            "    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
            "}"
        
        ].join("\n");
        
        this.fragmentShader = [
            
            "uniform sampler2D texture;",
            "uniform sampler2D alpha;",
            "uniform sampler2D mask;",
            "uniform sampler2D origTex;",
            "uniform vec2 resolution;",
            "uniform vec2 mouse;",
            "uniform float r2;",
            "uniform float time;",
            "varying vec2 vUv;",

            "void main() {",

                "vec3 col = texture2D(texture, vUv).rgb;",
                "vec3 origCol = texture2D(origTex, vUv).rgb;",
                "vec4 alpha = texture2D(alpha, vUv);",
                "vec4 mask = texture2D(mask, vUv);",


                
                // "col2*=2.0;",
                // "vec3 alpha = texture2D(alpha, vUv).rgb;",
                // "   vec2 q = vUv;",
                // "   vec2 p = -1.0 + 2.0*q;",
                // "   p.x *= resolution.x/resolution.y;",
                // "   vec2 m = mouse;",
                // "   m.x *= resolution.x/resolution.y;",
                // "   float r = sqrt( dot((p - m), (p - m)) );",
                // "   float a = atan(p.y, p.x);",
                // "   if(r < r2){",

                // "if(dot(alpha.rgb, vec3(1.0))/3.0 < 0.00001){",
                // "    float f = smoothstep(r2, r2 - 0.5, r);",
                // "    col = mix( col, col2.rgb, f);",
                // "   col = col;", 
                // "    if((dot(alpha.rgb, vec3(1.0))/3.0 < 0.00001)){",
                "       col = mix(origCol, col,  dot(alpha.rgb, vec3(1.0))/3.0);",
                // "    }",

                // "} else {",
                // "   col = origCol;",
                // "}",
                "gl_FragColor = vec4(col,1.0);",
                // "gl_FragColor = col;",
            "}"


        
        ].join("\n");
}
var RevertShader = function(){
        this.uniforms = THREE.UniformsUtils.merge([
            {
                "texture"  : { type: "t", value: null },
                "origTex"  : { type: "t", value: null },
                "alpha"  : { type: "t", value: null },
                "mask"  : { type: "t", value: null },
                "mouse"  : { type: "v2", value: null },
                "resolution"  : { type: "v2", value: null },
                "time"  : { type: "f", value: null },
                "r2"  : { type: "f", value: null },
                "seed"  : { type: "f", value: null }

            }
        ]);

        this.vertexShader = [

            "varying vec2 vUv;",
            "void main() {",
            "    vUv = uv;",
            "    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
            "}"
        
        ].join("\n");
        
        this.fragmentShader = [
            
            "uniform sampler2D texture;",
            "uniform sampler2D origTex;",
            "uniform sampler2D mask;",
            "uniform sampler2D alpha;",
            "uniform vec2 resolution;",
            "uniform vec2 mouse;",
            "uniform float r2;",
            "uniform float seed;",
            "uniform float time;",
            "varying vec2 vUv;",
            "float rand(vec2 p)",
            "{",
            "    vec2 n = floor(p/2.0);",
            "     return fract(cos(dot(n,vec2(48.233,39.645)))*375.42); ",
            "}",
            "float srand(vec2 p)",
            "{",
            "     vec2 f = floor(p);",
            "    vec2 s = smoothstep(vec2(0.0),vec2(1.0),fract(p));",
            "    ",
            "    return mix(mix(rand(f),rand(f+vec2(1.0,0.0)),s.x),",
            "           mix(rand(f+vec2(0.0,1.0)),rand(f+vec2(1.0,1.0)),s.x),s.y);",
            "}",
            "float noise(vec2 p)",
            "{",
            "     float total = srand(p/128.0)*0.5+srand(p/64.0)*0.35+srand(p/32.0)*0.1+srand(p/16.0)*0.05;",
            "    return total;",
            "}",


                    // "    vec2 q = vUv;",
                    // "    vec2 p = -1.0 + 2.0*q;",
                    // "    p.x *= resolution.x/resolution.y;",
                    // "    vec2 m = mouse;",
                    // "    m.x *= resolution.x/resolution.y;",
                    // "    float r = sqrt( dot((p - m), (p - m)) );",
                    // "    float a = atan(p.y, p.x);",
                    // "    vec3 col = texture2D(texture, vUv).rgb;",
                    // "    if(r < r2){",
                    // "        float f = smoothstep(r2, r2 - 0.5, r);",
                    // "        col = mix( col, rgb, f);",
                    // "    }",

                   
            "void main() {",
	            "vec3 col = texture2D(texture, vUv).rgb;",
	            "vec4 alpha = texture2D(alpha, vUv);",
	            "vec4 mask = texture2D(mask, vUv);",
	            "vec4 col2 = texture2D(origTex, vUv);",
                // "float t = rand(vec2(0.5));",
                // "float t = seed;",
                "float t = time;",
                "vec2 warp = vec2(noise(gl_FragCoord.xy+t)+noise(gl_FragCoord.xy*0.5+t*3.5),",
                "                 noise(gl_FragCoord.xy+128.0-t)+noise(gl_FragCoord.xy*0.6-t*2.5))*0.5-0.25;",
                //"   vec2 uv = gl_FragCoord.xy / resolution.xy+warp;",
                "vec2 mW = warp;",
                "vec2 uv = vUv+mW*sin(t)*0.5;",
                "vec4 look = texture2D(origTex,uv);",
                "vec2 offs = vec2(look.y-look.x,look.w-look.z)*vec2(1.0*uv.x/10.0, 1.0*uv.y/10.0);",
                "vec2 coord = offs+vUv;",
                // "vec4 repos = texture2D(origTex, coord);",


                
                // "col2*=2.0;",
                // "vec3 col2 = texture2D(texture, vUv).rgb*vec3(2.0,2.0,2.0);",
                // "if(dot(alpha.rgb, vec3(1.0))/3.0 > 0.0001){",
                // " repos.rgb = mix(repos.rgb, col2.rgb,dot(mask.rgb, vec3(1.0))/3.0);",
                // "	repos.rgb = mix(repos.rgb, col, 0.25);",
                // "} else {",
                // "	repos.rgb = mix(repos.rgb, col, 0.0);",                
                // "}",
                // "    col *= vec3(1.0, 0.0, 0.0);   ",
                // "    float f = smoothstep(r2, r2 - 0.5, r);",
                // "    col = mix( col, col2, f);",
                // "if(dot(alpha.rgb, vec3(1.0))/3.0 > 0.00000000001){",
                // "}",
                // "	col = mix(col, col2.rgb, dot(mask.rgb, vec3(1.0))/3.0);",
                "vec3 origCol = texture2D(origTex, vUv).rgb;",
                "vec3 inputCol = texture2D(texture, vUv).rgb;",
                "vec3 warpCol = texture2D(origTex, coord).rgb;",
                "vec3 mixCol = mix(inputCol, warpCol, 0.75);",
                "vec3 mixCol2 = mix(mixCol, origCol, dot(mask.rgb, vec3(1.0))/3.0);",
                // "vec3 final = mix( col, repos.rgb, dot(alpha.rgb, vec3(1.0))/3.0);",
                // "vec3 final = mix(mixCol, mixCol2,  dot(mask.rgb, vec3(1.0))/3.0);",
                "vec3 final2 = mix(inputCol, mixCol2, dot(alpha.rgb, vec3(1.0))/3.0);",
                // "if(dot(alpha.rgb, vec3(1.0))/3.0 > 0.99999){",

                // "   col = col2.rgb;",
                // "} else {",
	            // "   col = mix( col2.rgb, col, dot(alpha.rgb, vec3(1.0))/3.0);",
                // "}",
                "gl_FragColor = vec4(final2,1.0);",
            "}"


        
        ].join("\n");
}
var RgbShiftShader = function(){
        this.uniforms = THREE.UniformsUtils.merge([
            {
                "texture"  : { type: "t", value: null },
                "origTex"  : { type: "t", value: null },
                "alpha"  : { type: "t", value: null },
                "mouse"  : { type: "v2", value: null },
                "mask"  : { type: "t", value: null },
                "resolution"  : { type: "v2", value: null },
                "time"  : { type: "f", value: null },
                "r2"  : { type: "f", value: null }

            }
        ]);

        this.vertexShader = [

            "varying vec2 vUv;",
            "void main() {",
            "    vUv = uv;",
            "    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
            "}"
        
        ].join("\n");
        
        this.fragmentShader = [
            
            "uniform sampler2D texture;",
            "uniform sampler2D alpha;",
            "uniform sampler2D mask;",
            "uniform vec2 resolution;",
            "uniform vec2 mouse;",
            "uniform float r2;",
            "uniform float time;",
            "varying vec2 vUv;",

            "void main() {",

                "vec3 col = texture2D(texture, vUv).rgb;",
                "vec4 alpha = texture2D(alpha, vUv);",

                "float ChromaticAberration = 10.0 / 10.0 + 8.0;",
                "vec2 uv = vUv;",

                "vec2 texel = 1.0 / resolution.xy;",

                "vec2 coords = (uv - 0.5) * 2.0;",
                "float coordDot = dot (coords, coords);",

                "vec2 precompute = ChromaticAberration * coordDot * coords;",
                "vec2 uvR = uv - texel.xy * precompute;",
                "vec2 uvB = uv + texel.xy * precompute;",

                "vec4 color;",
                "float distance = 0.01;",
                "float speed = 1.5;",
                "vec2 rCoord = vec2(uvR.x + cos(time*speed)*distance, uvR.y + sin(time*speed)*distance);",
                "vec2 bCoord = vec2(uvB.x + sin(time*speed)*distance, uvB.y + cos(time*speed)*distance);",
                "color.r = texture2D(texture, rCoord).r;",
                "color.g = texture2D(texture, uv).g;",
                "color.b = texture2D(texture, bCoord).b;",

                "vec4 col2 = color;",
                
                // "col2*=2.0;",
                // "vec3 alpha = texture2D(alpha, vUv).rgb;",
                // "   vec2 q = vUv;",
                // "   vec2 p = -1.0 + 2.0*q;",
                // "   p.x *= resolution.x/resolution.y;",
                // "   vec2 m = mouse;",
                // "   m.x *= resolution.x/resolution.y;",
                // "   float r = sqrt( dot((p - m), (p - m)) );",
                // "   float a = atan(p.y, p.x);",
                // "   if(r < r2){",
                "    vec4 mask = texture2D(mask, vUv);",

                "if(dot(mask.rgb, vec3(1.0))/3.0 < 0.0001){",
                // "    float f = smoothstep(r2, r2 - 0.5, r);",
                // "    col = mix( col, col2.rgb, f);",
                "   col = mix( col, col2.rgb, dot(alpha.rgb, vec3(1.0))/3.0);",
                "}",
                "gl_FragColor = vec4(col,1.0);",
                // "gl_FragColor = col;",
            "}"


        
        ].join("\n");
}
var RgbShiftShader = function(){
        this.uniforms = THREE.UniformsUtils.merge([
            {
                "texture"  : { type: "t", value: null },
                "origTex"  : { type: "t", value: null },
                "alpha"  : { type: "t", value: null },
                "mouse"  : { type: "v2", value: null },
                "mask"  : { type: "t", value: null },
                "resolution"  : { type: "v2", value: null },
                "time"  : { type: "f", value: null },
                "r2"  : { type: "f", value: null }

            }
        ]);

        this.vertexShader = [

            "varying vec2 vUv;",
            "void main() {",
            "    vUv = uv;",
            "    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
            "}"
        
        ].join("\n");
        
        this.fragmentShader = [
            
            "uniform sampler2D texture;",
            "uniform sampler2D alpha;",
            "uniform sampler2D mask;",
            "uniform vec2 resolution;",
            "uniform vec2 mouse;",
            "uniform float r2;",
            "uniform float time;",
            "varying vec2 vUv;",

            "void main() {",

                "vec3 col = texture2D(texture, vUv).rgb;",
                "vec4 alpha = texture2D(alpha, vUv);",

                "float ChromaticAberration = 10.0 / 10.0 + 8.0;",
                "vec2 uv = vUv;",

                "vec2 texel = 1.0 / resolution.xy;",

                "vec2 coords = (uv - 0.5) * 2.0;",
                "float coordDot = dot (coords, coords);",

                "vec2 precompute = ChromaticAberration * coordDot * coords;",
                "vec2 uvR = uv - texel.xy * precompute;",
                "vec2 uvB = uv + texel.xy * precompute;",

                "vec4 color;",
                "float distance = 0.01;",
                "float speed = 1.5;",
                "vec2 rCoord = vec2(uvR.x + cos(time*speed)*distance, uvR.y + sin(time*speed)*distance);",
                "vec2 bCoord = vec2(uvB.x + sin(time*speed)*distance, uvB.y + cos(time*speed)*distance);",
                "color.r = texture2D(texture, rCoord).r;",
                "color.g = texture2D(texture, uv).g;",
                "color.b = texture2D(texture, bCoord).b;",

                "vec4 col2 = color;",
                
                // "col2*=2.0;",
                // "vec3 alpha = texture2D(alpha, vUv).rgb;",
                // "   vec2 q = vUv;",
                // "   vec2 p = -1.0 + 2.0*q;",
                // "   p.x *= resolution.x/resolution.y;",
                // "   vec2 m = mouse;",
                // "   m.x *= resolution.x/resolution.y;",
                // "   float r = sqrt( dot((p - m), (p - m)) );",
                // "   float a = atan(p.y, p.x);",
                // "   if(r < r2){",
                "    vec4 mask = texture2D(mask, vUv);",

                // "if(dot(alpha.rgb, vec3(1.0))/3.0 < 0.0001){",
                // "    float f = smoothstep(r2, r2 - 0.5, r);",
                // "    col = mix( col, col2.rgb, f);",
                "   col = mix( col, col2.rgb, dot(alpha.rgb, vec3(1.0))/3.0);",
                // "}",
                "gl_FragColor = vec4(col,1.0);",
                // "gl_FragColor = col;",
            "}"


        
        ].join("\n");
}
var WarpFlowShader = function(){
        this.uniforms = THREE.UniformsUtils.merge( [

            {
                "texture"  : { type: "t", value: null },
                "alpha"  : { type: "t", value: null },
                "origTex"  : { type: "t", value: null },
                "mask"  : { type: "t", value: null },
                "mouse"  : { type: "v2", value: null },
                "time"  : { type: "f", value: null },
                "r2"  : { type: "f", value: null },
                "resolution"  : { type: "v2", value: null },
            }
        ] ),

        this.vertexShader = [
            "varying vec2 vUv;",
            "uniform float time;",
            "void main() {",
            "    vUv = uv;",
            "    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
            "}"
        ].join("\n"),

        this.fragmentShader = [
            "uniform vec2 resolution;",
            "uniform float time;",
            "uniform sampler2D texture;",
            "uniform sampler2D origTex;",
            "uniform sampler2D alpha;",
            "uniform sampler2D mask;",
            "varying vec2 vUv;",
            "uniform vec2 mouse;",
            "uniform float r2;",
            "vec3 rgb2hsv(vec3 c)",
            "{",
            "    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);",
            "    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));",
            "    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));",
            "    ",
            "    float d = q.x - min(q.w, q.y);",
            "    float e = 1.0e-10;",
            "    return vec3(abs(( (q.z + (q.w - q.y) / (6.0 * d + e))) ), d / (q.x + e), q.x);",
            "}",

            "vec3 hsv2rgb(vec3 c)",
            "{",
            "    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);",
            "    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);",
            "    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);",
            "}",
            "float rand(vec2 p)",
            "{",
            "    vec2 n = floor(p/2.0);",
            "     return fract(cos(dot(n,vec2(48.233,39.645)))*375.42); ",
            "}",
            "float srand(vec2 p)",
            "{",
            "     vec2 f = floor(p);",
            "    vec2 s = smoothstep(vec2(0.0),vec2(1.0),fract(p));",
            "    ",
            "    return mix(mix(rand(f),rand(f+vec2(1.0,0.0)),s.x),",
            "           mix(rand(f+vec2(0.0,1.0)),rand(f+vec2(1.0,1.0)),s.x),s.y);",
            "}",
            "float noise(vec2 p)",
            "{",
            "     float total = srand(p/128.0)*0.5+srand(p/64.0)*0.35+srand(p/32.0)*0.1+srand(p/16.0)*0.05;",
            "    return total;",
            "}",
            "vec3 hueGradient(float t) {",
            "    vec3 p = abs(fract(t + vec3(1.0, 2.0 / 3.0, 1.0 / 3.0)) * 6.0 - 3.0);",
            "   return (clamp(p - 1.0, 0.0, 1.0));",
            "}",
            "float square(float s) { return s * s; }",
            "vec3 square(vec3 s) { return s * s; }",
            "vec3 neonGradient(float t) {",
            "   return clamp(vec3(t * 1.3 + 0.1, square(abs(0.43 - t) * 1.7), (1.0 - t) * 1.7), 0.0, 1.0);",
            "}",
            "vec3 heatmapGradient(float t) {",
            "   return (pow(t, 1.5) * 0.8 + 0.2) * vec3(smoothstep(0.0, 0.35, t) + t * 0.5, smoothstep(0.5, 1.0, t), max(1.0 - t * 1.7, t * 7.0 - 6.0));",
            "}",
            "vec3 electricGradient(float t) {",
            "    return clamp( vec3(t * 8.0 - 6.3, square(smoothstep(0.6, 0.9, t)), pow(t, 3.0) * 1.7), 0.0, 1.0);   ",
            "}",

            "void main()",
            "{",
            "    float t = time;",
            "    vec2 warp = vec2(noise(gl_FragCoord.xy+t)+noise(gl_FragCoord.xy*0.5+t*3.5),",
            "                     noise(gl_FragCoord.xy+128.0-t)+noise(gl_FragCoord.xy*0.6-t*2.5))*0.5-0.25;",
            // "    vec2 uv = gl_FragCoord.xy / resolution.xy+warp;",
            "    vec2 mW = warp*mouse;",
            "    vec2 uv = vUv+mW*sin(time);",
            "    vec4 look = texture2D(texture,uv);",
            "    vec2 offs = vec2(look.y-look.x,look.w-look.z)*vec2(mouse.x*uv.x/10.0, mouse.y*uv.y/10.0);",
            "    vec2 coord = offs+vUv;",
            "    vec4 repos = texture2D(texture, coord);",

            // "    gl_FragColor = repos;",
            "  vec4 tex0 = repos;",
            "  vec3 hsv = rgb2hsv(tex0.rgb);",
            "  hsv.r += 0.01;",
            "  //hsv.r = mod(hsv.r, 1.0);",
            "   ",
            "  hsv.g *= 1.001;",
            // "  // hsv.g = mod(hsv.g, 1.0);",
            "  vec3 rgb = hsv2rgb(hsv); ",
            // "  vec3 rgb = electricGradient(dot(tex0.rgb, vec3(1.0))); ",
            // "  vec3 rgb = electricGradient(hsv.r); ",

            "    vec2 q = vUv;",
            "    vec2 p = -1.0 + 2.0*q;",
            "    p.x *= resolution.x/resolution.y;",
            "    vec2 m = mouse;",
            "    m.x *= resolution.x/resolution.y;",
            "    float r = sqrt( dot((p - m), (p - m)) );",
            "    float a = atan(p.y, p.x);",
            "    vec3 col = texture2D(texture, vUv).rgb;",
            "    vec4 mask = texture2D(mask, vUv);",
            "    if(r < r2){",
            "        float f = smoothstep(r2, r2 - 0.5, r);",
            "        col = mix( col, rgb, f);",
            "    }",

            // "   vec4 alpha = texture2D(alpha, vUv);",
            // "   vec3 col = texture2D(texture, vUv).rgb;",
            // "   if(dot(mask.rgb, vec3(1.0))/3.0 > 0.1){",
            // "       col = mix( col, rgb, dot(alpha.rgb, vec3(1.0))/3.0);",
            // "       col = mix( col, rgb, dot(mask.rgb, vec3(1.0))/3.0);",
            // "   }",

            "gl_FragColor = vec4(col,1.0);",

            // "    gl_FragColor = vec4(col,1.0);",
            "}"
        ].join("\n")
}
var GlitchShader = function(){
        this.uniforms = THREE.UniformsUtils.merge([
            {
                "texture"  : { type: "t", value: null },
                "origTex"  : { type: "t", value: null },
                "alpha"  : { type: "t", value: null },
                "mouse"  : { type: "v2", value: null },
                "mask"  : { type: "t", value: null },
                "resolution"  : { type: "v2", value: null },
                "time"  : { type: "f", value: null },
                "r2"  : { type: "f", value: null }

            }
        ]);
        this.vertexShader = [

            "varying vec2 vUv;",
            "void main() {",
            "    vUv = uv;",
            "    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
            "}"
        
        ].join("\n");
        
        this.fragmentShader = [
            
            "uniform sampler2D texture;",
            "uniform sampler2D alpha;",
            "uniform sampler2D origTex;",
            "uniform sampler2D mask;",
            "uniform vec2 resolution;",
            "uniform vec2 mouse;",
            "uniform float r2;",
            "uniform float time;",
            "varying vec2 vUv;",
            "float sat( float t ) {",
            "	return clamp( t, 0.0, 1.0 );",
            "}",
            "vec2 sat( vec2 t ) {",
            "	return clamp( t, 0.0, 1.0 );",
            "}",
            "// vec3 sat( vec3 v ) {",
            "	// return clamp( v, 0.0f, 1.0f );",
            "// }",
            "//remaps inteval [a;b] to [0;1]",
            "float remap( float t, float a, float b ) {",
            "	return sat( (t - a) / (b - a) );",
            "}",
            "//note: /\ t=[0;0.5;1], y=[0;1;0]",
            "float linterp( float t ) {",
            "	return sat( 1.0 - abs( 2.0*t - 1.0 ) );",
            "}",
            "//note: [0;1]",
            "float rand( vec2 n ) {",
            "  return fract(sin(dot(n.xy, vec2(12.9898, 78.233)))* 43758.5453);",
            "}",
            "//note: [-1;1]",
            "float srand( vec2 n ) {",
            "	return rand(n) * 2.0 - 1.0;",
            "}",
            "float trunc( float x, float num_levels )",
            "{",
            "	return floor(x*num_levels) / num_levels;",
            "}",
            "vec2 trunc( vec2 x, vec2 num_levels )",
            "{",
            "	return floor(x*num_levels) / num_levels;",
            "}",
            "vec3 rgb2yuv( vec3 rgb )",
            "{",
            "	vec3 yuv;",
            "	yuv.x = dot( rgb, vec3(0.299,0.587,0.114) );",
            "	yuv.y = dot( rgb, vec3(-0.14713, -0.28886, 0.436) );",
            "	yuv.z = dot( rgb, vec3(0.615, -0.51499, -0.10001) );",
            "	return yuv;",
            " }",
            " vec3 yuv2rgb( vec3 yuv )",
            " {",
            "	vec3 rgb;",
            "	rgb.r = yuv.x + yuv.z * 1.13983;",
            "	rgb.g = yuv.x + dot( vec2(-0.39465, -0.58060), yuv.yz );",
            "	rgb.b = yuv.x + yuv.y * 2.03211;",
            "	return rgb;",
            " }",
            "void main() {",

                "vec3 col = texture2D(texture, vUv).rgb;",
                "vec4 alpha = texture2D(alpha, vUv);",
                "vec4 mask = texture2D(mask, vUv);",

            	// float THRESHOLD = 0.1 + iMouse.x / iResolution.x;
            	"	float THRESHOLD = 0.5;",
            	"	float time_s = mod( time, 32.0 );",
            	"	float glitch_threshold = 1.0 - THRESHOLD;",
            	"	const float max_ofs_siz = 0.1; //TOOD: input",
            	"	const float yuv_threshold = 0.5; //TODO: input, >1.0f == no distort",
            	"	const float time_frq = 16.0;",
            	"	// vec2 uv = fragCoord.xy / iResolution.xy;",
            	"	vec2 uv = vUv;",
            		
            	"	const float min_change_frq = 4.0;",
            	"	float ct = trunc( time_s, min_change_frq );",
            	"	float change_rnd = rand( trunc(uv.yy,vec2(16)) + 150.0 * ct );",
            	"	float tf = time_frq*change_rnd;",
            	"	float t = 5.0 * trunc( time_s, tf );",
            	"	float vt_rnd = 0.5*rand( trunc(uv.yy + t, vec2(11)) );",
            	"	vt_rnd += 0.5 * rand(trunc(uv.yy + t, vec2(7)));",
            	"	vt_rnd = vt_rnd*2.0 - 1.0;",
            	"	vt_rnd = sign(vt_rnd) * sat( ( abs(vt_rnd) - glitch_threshold) / (1.0-glitch_threshold) );",
            	"	vec2 uv_nm = uv;",
            	"	uv_nm = sat( uv_nm + vec2(max_ofs_siz*vt_rnd, 0) );",
            	"	float rnd = rand( vec2( trunc( time_s, 8.0 )) );",
            	"	uv_nm.y = (rnd>mix(1.0, 0.975, sat(THRESHOLD))) ? 1.0-uv_nm.y : uv_nm.y;",
            	"	vec4 sample = texture2D( texture, uv_nm, -10.0 );",
            	// "	vec3 sample_yuv = rgb2yuv( sample.rgb );",
            	// "	sample_yuv.y /= 1.0-3.0*abs(vt_rnd) * sat( yuv_threshold - vt_rnd );",
            	// "	sample_yuv.z += 0.125 * vt_rnd * sat( vt_rnd - yuv_threshold );",
            	// "	vec4 col2 = vec4( yuv2rgb(sample_yuv), sample.a );",
            	"	vec4 col2 = vec4( sample.rgb, sample.a );",
            	"   col = mix( col, col2.rgb, dot(alpha.rgb, vec3(1.0))/3.0);",
            	"gl_FragColor = vec4(col, 1.0);",
            "}"


        
        ].join("\n");
}
var GlitchShader2 = function(){
        this.uniforms = THREE.UniformsUtils.merge([
            {
                "texture"  : { type: "t", value: null },
                "noise"  : { type: "t", value: null },
                "origTex"  : { type: "t", value: null },
                "alpha"  : { type: "t", value: null },
                "mouse"  : { type: "v2", value: null },
                "mask"  : { type: "t", value: null },
                "resolution"  : { type: "v2", value: null },
                "time"  : { type: "f", value: null },
                "r2"  : { type: "f", value: null }

            }
        ]);
        this.vertexShader = [

            "varying vec2 vUv;",
            "void main() {",
            "    vUv = uv;",
            "    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
            "}"
        
        ].join("\n");
        
        this.fragmentShader = [
            
            "uniform sampler2D texture;",
            "uniform sampler2D alpha;",
            "uniform sampler2D noise;",
            "uniform sampler2D origTex;",
            "uniform sampler2D mask;",
            "uniform vec2 resolution;",
            "uniform vec2 mouse;",
            "uniform float r2;",
            "uniform float time;",
            "varying vec2 vUv;",
            "void main()",
            "{",
            "	vec2 uv = vUv;",
            "vec3 col = texture2D(texture, vUv).rgb;",
            "vec4 alpha = texture2D(alpha, vUv);",
            // "vec4 mask = texture2D(mask, vUv);",
            "	vec2 fc = gl_FragCoord.xy;",
            "	vec2 block = floor(fc / vec2(16));",
            "	vec2 uv_noise = block / vec2(64);",
            "	uv_noise += floor(vec2(time*0.1) * vec2(1234.0, 3543.0)) / vec2(64);",
            "	",
            "	float block_thresh = pow(fract((time*0.1) * 1236.0453), 2.0) * 0.5;",
            // "	float block_thresh = 0.2;",
            "	float line_thresh = pow(fract((time*0.1) * 2236.0453), 3.0) * 0.7;",
            // "	float line_thresh = 0.2;",
            "	",
            "	vec2 uv_r = uv, uv_g = uv, uv_b = uv;",

            "	// glitch some blocks and lines",
            // "	if (texture2D(noise, uv_noise).r < block_thresh ||",
            // "		texture2D(noise, vec2(uv_noise.y, 0.0)).g < line_thresh) {",

            "		vec2 dist = (fract(uv_noise) - 0.5) * 0.3;",
            "		uv_r += dist * 0.1;",
            "		uv_g += dist * 0.2;",
            "		uv_b += dist * 0.125;",
            // "	}",

            "	vec3 col2;",
            "	col2.r = texture2D(texture, uv_r).r;",
            "	col2.g = texture2D(texture, uv_g).g;",
            "	col2.b = texture2D(texture, uv_b).b;",

            "	// loose luma for some blocks",
            // "	if (texture2D(noise, uv_noise).g < block_thresh)",
            // "		col2.rgb = col2.ggg;",

            "	// discolor block lines",
            // "	if (texture2D(noise, vec2(uv_noise.y, 0.0)).b * 3.5 < line_thresh)",
            // "		col2.rgb = vec3(0.0, dot(col2.rgb, vec3(1.0)), 0.0);",

            "	// interleave lines in some blocks",
            "	if (texture2D(noise, uv_noise).g * 2.5 < block_thresh ){",
            // "		texture2D(noise, vec2(uv_noise.y, 0.0)).g * 2.5 < line_thresh) {",
            "		float line = fract(fc.y / 3.0);",
            "		vec3 mask = vec3(3.0, 0.0, 0.0);",
            "		if (line > 0.333)",
            "			mask = vec3(0.0, 3.0, 0.0);",
            "		if (line > 0.666)",
            "			mask = vec3(0.0, 0.0, 3.0);",
            "		",
            "		col2.xyz *= mask;",
            "	}",
        	"   col = mix( col, col2.rgb, dot(alpha.rgb, vec3(1.0))/3.0);",
        	"	gl_FragColor = vec4(col.rgb, 1.0);",
            "}",


        
        ].join("\n");
}
var GlitchShader3 = function(){
        this.uniforms = THREE.UniformsUtils.merge([
            {
                "texture"  : { type: "t", value: null },
                "noise"  : { type: "t", value: null },
                "noise2"  : { type: "t", value: null },
                "origTex"  : { type: "t", value: null },
                "alpha"  : { type: "t", value: null },
                "mouse"  : { type: "v2", value: null },
                "mask"  : { type: "t", value: null },
                "resolution"  : { type: "v2", value: null },
                "time"  : { type: "f", value: null },
                "r2"  : { type: "f", value: null }

            }
        ]);
        this.vertexShader = [

            "varying vec2 vUv;",
            "void main() {",
            "    vUv = uv;",
            "    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
            "}"
        
        ].join("\n");
        
        this.fragmentShader = [
            
            "uniform sampler2D texture;",
            "uniform sampler2D alpha;",
            "uniform sampler2D noise;",
            "uniform sampler2D noise2;",
            "uniform sampler2D origTex;",
            "uniform sampler2D mask;",
            "uniform vec2 resolution;",
            "uniform vec2 mouse;",
            "uniform float r2;",
            "uniform float time;",
            "varying vec2 vUv;",
            
            "#define pi 3.1415926",

            "//float t = fract(time / 10.0) * 10.0;",

            "vec3 colorSplit(vec2 uv, vec2 s)",
            "{",
            "    vec3 color;",
            "    color.r = texture2D(texture, uv/* - s*/).r;",
            "    color.g = texture2D(texture, uv    ).g;",
            "    color.b = texture2D(texture, uv/* + s*/).b;",
            "    return color;",
            "}",

            "vec2 interlace(vec2 uv, float s)",
            "{",
            "    uv.x += s * (4.0 * fract((uv.y * resolution.y) / 2.0) - 1.0);",
            "    return uv;",
            "}",

            "vec2 fault(vec2 uv, float s)",
            "{",
            "    //float v = (0.5 + 0.5 * cos(2.0 * pi * uv.y)) * (2.0 * uv.y - 1.0);",
            "    float v = pow(0.5 - 0.5 * cos(2.0 * pi * uv.y), 100.0) * sin(2.0 * pi * uv.y);",
            "    uv.x += v * s;",
            "    return uv;",
            "}",

            "vec2 rnd(vec2 uv, float s)",
            "{",
            "    uv.x += s * (2.0 * texture2D(noise2, uv * 0.05).x - 1.0);",
            "    return uv;",
            "}",

            "void main(){",
            "	float t = time / 10.0;",
        	"	vec2 uv = vUv;",
        	"	vec3 col = texture2D(texture, vUv).rgb;",
        	"	vec4 alpha = texture2D(alpha, vUv);",
        	"	vec4 mask = texture2D(mask, vUv);",            
            "    //float s = pow(0.5 + 0.5 * cos(2.0 * pi * t), 1000.0);",
            "    float s = texture2D(noise2, vec2(t * 0.2, 0.5)).r;",
            "    ",
            "   // uv = interlace(uv, s * 0.005);",
            "    //uv = fault(uv, s);",
            "    float r = texture2D(noise, vec2(t, 0.0)).x;",
            "    //uv = fault(uv + vec2(0.0, fract(t * 20.0)), r) - vec2(0.0, fract(t * 20.0));",
            "    uv = fault(uv + vec2(0.0, fract(t * 2.0)), 5.0 * sign(r) * pow(abs(r), 5.0)) - vec2(0.0, fract(t * 2.0));",
            "    uv = rnd(uv, s * 0.02);",
            "    ",
            "    vec3 color = colorSplit(uv, vec2(s * 0.02, 0.0));",
            "    //vec2 m = texture2D(noise, uv).xy;",
            "    //color = mix(color, texture2D(noise2, 0.5 * uv + t * 100.0).rgb, 0.25);",
            "    ",
            "   col = mix( col, color, dot(alpha.rgb, vec3(1.0))/3.0);",

            "	gl_FragColor = vec4(col, 1.0);",
            "}",



        
        ].join("\n");
}
var GlitchShader4 = function(){
        this.uniforms = THREE.UniformsUtils.merge([
            {
                "texture"  : { type: "t", value: null },
                "origTex"  : { type: "t", value: null },
                "alpha"  : { type: "t", value: null },
                "noise"  : { type: "t", value: null },
                "mouse"  : { type: "v2", value: null },
                "mask"  : { type: "t", value: null },
                "resolution"  : { type: "v2", value: null },
                "time"  : { type: "f", value: null },
                "r2"  : { type: "f", value: null }

            }
        ]);
        this.vertexShader = [

            "varying vec2 vUv;",
            "void main() {",
            "    vUv = uv;",
            "    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
            "}"
        
        ].join("\n");
        
        this.fragmentShader = [
            
            "uniform sampler2D texture;",
            "uniform sampler2D alpha;",
            "uniform sampler2D origTex;",
            "uniform sampler2D mask;",
            "uniform sampler2D noise;",
            "uniform vec2 resolution;",
            "uniform vec2 mouse;",
            "uniform float r2;",
            "uniform float time;",
            "varying vec2 vUv;",
			"float pinLight( float s, float d )",
			"{",
			"   return (2.0 * s - 1.0 > d) ? 2.0 * s - 1.0 : (s < 0.5 * d) ? 2.0 * s : d;",
			"}",

			"vec3 pinLight( vec3 s, vec3 d )",
			"{",
			"   vec3 c;",
			"   c.x = pinLight(s.x,d.x);",
			"   c.y = pinLight(s.y,d.y);",
			"   c.z = pinLight(s.z,d.z);",
			"   return c;",
			"}",
			"float overlay( float s, float d )",
			"{",
			"   return (d < 0.5) ? 2.0 * s * d : 1.0 - 2.0 * (1.0 - s) * (1.0 - d);",
			"}",
			"vec3 overlay( vec3 s, vec3 d )",
			"{",
			"   vec3 c;",
			"   c.x = overlay(s.x,d.x);",
			"   c.y = overlay(s.y,d.y);",
			"   c.z = overlay(s.z,d.z);",
			"   return c;",
			"}",
			"float sat( float t ) {",
			"	return clamp( t, 0.0, 1.0 );",
			"}",
			"vec2 sat( vec2 t ) {",
			"	return clamp( t, 0.0, 1.0 );",
			"}",
			"// vec3 sat( vec3 v ) {",
			"	// return clamp( v, 0.0f, 1.0f );",
			"// }",

			"//remaps inteval [a;b] to [0;1]",
			"float remap( float t, float a, float b ) {",
			"	return sat( (t - a) / (b - a) );",
			"}",

			"//note: /\ t=[0;0.5;1], y=[0;1;0]",
			"float linterp( float t ) {",
			"	return sat( 1.0 - abs( 2.0*t - 1.0 ) );",
			"}",

			"//note: [0;1]",
			"float rand( vec2 n ) {",
			"  return fract(sin(dot(n.xy, vec2(12.9898, 78.233)))* 43758.5453);",
			"}",

			"//note: [-1;1]",
			"float srand( vec2 n ) {",
			"	return rand(n) * 2.0 - 1.0;",
			"}",

			"float trunc( float x, float num_levels )",
			"{",
			"	return floor(x*num_levels) / num_levels;",
			"}",
			"vec2 trunc( vec2 x, vec2 num_levels )",
			"{",
			"	return floor(x*num_levels) / num_levels;",
			"}",

			"vec3 rgb2yuv( vec3 rgb )",
			"{",
			"	vec3 yuv;",
			"	yuv.x = dot( rgb, vec3(0.299,0.587,0.114) );",
			"	yuv.y = dot( rgb, vec3(-0.14713, -0.28886, 0.436) );",
			"	yuv.z = dot( rgb, vec3(0.615, -0.51499, -0.10001) );",
			"	return yuv;",
			" }",
			" vec3 yuv2rgb( vec3 yuv )",
			" {",
			"	vec3 rgb;",
			"	rgb.r = yuv.x + yuv.z * 1.13983;",
			"	rgb.g = yuv.x + dot( vec2(-0.39465, -0.58060), yuv.yz );",
			"	rgb.b = yuv.x + yuv.y * 2.03211;",
			"	return rgb;",
			" }",

			"void main()",
			"{",

			"vec3 col = texture2D(texture, vUv).rgb;",
			"vec4 alpha = texture2D(alpha, vUv);",
			"vec4 mask = texture2D(mask, vUv);",
			// "	float THRESHOLD = 0.1 + iMouse.x / iResolution.x;",
			"	float THRESHOLD = 0.5;",
			"	float time_s = mod( time, 32.0 );",

			// "	float glitch_threshold = 1.0 - THRESHOLD;",
			"	float glitch_threshold = 0.0;",
			"	const float max_ofs_siz = 0.1; //TOOD: input",
			"	const float yuv_threshold = 1.5; //TODO: input, >1.0f == no distort",
			"	const float time_frq = 16.0;",

			// "	vec2 uv = fragCoord.xy / iResolution.xy;",
			"	vec2 uv = vUv;",
			"	vec2 noiseUv = -1.0 + 2.0*vUv;",
			"	noiseUv.x *= resolution.x/resolution.y;",
			"	vec4 noise = texture2D(noise, noiseUv);",

			"	",
			"	const float min_change_frq = 4.0;",
			"	float ct = trunc( time_s, min_change_frq );",
			"	float change_rnd = rand( trunc(uv.xy,vec2(4.0)) * ct );",

			"	float tf = time_frq*change_rnd;",

			"	float t = 5.0 * trunc( time_s, tf );",
			"	float vt_rnd = 0.5*rand( trunc(uv.xy + t, vec2(2.0)) );",
			// "	vt_rnd += 0.5 * rand(trunc(uv.xy + t, vec2(1)));",
			// "	vt_rnd = vt_rnd*2.0 - 1.0;",
			// "	vt_rnd = sign(vt_rnd) * sat( ( abs(vt_rnd) - glitch_threshold) / (1.0-glitch_threshold) );",

			"	vec2 uv_nm = uv;",
			"	uv_nm = uv_nm+vec2(vt_rnd*0.25, 0)*(1.0 - uv.x);",
			"	uv_nm = sat( uv_nm + vec2(max_ofs_siz*vt_rnd, 0)*(1.0 - uv.x) );",

			"	float rnd = rand( vec2( trunc( time_s, 8.0 )) );",
			"	//uv_nm.y = (rnd>mix(1.0, 0.975, sat(THRESHOLD))) ? 1.0-uv_nm.y : uv_nm.y;",
			"    //uv_nm.x = (rnd>mix(1.0, 0.975, sat(THRESHOLD))) ? 1.0-uv_nm.x : uv_nm.x;",

			"    ",
			"    vec4 color = texture2D(texture, uv);",
			"	vec4 sample = texture2D(texture, uv_nm);",
			"   sample.r *= rand(vec2(uv_nm*sample.r))*1.2;//*sat(vt_rnd - yuv_threshold);",
			"	sample.g *= rand(vec2(uv_nm*sample.g))*1.2;//*sat(vt_rnd - yuv_threshold);",
			"	sample.b *= rand(vec2(uv_nm*sample.b))*1.2;//*sat(vt_rnd - yuv_threshold);",
			// "    sample.rgb = mix(noise.rgb, sample.rgb, 0.5)*vt_rnd*1.0;//*sat(vt_rnd - yuv_threshold);",
			// "    sample.rgb = mix(sample.rgb, noise.rgb, 0.5);",
			"   sample.rgb = max(sample.rgb,color.rgb);",
			"    sample.rgb = pinLight(sample.rgb, color.rgb);",
			"	//vec3 sample_yuv = rgb2yuv( sample.rgb );",
			"	//sample_yuv.y /= 1.0-3.0*abs(vt_rnd);// * sat( yuv_threshold - vt_rnd );",
			"	//sample_yuv.z += 0.125 * vt_rnd;// * sat( vt_rnd - yuv_threshold );",
			// "	gl_FragColor = vec4( sample.rgb, sample.a );",
        	"	vec4 col2 = vec4( sample.rgb, sample.a );",
        	"   col = mix( col, col2.rgb, dot(alpha.rgb, vec3(1.0))/3.0);",
        	"gl_FragColor = vec4(col, 1.0);",

			"    ",
			"}",



        
        ].join("\n");
}