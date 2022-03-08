var mongoose = require("mongoose");

var aboutMeSchema = new mongoose.Schema({
    paragraphOne : { type: String, default: "Based out of Chicago, I'm a photographer, and filmmaker and When not immersed into creative work, I keep myself busy with a lot of engineering work."},
    paragraphTwo : { type: String, default: "I enjoy travelling and adventures,so if you would like to give me a reason to travel, I would love hop on board to shoot brand campaigns, engagements, weddings, you name it. I'm always looking for a new challenge to take on. Nothing is more fulfilling than to collaborate to create truly unique content.Let's work together!" }
});

module.exports = mongoose.model("aboutMe", aboutMeSchema);