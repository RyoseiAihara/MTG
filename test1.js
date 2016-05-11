//
//
//グローバル変数,配列,オブジェクトなど
//
//
var my_hand_cards = [];
var op_hand_cards = [];
var life = 20;
var my_turn = 0;
var attacker = [];
var stack = [];
var void_mana = 0;
var creaturenum = 0;
var landnum = 0;
var landplaycounter = 0;
var l = cards.length;
var handnumber = 0;
var marigancounter = 0;
var land_manage = [];
var step = "";

var Card = function() {
  this.name = "";
  this.attr = "";
  this.power = null;
  this.taghness = null;
  this.manacost = null;
  this.src = "";
}

var cards = []; //SQLで実装したい
for(var i= 0;i < 6;i++){
  cards[i] = new Card();
  cards[i].src = "test_image/mtg"+(i+1)+".jpg";
  cards[i].name = "name"+i+"";
  cards[i].manacost = i;
  if(i!=0){
    cards[i].attr = "creature";
  }
  if(i==0){
    cards[i].attr = "land";
  }
}

var cpu = function(){
  this.life_evalurate = 0;
  this.permanent_evalurate = 0;
  this.attack_select = 0;
  this.deffence_select = 0;

}

//
//
//パラーメータ計算関数
//
//

var land_manage_format = function(){
  for(var i=0;i<landnum+1;i++){
    land_manage[i] = 0;
  }
};
var socery_playable = function(steptype){
  if((steptype =="stage0") || (steptype =="upkeep") || (steptype == "selectattacker") || (steptype == "selectdefender")
    || (steptype == "distribution") || (steptype == "endstep")){
    return 0;
  }
  else{
    return 1;
  }
}

//
//
//CPUの行動についての関数
//
//

var op_can_cast_land = function(){
  
  for(var i=0;i<6;i++){
    if(op_hand_cards[i].attr == "land"){
      return i;
    }
  }
  return -1;
};

var op_cast_land = function(num){
  append_to_card("op_land",op_hand_cards[num]);
  $("#op_hand img").eq(num).remove();
  op_hand_cards.splice(num,1);
}


var op_turn = function(){
  step = "op_upkeep";
  update_display("turntable");

  console.log(step);
  draw_card("op");
  step = "op_main1";
  update_display("turntable");

  if(op_can_cast_land() != -1){
    console.log(op_can_cast_land());
    op_cast_land(op_can_cast_land());
  }

  if()


  step = "op_endstep";
  update_display("turntable");
};


//
//
//表示についての関数
//
//
var information = function(){
  console.log("mana="+void_mana);
  console.log("hand="+handnumber);
  console.log("creaturenumber="+creaturenum);
  console.log("landnum="+landnum);
  console.log("attacker="+attacker.length);
  console.log("thisstep="+step);
};
var add_mana = function(land){
  //default = voidcolor
  console.log("addmana");
  console.log(void_mana);
  $("#manatable").empty();
  $("#manatable").append("<font id = 'void' size = '3'>mana:"+void_mana+"</font><br>");
};

var display_mana = function(){
  $("#manatable").empty();
  $("#manatable").append("<font id = 'void' size = '3'>mana:"+void_mana+"</font><br>");
}

var tap_it = function(divname,num){
  $("#"+divname+" img").eq(num).rotate(90);

};

var untap_it = function(divname,num){
  $("#"+divname+" img").eq(num).rotate(0);
};
var append_to_card = function(divname,appended_card){  
  $("#"+divname).append("<img name = '"+appended_card.name+"' src = '"+appended_card.src+"' width = '50' height = '80'>");
};

var update_display = function(display_name){
  $("#"+display_name+"").empty();
  if(display_name == "turntable"){
    $("#"+display_name+"").append("<font size = '3'>step:"+step+"</font><br>");
  }
  if(display_name == "manatable"){
     $("#"+display_name+"").append("<font size = '3'>mana:"+void_mana+"</font><br>");
  }
};

//
//
//ターン管理の関数
//
//


var go_to_nextstep = function(steptype){
  if(step == "stage0"){
    land_manage_format();
    $("#life").append("<font size = '3'>life:"+life+"</font><br>");
  
  }
  switch(steptype){
    case "stage0":step = "upkeep";break;
    case "op_endstep":step = "upkeep";break;
    case "upkeep":step = "main1";break;
    case "main1":step ="selectattacker";break;
    case "selectattacker":step ="selectdefender";break;
    case "selectdefender":step ="distribution";break;
    case "distribution":step = "main2";break;
    case "main2":step = "endstep";break;
    case "endstep":op_turn();
    step = "upkeep";break;
  }
  if(step == "upkeep"){
    next_turn();
  }
  void_mana = 0;

  update_display("turntable");
  update_display("manatable");

};
var next_turn = function(steptype){
  step = "upkeep";
  $("#turntable").empty();
  $("#turntable").append("<font size = '3'>step:"+step+"</font><br>");
  void_mana = 0;
  for(var i=0;i<=creaturenum;i++){
      untap_it("my_creature",i);
  }
  for(var i=0;i<=landnum;i++){
      untap_it("my_land",i);
  }
  land_manage_format();
  landplaycounter ++;
  display_mana();
  draw_card("my");
  //information();
}

//
//
//ゲーム前のための関数
//
//
var start_hand = function(my_or_op){
  for(i=0;i<7;i++){
      //append_to_card("hand",cards[i]);
      draw_card(my_or_op);      
    } 
    step = "初手"
    $("#turntable").append(step);
    step = "stage0"
};


//
//imgとかbutton触ったら動く系
//.click(function)関数
//
//


var play_land = function(char,cardname){
  $("#"+char+"_land img").eq(landnum).click(function(){
    var index2 = $("#"+char+"_land img").index(this);
    tap_it(""+char+"_land",index2);
    if(land_manage[index2]==0 ){
      void_mana ++;
      add_mana(cards[i]);
      land_manage[index2] = 1;
    }else{
      console.log("already_tapped");
    }
  });
  handnumber--;
  landnum ++;
  landplaycounter --;
};

var play_creature = function(char,cardname){
  $("#"+char+"_creature img").eq(creaturenum).click(function(){
    var index2 = $("#"+char+"_creature img").index(this);
    if(step == "selectattacker"){
    tap_it(""+char+"_creature",index2);
    attacker.push(cards[i]);
  }else{
    console.log("no mean select");
  }
});
  handnumber--;
  creaturenum ++;
  void_mana = void_mana - cards[i].manacost;
  display_mana();
};


var draw_card = function(my_or_op){
  var char = my_or_op;
  console.log(char);
  var l = cards.length;
  var r = Math.floor(Math.random()*l);
  if(my_or_op == "my"){my_hand_cards.push(cards[r]);}
  if(my_or_op == "op"){op_hand_cards.push(cards[r]);}
  
  append_to_card(""+char+"_hand",cards[r]);
  $("#"+char+"_hand img").eq(handnumber).click(function(e){
      var index = $("#"+char+"_hand img").index(this);
      console.log("steptype:"+step);
      console.log("socery_playable:"+socery_playable(step));
      if(socery_playable(step)){
        for(i = 0;i<6;i++){
          if($("#"+char+"_hand img").eq(index).attr("name") == cards[i].name){
            if(cards[i].attr == "land"){  
              if(landplaycounter >= 1){
                append_to_card(char+"_land",cards[i]);
                my_hand_cards.splice(index,1);
                $("#"+char+"_hand img").eq(index).remove();
                play_land("my",cards[i]);       
                
              }
              break;
            }
            if(cards[i].attr == "creature"){
              if(void_mana >= cards[i].manacost){                
                append_to_card(""+char+"_creature",cards[i]);
                my_hand_cards.splice(index,1);
                $("#"+char+"_hand img").eq(index).remove();
                play_creature("my",cards[i]);
                break;
              }else{
                console.log("not enough mana");
                console.log("mana = "+void_mana);
                console.log("cost = "+cards[i].manacost);
              }
            }
          }  
        }
      }else{
        console.log("this step cannnot play creature or land");
      }
   });
  handnumber ++;
}

$('#startinghand').click(function(){
    console.log("button pressed");
    start_hand("my");
});

$('#op_startinghand').click(function(){
    console.log("button pressed");
    start_hand("op");
});



$('#marigan').click(function(){
  handnumber = 0;
  marigancounter ++;
  $("#my_hand img").remove();
  for(i=0;i<7-marigancounter;i++){
  //append_to_card("hand",cards[i]);
  draw_card();
} 


});

$('#gazo3').click(function(){
    $("#my_hand img").remove();
    $("#my_land img").remove();
    $("#my_creature img").remove();
    marigancounter = 0;
    handnumber = 0;
});

$('#gazo4').click(function(){
  draw_card("my");
});
$('#nextturn').click(function(){
  next_turn();
});
$('#nextstep').click(function(){
  go_to_nextstep(step);
  if(step == "selectattacker"){
    //$("#turntable").append("<input id = 'select' type = 'button' value = 'select_attack_creature '>");
  }
 // information();
});
$('#start').click(function(){
  $("#my_hand img").remove();
  $("#my_land img").remove();
  $("#my_creature img").remove();
  $("#op_hand img").remove();
  $("#op_land img").remove();
  $("#op_creature img").remove(); 
  start_hand("my");
  start_hand("op");
});