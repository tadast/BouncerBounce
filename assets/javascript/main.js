// shim layer with setTimeout fallback
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       || 
          window.webkitRequestAnimationFrame || 
          window.mozRequestAnimationFrame    || 
          window.oRequestAnimationFrame      || 
          window.msRequestAnimationFrame     || 
          function(/* function */ callback, /* DOMElement */ element){
            window.setTimeout(callback, 1000 / 60);
          };
})();

function animate(time) {
    requestAnimFrame(animate);
    game.draw(time);
};

function playerInput(e) {
  e.preventDefault();
  var touches = e.changedTouches;
  if (touches !== undefined){
    var touch = touches[0];
    game.player.updatePosition(touch.clientX, touch.clientY);
  } else {
    game.player.updatePosition(e.x, e.y);
  };
};

var Bouncer = function(){
  this.scene = document.getElementById('scene');
  this.ctx = this.scene.getContext("2d");
  this.ball = new Ball();
  this.ball.init(this.ctx, this.scene.width, this.scene.height);

  this.goalKeeper = new Ball();
  this.goalKeeper.init(this.ctx, this.scene.width, this.scene.height);
  this.goalKeeper.setVelocity(1.5, 0);
  this.goalKeeper.setColor("#ef0");
  this.goalKeeper.moveTo(210, 30);

  this.player = new CBall();
  this.player.init(this.ctx, this.scene.width, this.scene.height);

  this.scene.addEventListener('mousemove', playerInput, false);
  this.scene.addEventListener('touchmove', playerInput, false);
  
  this.frameTime = 17; //miliseconds
  
  var bouncer = this;
  this.lastFrameAt = Date.now();
  this.compensator = 1.0;
};

Bouncer.prototype.constructor = Bouncer;

Bouncer.prototype.clearScene = function(){
  this.ctx.clearRect(0, this.player.limitY("upper"), this.scene.width, this.player.areaHeight() + this.player.r);
  this.goalKeeper.clearOld();
  this.ball.clearOld();

  // stroke lines marking controllable area
  this.strokeLimits();
};

Bouncer.prototype.draw = function(time){
  Bouncer.prototype.calculateCompensator(time);
  this.processCollisions();
  this.clearScene();

  this.goalKeeper.applyVelocity(this.compensator);
  this.goalKeeper.draw();
  
  this.ball.applyVelocity(this.compensator);
  this.ball.draw();
  
  this.player.draw();
};

Bouncer.prototype.processCollisions = function(){
  if(this.ball.collidesWith(this.goalKeeper)){
    this.ball.onCollisionWith(this.goalKeeper);
  };
  if(this.ball.collidesWith(this.player)){
    this.ball.onCollisionWith(this.player);
  };
};

// compensator compensates graphics lag to keep the game pace
// consistent over the time and across different devices.
Bouncer.prototype.calculateCompensator = function(now){
  game.compensator = ((now - game.lastFrameAt) / game.frameTime) || 1;
  game.lastFrameAt = now;
  return game.compensator;
};

Bouncer.prototype.strokeLimits = function(){
  this.ctx.lineWidth = 0.1;  
  this.ctx.strokeStyle = this.player.color;
  this.ctx.moveTo(0, this.player.limitY("upper"));
  this.ctx.lineTo(this.scene.width, this.player.limitY("upper"));
  this.ctx.stroke();
  
  this.ctx.lineWidth = 0.1;
  this.ctx.strokeStyle = this.goalKeeper.color;
  this.ctx.moveTo(0, this.player.areaHeight() + this.goalKeeper.r);
  this.ctx.lineTo(this.scene.width, this.player.areaHeight() + this.goalKeeper.r);
  this.ctx.stroke();
};

window.onload = function init(){
  game = new Bouncer();
  animate();
};