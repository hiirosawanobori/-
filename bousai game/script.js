function ruby(text, reading) {
    return `<ruby>${text}<rt>${reading}</rt></ruby>`;
}
// 画面
const startScreen = document.getElementById("startScreen");
const playerScreen = document.getElementById("playerScreen");
const nameScreen = document.getElementById("nameScreen");
const policyScreen = document.getElementById("policyScreen");
const policyResultScreen = document.getElementById("policyResultScreen");
const miniGameScreen = document.getElementById("miniGameScreen");
const disasterScreen = document.getElementById("disasterScreen");
const resultScreen = document.getElementById("resultScreen");

// ボタン
const startButton = document.getElementById("startButton");
const nextButton = document.getElementById("nextButton");
const gameStartButton = document.getElementById("gameStartButton");
const agreeButton = document.getElementById("agreeButton");
const miniGameNextButton =
document.getElementById("miniGameNextButton");
const disagreeButton = document.getElementById("disagreeButton");
const policyNextButton = document.getElementById("policyNextButton");
const disasterNextButton = document.getElementById("disasterNextButton");

// ゲーム用変数
let residentTotal = 0;
let currentResident = 1;
let agreeCount = 0;
let disagreeCount = 0;
let residentNames = [];
let residentPoints = [];
const disasterActions=[

{name:"家の耐震工事",reading:"いえのたいしんこうじ",action:-4,disaster:4,happy:0},
{name:"避難グッズの購入",reading:"ひなんグッズのこうにゅう",action:-2,disaster:3,happy:0},
{name:"避難訓練への参加",reading:"ひなんくんれんへのさんか",action:-1,disaster:3,happy:0},
{name:"地域の人に挨拶",reading:"ちいきのひとにあいさつ",action:0,disaster:1,happy:1}

];

const playActions=[

{name:"1人旅に行く",reading:"ひとりたびにいく",action:-5,disaster:0,happy:4},
{name:"ほしいものを買う",reading:"ほしいものをかう",action:-3,disaster:0,happy:3},
{name:"ご飯を食べる",reading:"ごはんをたべる",action:-2,disaster:0,happy:3},
{name:"映画を見る",reading:"えいがをみる",action:-1,disaster:0,happy:2}

];

let currentTurn = 1;
let currentChoices = [];
let turnChoices = [];
function addFurigana(text){

    const furigana = {

        "家の耐震工事":
            "<ruby>家<rt>いえ</rt></ruby>の<ruby>耐震工事<rt>たいしんこうじ</rt></ruby>",

        "避難グッズの購入":
            "<ruby>避難<rt>ひなん</rt></ruby>グッズの<ruby>購入<rt>こうにゅう</rt></ruby>",

        "避難訓練への参加":
            "<ruby>避難訓練<rt>ひなんくんれん</rt></ruby>への<ruby>参加<rt>さんか</rt></ruby>",

        "地域の人に挨拶":
            "<ruby>地域<rt>ちいき</rt></ruby>の<ruby>人<rt>ひと</rt></ruby>に<ruby>挨拶<rt>あいさつ</rt></ruby>",

        "1人旅に行く":
            "1<ruby>人旅<rt>ひとりたび</rt></ruby>に<ruby>行<rt>い</rt></ruby>く",

        "ほしいものを買う":
            "ほしいものを<ruby>買<rt>か</rt></ruby>う",

        "ご飯を食べる":
            "<ruby>ご飯<rt>ごはん</rt></ruby>を<ruby>食<rt>た</rt></ruby>べる",

        "映画を見る":
            "<ruby>映画<rt>えいが</rt></ruby>を<ruby>見<rt>み</rt></ruby>る"

    };

    return furigana[text] || text;

}

// スタート
startButton.addEventListener("click", function () {
   previousScreen = startScreen;
startScreen.style.display = "none";
playerScreen.style.display = "block";
dailyScreen.className = "screen player" + currentResident;
});

// 人数決定
nextButton.addEventListener("click", function () {

    residentTotal = Number(document.getElementById("playerCount").value);

    playerScreen.style.display = "none";
    nameScreen.style.display = "block";

    const area = document.getElementById("nameInputs");
    area.innerHTML = "";

    for (let i = 1; i <= residentTotal; i++) {

        area.innerHTML += `
        <p>住民${i}</p>
        <input type="text" id="player${i}" placeholder="名前を入力">
        <br><br>
        `;

    }

});

// ゲーム開始
gameStartButton.addEventListener("click", function () {

    residentNames = [];
    residentPoints = [];

    for(let i=1; i<=residentTotal; i++){

        const name = document.getElementById("player"+i).value;

        residentNames.push(name);
        residentPoints.push({
    action:10,
    disaster:0,
    happy:3,
    history:[]
});

    }

    nameScreen.style.display = "none";
    policyScreen.style.display = "block";

    currentResident = 1;
    agreeCount = 0;
    disagreeCount = 0;
    currentTurn = 1;
turnChoices = [];
currentChoices = [];

    document.getElementById("residentTurn").innerHTML =
    residentNames[currentResident-1] + " さんの番です";

});

// 協力する
agreeButton.addEventListener("click", function () {

    agreeCount++;
    nextResident();

});

// 協力しない
disagreeButton.addEventListener("click", function () {

    disagreeCount++;
    nextResident();

});

// 次の住民へ
function nextResident() {

    currentResident++;

    if (currentResident <= residentTotal) {

        document.getElementById("residentTurn").innerHTML =
residentNames[currentResident-1] + " さんの番です";

}else{

    policyScreen.style.display = "none";
    policyResultScreen.style.display = "block";

   if(agreeCount > residentTotal / 2){

    document.getElementById("policyResultText").innerHTML =
    "協力することに決まりました！";

    // 全員に配点
    for(let i = 0; i < residentTotal; i++){

        residentPoints[i].action -= 4;
        residentPoints[i].disaster += 4;

    }

}else{

    document.getElementById("policyResultText").innerHTML =
    "協力しないことに決まりました！";

    // 不参加ならポイント変動なし

}

}

}
function getRandomChoices(){

    const disaster=[...disasterActions];
    const play=[...playActions];

    disaster.sort(()=>Math.random()-0.5);
    play.sort(()=>Math.random()-0.5);

    let choices=[];

    choices.push(disaster[0]);
    choices.push(disaster[1]);

    choices.push(play[0]);
    choices.push(play[1]);

    choices.sort(()=>Math.random()-0.5);

    return choices;

}
function showDailyTurn(){

    policyResultScreen.style.display = "none";

    disasterScreen.style.display = "none";

    miniGameScreen.style.display = "none";   // ←追加

    document.getElementById("dailyScreen").style.display = "block";
    document.getElementById("dailyScreen").className = "screen player" + currentResident;

   document.getElementById("turnTitle").innerHTML =
ruby("日常", "にちじょう") + "ターン " + currentTurn;

    document.getElementById("dailyResident").innerHTML =
residentNames[currentResident-1] + " さんの番！";
document.getElementById("actionPoint").innerHTML =
residentPoints[currentResident-1].action;

document.getElementById("disasterPoint").innerHTML =
residentPoints[currentResident-1].disaster;

document.getElementById("happyPoint").innerHTML =
residentPoints[currentResident-1].happy;

if(turnChoices.length < currentTurn){

    turnChoices.push(getRandomChoices());

}

currentChoices = turnChoices[currentTurn-1];


    const area = document.getElementById("choiceArea");

area.innerHTML = "";

currentChoices.forEach((choice, index) => {

    let pointText = "";

   if(choice.action != 0){

    pointText += ruby("行動", "こうどう") + " " + choice.action + " ";

}

if(choice.disaster > 0){

    pointText += ruby("防災", "ぼうさい") + " +" + choice.disaster + " ";

}

    if(choice.happy > 0){

        pointText += "ハッピー +" + choice.happy;

    }

    area.innerHTML += `
    <button class="choiceButton" onclick="selectDailyAction(currentChoices[${index}])">

        <strong>${ruby(choice.name, choice.reading)}</strong><br>

        <small>${pointText}</small>

    </button>

    <br><br>
    `;

});

}
function showMiniGame(){

    document.getElementById("dailyScreen").style.display = "none";

    miniGameScreen.style.display = "block";

    const area =
    document.getElementById("miniGameArea");

    area.innerHTML = "";

    for(let i=0;i<residentTotal;i++){

        area.innerHTML += `
        <p>${residentNames[i]}</p>

        <input
            type="number"
            id="reward${i}"
            value="0"
            min="0"
            max="20">

        <br><br>
        `;

    }

}
miniGameNextButton.addEventListener("click", function(){

    for(let i=0;i<residentTotal;i++){

        const reward =
        Number(document.getElementById("reward"+i).value);

        residentPoints[i].action += reward;

    }

    miniGameScreen.style.display = "none";

    // 次のターンへ
    currentTurn++;

    if(currentTurn <= 3){

        currentResident = 1;
        currentChoices = [];

        showDailyTurn();

    }else{

        disasterScreen.style.display = "block";

    }

});
function selectDailyAction(choice){

    // ポイント加算
    residentPoints[currentResident-1].action += choice.action;
    residentPoints[currentResident-1].disaster += choice.disaster;
    residentPoints[currentResident-1].happy += choice.happy;

    // 行動ポイントが0未満にならない
    if(residentPoints[currentResident-1].action < 0){
        residentPoints[currentResident-1].action = 0;
    }

    // 履歴保存
    residentPoints[currentResident-1].history.push({

        name: choice.name,
        action: residentPoints[currentResident-1].action,
        disaster: residentPoints[currentResident-1].disaster,
        happy: residentPoints[currentResident-1].happy

    });

    currentResident++;

if(currentResident <= residentTotal){

    // 次の住民
    showDailyTurn();

}else{

    // 全員終了

    if(currentTurn < 3){

        // ミニゲームへ
        showMiniGame();

    }else{

        // 3ターン終了
        document.getElementById("dailyScreen").style.display = "none";
        disasterScreen.style.display = "block";

    }

}
}

policyNextButton.addEventListener("click", function(){

    policyResultScreen.style.display = "none";

    currentResident = 1;

    currentTurn = 1;

    currentChoices = [];

    turnChoices = [];

    showDailyTurn();

});
disasterNextButton.addEventListener("click", function(){

    for(let i=0;i<residentTotal;i++){

        // 全員ハッピー-3
        residentPoints[i].happy -= 3;

        // 防災不足なら追加で減点
        if(residentPoints[i].disaster < 5){

            residentPoints[i].happy -= 2;

        }

    }

    showResult();

});
function showResult(){

    disasterScreen.style.display = "none";

    resultScreen.style.display = "block";

    let results = [];

    for(let i=0;i<residentTotal;i++){

        const totalPoint =
residentPoints[i].action +
residentPoints[i].disaster +
residentPoints[i].happy;

results.push({

    name: residentNames[i],

    action: residentPoints[i].action,

    disaster: residentPoints[i].disaster,

    happy: residentPoints[i].happy,

    total: totalPoint,

    history: residentPoints[i].history

});
    }

    results.sort((a,b)=>b.total-a.total);

    const area=document.getElementById("resultArea");

    area.innerHTML="";
    let rank = 1;

let previousPoint = -99999;

        results.forEach((player,index)=>{


    if(index === 0){

        rank = 1;

    }else if(player.total === results[index-1].total){

        rank = rank;

    }else{

        rank = index + 1;

    }


        area.innerHTML += `

        <hr>

     <h3>
    ${rank}位　${player.name}さん
</h3>

<p>
    <ruby>獲得<rt>かくとく</rt></ruby>ポイント：
    ${player.total}
</p>

<p>
    <ruby>行動<rt>こうどう</rt></ruby>ポイント：
    ${player.action}
</p>

<p>
    <ruby>防災<rt>ぼうさい</rt></ruby>ポイント：
    ${player.disaster}
</p>

<p>
    ハッピーポイント：
    ${player.happy}
</p>

<p>
    <ruby>行動履歴<rt>こうどうりれき</rt></ruby>
</p>

        <ol>

        ${player.history.map((h,i)=>`

            <li>
    <ruby>ターン<rt>たーん</rt></ruby>${i+1}<br>
    ${h.name}<br>
    <ruby>行動<rt>こうどう</rt></ruby>：
    ${h.action}<br>
    <ruby>防災<rt>ぼうさい</rt></ruby>：
    ${h.disaster}<br>
    ハッピー：
    ${h.happy}
</li>

        `).join("")}

        </ol>

        `;

    });

}