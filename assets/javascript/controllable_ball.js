var CBall = function(){};

CBall.prototype = new Ball();

CBall.prototype.init = function(ctx, width, height) {
  this.ctx = ctx;
  this.x = width/2;
  this.r = 30;
  this.y = height - this.r;
  this.setColor("#0e0");
  this.sceneWidth = width;
  this.sceneHeight = height;
  this.bgColor = "#333";
};

CBall.prototype.updatePosition = function(x, y){
  this.x = x;
  this.y = y;
  this.applyLimits();
};

CBall.prototype.applyLimits = function(){
  if(this.x < this.r){
    this.x = this.r;
  }else if(this.x > this.sceneWidth - this.r){
    this.x = this.sceneWidth - this.r;
  };
  
  if(this.y > this.sceneHeight - this.r){
    this.y = this.sceneHeight - this.r;
  }else if(this.y < this.sceneHeight - this.areaHeight()){
    this.y = this.sceneHeight - this.areaHeight();
  };
};

CBall.prototype.areaHeight = function(){
  return 4 * this.r;
};