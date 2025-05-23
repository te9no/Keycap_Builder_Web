text_size = 5.5;
text_shift_size = 4;
text_fn_size = 4;
height = 0.01;
digHeight = 2;
c = "center";
f = "Inter 18pt Noto";
modelPath = "MODEL_PATH";
centerRotation = CENTER_ROTATION;
needBump = NEED_BUMP;

module bump(radius, width, height, fs = 0.2) {
  difference() {
    translate([ 0, 0, height ]) {
      union() {
        rotate([ 0, 90, 0 ])
            cylinder(h = width, r = radius, $fs = fs, center = true);
        rotate([ 0, 90, 0 ]) translate([ 0, 0, width / 2 ])
            sphere(r = radius, $fs = fs);
        rotate([ 0, 90, 0 ]) translate([ 0, 0, -width / 2 ])
            sphere(r = radius, $fs = fs);
        translate([ -width / 2, 0, -height / 2 ])
            cylinder(h = height, r = radius, $fs = fs, center = true);
        translate([ width / 2, 0, -height / 2 ])
            cylinder(h = height, r = radius, $fs = fs, center = true);
        translate([ 0, 0, -height / 2 ])
            cube([ width, radius * 2, height ], center = true);
      }
    }

    translate([ 0, 0, -radius / 2 ]) cube([ 100, 100, radius ], center = true);
  }
}

import(modelPath);

// text
difference() {
  translate([ 0, 0, -digHeight + height ]) {
    linear_extrude(digHeight) {
      translate([ -4.6, 3.7, 0 ])
          text("LLT", size = text_shift_size, valign = c, halign = c, font = f);
      translate([ len("LLB") > 1 ? -7 : -4.6, -3, 0 ])
          text("LLB", size = text_size, valign = c,
               halign = len("LLB") > 1 ? "left" : c, font = f);
      translate([ 3.5, 3.7, 0 ])
          text("LRT", size = text_fn_size, valign = c, halign = c, font = f);
      rotate([ 0, 0, -centerRotation ])
          text("LC", size = text_size, valign = c, halign = c, font = f);
    }
  }

  translate([ 0, 0, height ]) {
    difference() {
      translate([ 0, 0, -0.5 ]) cube([ 18, 18, 1 ], center = true);

      intersection() {
        import(modelPath);
        translate([ 0, 0, -0.5 ]) cube([ 18, 18, 1 ], center = true);
      }
    }
  }
  import(modelPath);
  translate([ 0, 0, -1 ]) import(modelPath);
}

// finger bump
if (needBump) {
  if (modelPath == "Cap_U.stl" || modelPath == "Cap_O.stl") {
    translate([ 0, -6, -1.5 ]) bump(0.5, 4, 1);
  } else if (modelPath == "Cap_Flat.stl") {
    translate([ 0, -6, -0.5 ]) bump(0.5, 4, 1);
  } else {
    translate([ 0, -6, 0.5 ]) bump(0.5, 4, 1);
  }
}