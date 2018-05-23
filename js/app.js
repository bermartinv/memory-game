/* ********************************************************************
*                           Variables                               ***
**********************************************************************/
/* object to manipulate values*/
objeto = {
    default : 0,
    moves : 0,
    match : 0,
    element1 : "" ,
    element2 : "" ,
    elementCouple : 0,
    stars : 3,
    seconds : 0
}

 /* Take all elements with class = 'card' */
 let listCards = [...document.querySelectorAll('.card')]; //ECMAScript5 NodeList to array 
 let stars = document.querySelectorAll('.fa-star');  // stars of moves
 let moveWrite = document.querySelector(".moves");   // moves of cards
 let newListCards = shuffle(listCards);
 let t; // variable for manipulate setTimeout and clearTimeout of watch
 
 /* Click to restart game button */
 var botton = document.querySelector(".restart");
 botton.addEventListener('click',reset);

/*********************************************************************
 *                              START GAME                          **
 * ******************************************************************/
reset();
start();

/**********************************************************************
 *                      FUNCTIONS                                    **
 * ***************************************************************** */

 // Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


function reset(){
    var ul = document.querySelector(".deck"); // asumiendo que existe
    var docfrag = document.createDocumentFragment();
    newListCards.forEach(function(e) {
        docfrag.appendChild(e);
        });

    ul.appendChild(docfrag);
    /* renew shuffle cards */
    shuffle(listCards);
   
   
   /* select items with class match, open, show and remove them */
   removeClass(document.querySelectorAll(".match"),"match");
   removeClass(document.querySelectorAll(".open"),"open");
   removeClass(document.querySelectorAll(".show"),"show");;

   /* Function to remove classes */
   function removeClass(items,classes){
      for (let i = 0 ; i < items.length ; i++) {
            items[i].classList.remove(classes);
        }   
    }


   /* reset values of project, varables and object */ 
   objeto.moves = 0;
   writeMoves();
   objeto.default = 0;
   objeto.elemento1 = "";
   objeto.elemento2 = "";
   objeto.elementCouple = 0;
   stars[0].style.color = 'black';
   stars[1].style.color = 'black';
   stars[2].style.color = 'black';
   objeto.stars = 3;
   document.getElementById('minsec').innerHTML = '00 : 00';
   stopWatch();
}

/********************************************************
*                  FUNCTION TO START GAME               *
*********************************************************/
function start(){

     /* Action for every card */
     for (let i = 0  ; i < listCards.length ; i++){
        listCards[i].addEventListener('click',function(){
            this.classList.add("open","show");
            defaultMoves(this);
            
        });
    }
}    

/* Moves to see cards*/
function defaultMoves(elemento){

    /* To start the watch*/
    if ((objeto.default == 0) & (objeto.moves == 0)){  
        watch();
    } 


    if ( (objeto.default == 0) & (elemento.getAttributeNode("class").value != "card match open show")){
        objeto.element1 = elemento.firstChild.nextSibling;
        ++objeto.default;
    }else if((objeto.default == 1) & ((elemento.getAttributeNode("class").value != "card match open show"))){
        objeto.element2 = elemento.firstChild.nextSibling;
        objeto.default = 0;
        console.log("Hola");
        ++objeto.moves;
        
        paintStars();   // paint stars
        writeMoves();   // write moves
        compareElements(objeto.element1,objeto.element2);/* show elements */
    }
    
    
  
}

/* To compare cards*/
function compareElements(element1,element2){

    if (element1.isEqualNode(element2)){
        element1.parentNode.classList.add("match");
        element2.parentNode.classList.add("match");
        element1.parentNode.classList.remove('show', 'open');
        element2.parentNode.classList.remove('show', 'open');  
        ++objeto.elementCouple;
        if ((objeto.elementCouple * 2) == (listCards.length)){
            stopWatch();
            compareCouples();
        }
    }else{
        element1.parentNode.classList.add("close");
        element2.parentNode.classList.add("close");

        setTimeout(function(){
            element1.parentNode.classList.remove('show', 'open', 'close');
            element2.parentNode.classList.remove('show', 'open', 'close');      
        },1000);
    }
}

/* To show results when finish game */
function compareCouples(){

        const cross = document.querySelector(".cross");
        const results = document.querySelector(".results");
        const playAgain = document.querySelector('.playAgain');
        const showResults = document.querySelector(".showResults");

        /* Show modal with results*/
        results.style.display = 'block';

        /* Write and show results text */
        showResults.innerHTML = `With ${objeto.moves} moves and ${objeto.stars} stars and ${objeto.seconds} seconds.`;

        /* cLick in cross and close modal and restart game*/
        cross.addEventListener('click',function (){
            results.style.display = 'none';
            reset();
        })

        /* click on button and close modal and restart game*/
        playAgain.addEventListener('click',function(){
            results.style.display = "none";
            reset();
        })

        /* click out of modal and close modal and restart game*/
        window.onclick = function(event){
            if (event.target == results){
              results.style.display = 'none';
              reset();console.log('hola');
            }
        }
}

/* Paint stars when movies are high */
function paintStars(){
    if (objeto.moves > 15 & objeto.moves < 20 ){
        stars[2].style.color = "grey";
        objeto.stars = 2;
    }
    else if(objeto.moves >=20 /*& objeto.moves < 25 */){
        stars[1].style.color = "grey";
        objeto.stars = 1;
    }/*
    else if(objeto.moves >= 25 ){
        stars[0].style.color = "grey";
        objeto.stars = 0;
    }*/
}

/* Write movies when open cards */
function writeMoves(){
    moveWrite.innerHTML = objeto.moves ;
}

/* Watch */
function watch(){
    
    let milisegundos = 0;
    reloj();
		function reloj() {
			if(milisegundos>-1000){
				var fecha=new Date(milisegundos);
				var m=fecha.getMinutes();
				var s=fecha.getSeconds();
				m = actualizarHora(m);
				s = actualizarHora(s);
                document.getElementById('minsec').innerHTML = m+" : "+s;
                milisegundos = milisegundos + 1000;
                objeto.seconds = (milisegundos / 1000);
                t = setTimeout(reloj ,1000);
            }
		}
		function actualizarHora(i) {
			if (i<10) {i = "0" + i};  // Añadir el cero en números menores de 10
			return i;
		}
}

/*Stop watch*/
function stopWatch(){
    clearTimeout(t);
}

