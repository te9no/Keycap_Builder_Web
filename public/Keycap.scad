text_size = 5.5;
text_shift_size = 4;
text_fn_size = 4;
height = 0.01;
digHeight = 2;
c = "center";
f = "Inter 18pt Noto";
modelPath = "MODEL_PATH";
centerRotation = CENTER_ROTATION;

color("White", 1)
{
    import(modelPath);
}

difference()
{
    translate([ 0, 0, -digHeight + height ])
    {
        linear_extrude(digHeight)
        {
            translate([ -4.6, 3.7, 0 ]) text("LLT",
                                             size = text_shift_size,
                                             valign = c,
                                             halign = c,
                                             font = f);
            translate([ len("LLB") > 1 ? -7 : -4.6, -3, 0 ])
                text("LLB",
                     size = text_size,
                     valign = c,
                     halign = len("LLB") > 1 ? "left" : c,
                     font = f);
            translate([ 3.5, 3.7, 0 ]) text(
                "LRT", size = text_fn_size, valign = c, halign = c, font = f);
            rotate([ 0, 0, -centerRotation])
                text("LC", size = text_size, valign = c, halign = c, font = f);
        }
    }

    translate([ 0, 0, height ])
    {
        difference()
        {
            translate([ 0, 0, -0.5 ]) cube([ 20, 20, 1 ], center = true);

            intersection()
            {
                import(modelPath);
                translate([ 0, 0, -0.5 ]) cube([ 20, 20, 1 ], center = true);
            }
        }
    }
    import(modelPath);
    translate([ 0, 0, -1 ]) import(modelPath);
}