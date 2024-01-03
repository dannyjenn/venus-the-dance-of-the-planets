// The Dance of Venus

// For the sake of simplicity, the orbits shall be represented as circles rather than ellipses.
// Also, the radius of the sun, earth, and Venus shall be completely ignored.
// This will result in a model that is "close enough" for my purposes, although it will not be exact.

const c = document.getElementById("myCanvas");
const ctx = c.getContext("2d");

const radius = c.width / 2; // half the width of the canvas (in pixels)

// The following values can be changed to your liking.
// Rather than me trying to explain what these values do, you are better off just playing with it.
// Recommended values:     true, false, false,  true, false, false,  true    (for geocentric)
//                 or:    false, false,  true,  true,  true, false,  true    (for heliocentric)
var geocentric =  true; // whether or not to use the geocentric model
var use_colors = false; // whether to use distinct colors for the eath, sun, and Venus; or white for everything
var draw_earth = false; // whether or not to draw the earth
var draw_venus =  true; // whether or not to draw Venus
var use_lines =  false; // whether or not to draw a line between earth and Venus each day
var draw_sun =   false; // whether or not to draw the sun
var leave_trail = true; // whether or not to draw the trail

// Now we will position the sun, earth, and Venus.

var distance_from_sun_to_venus = 0.723332 * radius; // 0.72333 astronomical units ( https://en.wikipedia.org/wiki/Venus )
var distance_from_sun_to_earth = 1.000000 * radius; // 1 astronomical unit ( by definition )

if(geocentric){ // if using the geocentric model
    // the earth is placed at the center of the canvas
    earth_x = c.width  / 2;
    earth_y = c.height / 2;

    // do some ad hoc calculations:  (otherwise the geocentric version doesn't fit on the canvas)
    var new_radius = (distance_from_sun_to_earth + distance_from_sun_to_venus);
    distance_from_sun_to_earth *= (radius/new_radius);
    distance_from_sun_to_venus *= (radius/new_radius);

    // the sun is positioned relative to the earth
    sun_x = earth_x;
    sun_y = earth_y + distance_from_sun_to_earth;

    // Venus is positioned relative to the sun
    venus_x = sun_x;
    venus_y = sun_y - distance_from_sun_to_venus;
}
else{ // if using the heliocentric model
    // the sun is placed at the center of the canvas
    sun_x = c.width /  2;
    sun_y = c.height / 2;

    // the earth and Venus are positioned relative to the sun
    earth_x = sun_x;
    earth_y = sun_y + distance_from_sun_to_earth;
    venus_x = sun_x;
    venus_y = sun_y + distance_from_sun_to_venus;
}

const radians_per_degree = (2*Math.PI)/360; // 1 degree equals (2 pi / 360) radians

const venus__degrees_per_day = (1/224.701)*360; // https://en.wikipedia.org/wiki/Venus
const earth__degrees_per_day = (1/365.256)*360; // https://en.wikipedia.org/wiki/Earth

var t = 0; // time (in days)


// The drawing shall be white on black.

// fill the background with black
ctx.fillStyle = "#000000";
ctx.fillRect(0,0,c.width,c.height);

// set the color to white and the pen size to 0.1 pixels (very thin)
ctx.fillStyle = "#FFFFFF";
ctx.strokeStyle = "#FFFFFF";
ctx.lineWidth = 0.1;

function draw(){
    // This function is called once per "day".
    // First the positions of the earth, sun, and Venus are updated.
    // Then everything is drawn.
  
    t += 1; // add a "day" to the count

    if(geocentric){
        // On the geocentric model, the earth is stationary.
        // the sun moves relative to the earth
        sun_x = earth_x + Math.sin((t*earth__degrees_per_day)*radians_per_degree)*(distance_from_sun_to_earth);
        sun_y = earth_y + Math.cos((t*earth__degrees_per_day)*radians_per_degree)*(distance_from_sun_to_earth);
    }
    else{
        // On the heliocentric model, the sun is stationary.
        // the earth moves relative to the sun
        earth_x = sun_x + Math.sin((t*earth__degrees_per_day)*radians_per_degree)*(distance_from_sun_to_earth);
        earth_y = sun_y + Math.cos((t*earth__degrees_per_day)*radians_per_degree)*(distance_from_sun_to_earth);
    }

    // Venus moves relative to the sun
    venus_x = sun_x + Math.sin((t*venus__degrees_per_day)*radians_per_degree)*(distance_from_sun_to_venus);
    venus_y = sun_y + Math.cos((t*venus__degrees_per_day)*radians_per_degree)*(distance_from_sun_to_venus);
    
    // Here begins the actual drawing code.
    
    if(leave_trail==false){
        // If we are not leaving a trail, then we need to clear the screen with black.
        ctx.fillStyle = "#000000";
        ctx.fillRect(0,0,c.width,c.height);
    }

    if(draw_venus){
        if(use_colors){ // if using colors, we need to change the pen color
            ctx.fillStyle = "#FFFFCF"; // Venus will be colored a light yellow (#FFFFCF)
        }
        // draw a dot where Venus is
        ctx.beginPath();
        ctx.arc(venus_x,venus_y,1,0,2*Math.PI,true);
        ctx.closePath();
        ctx.fill();
    }

    if(draw_earth){
        if(use_colors){ // if using colors, we need to change the pen color
            ctx.fillStyle = "#CFFFFF"; // Earth will be colored a light cyan (#CFFFFF)
        }
        // draw a dot where the earth is
        ctx.beginPath();
        ctx.arc(earth_x,earth_y,1,0,2*Math.PI,true);
        ctx.closePath();
        ctx.fill();
    }

    if(draw_sun){
        if(use_colors){ // if using colors, we need to change the pen color
            ctx.fillStyle = "#FFFF00"; // the sun will be colored pure yellow (#FFFF00)
        }
        // draw a dot where the sun is
        ctx.beginPath();
        ctx.arc(sun_x,sun_y,1,0,2*Math.PI,true);
        ctx.closePath();
        ctx.fill();
    }
    
    if(use_lines){
        // draw a line from earth to Venus
        ctx.beginPath();
        ctx.moveTo(earth_x,earth_y);
        ctx.lineTo(venus_x,venus_y);
        ctx.closePath();
        ctx.stroke();
    }

    // Loop for eight "years" (not in real time)
    if(t<(365.256*8)){
        setTimeout(function(){ draw(); },20); // draw() will be called again in 20 milliseconds (if the CPU can keep up)
    }
    else{
        // When eight "years" have passed, the loop ends; and the canvas is converted into an image.
        var img = c.toDataURL();
        document.getElementById("canvasImage").src = img;
        document.getElementById("canvasImage").hidden = false;
        document.getElementById("myCanvas").hidden = true;
    }
}

draw(); // this begins the loop
