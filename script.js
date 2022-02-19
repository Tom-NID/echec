var rect = document.getElementById("plateau").getBoundingClientRect()

var Grille = [
["nt", "nc", "nf", "nd", "nr", "nf", "nc", "nt"],
["np", "np", "np", "np", "np", "np", "np", "np"],
[null, null, null, null, null, null, null, null],
[null, null, null, null, null, null, null, null],
[null, null, null, null, null, null, null, null],
[null, null, null, null, null, null, null, null],
["bp", "bp", "bp", "bp", "bp", "bp", "bp", "bp"],
["bt", "bc", "bf", "bd", "br", "bf", "bc", "bt"]]

var pion_selection = null
var pion_adverses = []
var tour = 0
var QI_blanc = 100
var QI_noir = 100

var fond = document.createElement('audio')
fond.src = "Sounds/Fond.mp3"
fond.volume = 1
fond.loop = true

function Initialisation(){
    for(let i = 0; i < 8; i++){
        for(let j = 0; j < 8; j++){
            
            let frame = document.createElement("img")
            frame.id = String(i) + String(j)
            if((i+j) % 2 == 0){
                frame.src = "Image/case_blanc.png"
                frame.couleur = 0
            }
            else{
                frame.src = "Image/case_noir.png"
                frame.couleur = 1
            }
            document.getElementById("plateau").appendChild(frame)
            
            frame.onclick = function(){deplacement(this)} 

            frame.style.left = String(rect.left + j * 100) + "px"
            frame.style.top = String(rect.top + i * 100) + "px"
            frame.style.position = "absolute"

            if(Grille[i][j] != null){ 
                let pion = document.createElement("img")
                pion.case = String(i) + String(j)
                pion.id = Grille[i][j]
                
                if(Grille[i][j][0] == "b"){
                    pion.src = "Image/Blanc/" + Grille[i][j] + ".png"
                }
                if(Grille[i][j][0] == "n"){
                    pion.src = "Image/Noir/" + Grille[i][j] + ".png"
                }
            
                document.getElementById("plateau").appendChild(pion)
                
                if (Grille[i][j] != null){
                    switch(Grille[i][j][1]){ 
                        case "c":
                            pion.onclick = function(){Cava(this)}
                            break;
                        case "d":
                            pion.onclick = function(){Dame(this)}
                            break;
                        case "f":
                            pion.onclick = function(){Fou(this)}
                            break;
                        case 'p':
                            pion.onclick = function(){Pion(this)}
                            pion.move = false
                            break;
                        case "r":
                            pion.onclick = function(){Roi(this)}
                            break;
                        case "t":
                            pion.onclick = function(){Tour(this)}
                            break;                       
                    }
                }
                
                pion.style.zIndex = "1"
                pion.style.position = "absolute"
                pion.style.left = String(rect.left + j * 100) + "px"
                pion.style.top = String(rect.top + i * 100) + "px"
                
                frame.pion = pion
            }
            else{
                frame.pion = null
            }
        }
    }

    document.getElementById("pions_noirs_morts").style.left = String(rect.left + 8 * 100) + "px"
    document.getElementById("pions_noirs_morts").style.top = String(rect.top + 100) + "px"
    document.getElementById("pions_blancs_morts").style.left = String(rect.left + 8 * 100) + "px"
    document.getElementById("pions_blancs_morts").style.top = String(rect.top + 4 * 100) + "px"

    document.getElementById("QI_blanc").style.top = String(rect.top + 700) + "px"
    document.getElementById("QI_blanc").style.left = String(rect.left + 810) + "px"
    document.getElementById("QI_noir").style.top = String(rect.top) + "px"
    document.getElementById("QI_noir").style.left = String(rect.left + 810) + "px"

    
    let Son = document.createElement("img")
    Son.id = "son"
    Son.src = "Image/soundOff.png"
    Son.active = false
    Son.onclick = function(){
        if(Son.active){
            fond.pause()
            Son.src = "Image/soundOff.png"
            Son.active = false
        }
        else{
            fond.play()
            Son.src = "Image/soundOn.png"
            Son.active = true
        }
    }
    document.getElementById("son").appendChild(Son)
    tour = 0 
}

// Rends un case accessible par un pion
function case_rose(pion, i1, i2){
    if((Number(pion.case[0]) + i1 + Number(pion.case[1]) + i2) % 2 == 0){
        document.getElementById(String(Number(pion.case[0]) + i1 + String(Number(pion.case[1]) + i2))).src = "Image/croix_blanc.png"
    }
    else{
        document.getElementById(String(Number(pion.case[0]) + i1 + String(Number(pion.case[1]) + i2))).src = "Image/croix_noir.png"
    }
    
    document.getElementById(String(Number(pion.case[0]) + i1 + String(Number(pion.case[1]) + i2))).couleur = 2
}

// Renvoie True si une case est vide
function case_deplacement(pion, i1, i2){
    if(document.getElementById(String(Number(pion.case[0]) + i1 + String(Number(pion.case[1]) + i2))).pion == null){
        return true
    }
    return false
}

// Renvoie True si il y a un pion adverse sur la case
function pion_adverse(pion, i1, i2){
    if(! case_deplacement(pion, i1, i2)){ // temp
        if(document.getElementById(String(Number(pion.case[0]) + i1 + String(Number(pion.case[1]) + i2))).pion.id[0] != pion.id[0]){
            return true
        }
    }
    return false
}

// Renvoie True si il y a un pion adverse sur la case et ajoute le pion a la liste pion_adverses
function attaque(pion, i1, i2){
    if(! case_deplacement(pion, i1, i2) && pion_adverse(pion, i1, i2)){
        document.getElementById(String(Number(pion.case[0]) + i1 + String(Number(pion.case[1]) + i2))).couleur = 2
        pion_adverses.push(document.getElementById(String(Number(pion.case[0]) + i1 + String(Number(pion.case[1]) + i2))).pion)
        return true
    }
    return false
}


function croquer(pion){
    deplacement(document.getElementById(pion.case))
    pion.style.position = "static"
    pion.style.top = "0px"
    pion.style.left = "0px"
    if(pion.id[0] == "n"){
        document.getElementById("pions_noirs_morts").appendChild(pion);
    }
    else{
        document.getElementById("pions_blancs_morts").appendChild(pion);
    }
}

function Cava(pion){
    if(pion_adverses.includes(pion)){
        croquer(pion)
        return
    }
    if(tour % 2 == 0 && pion.id[0] == 'n' || tour % 2 == 1 && pion.id[0] == 'b'){return}
    reinitialiser()
    pion_selection = pion
    if(Number(pion.case[0]) - 2 >= 0 && Number(pion.case[1]) - 1 >= 0 && (case_deplacement(pion, -2, -1) || pion_adverse(pion, -2, -1))){
        if(! attaque(pion, -2, -1)){case_rose(pion, -2, -1)}
    }
    if(Number(pion.case[0]) - 2 >= 0 && Number(pion.case[1]) + 1 <= 7 && (case_deplacement(pion, -2, 1) || pion_adverse(pion, -2, 1))){
        if(! attaque(pion, -2, 1)){case_rose(pion, -2, 1)}              
    }
    if(Number(pion.case[0]) + 2 <= 7 && Number(pion.case[1]) - 1 >= 0 && (case_deplacement(pion, 2, -1) || pion_adverse(pion, 2, -1))){
        if(! attaque(pion, 2, -1)){case_rose(pion, 2, -1)}                
    }
    if(Number(pion.case[0]) + 2 <= 7 && Number(pion.case[1]) + 1 <= 7 && (case_deplacement(pion, 2, 1) || pion_adverse(pion, 2, 1))){
        if(! attaque(pion, 2, 1)){case_rose(pion, 2, 1)}               
    }
    if(Number(pion.case[0]) - 1 >= 0 && Number(pion.case[1])- 2 >= 0 && (case_deplacement(pion, -1, -2) || pion_adverse(pion, -1, -2))){
        if(! attaque(pion, -1, -2)){case_rose(pion, -1, -2)}               
    }
    if(Number(pion.case[0]) + 1 <= 7 && Number(pion.case[1]) - 2 >= 0 && (case_deplacement(pion, 1, -2) || pion_adverse(pion, 1, -2))){
        if(! attaque(pion, 1, -2)){case_rose(pion, 1, -2)}                
    }
    if(Number(pion.case[0]) - 1 >= 0 && Number(pion.case[1]) + 2 <= 7 && (case_deplacement(pion, -1, 2) || pion_adverse(pion, -1, 2))){
        if(! attaque(pion, -1, 2)){case_rose(pion, -1, 2)}               
    }
    if(Number(pion.case[0]) + 1 <= 7 && Number(pion.case[1]) + 2 <= 7 && (case_deplacement(pion, 1, 2) || pion_adverse(pion, 1, 2))){
        if(! attaque(pion, 1, 2)){case_rose(pion, 1, 2)}
    }
    for(let i = 0; i < pion_adverses.length; i ++){
        pion_adverses[i].src = "Image/mort.png"
    }
}

function Dame(pion){
    if(pion_adverses.includes(pion)){
        croquer(pion)
        return
    }
    if(tour % 2 == 0 && pion.id[0] == 'n' || tour % 2 == 1 && pion.id[0] == 'b'){return}
    reinitialiser()
    pion_selection = pion
    let i = 1
    while(Number(pion.case[0]) - i > - 1 && Number(pion.case[1]) - i > - 1 && (case_deplacement(pion, -i, -i) || pion_adverse(pion, -i, -i))){
        if(attaque(pion, -i, -i)){break;}
        case_rose(pion, -i, -i)
        i += 1
    }
    i = 1
    while(Number(pion.case[0]) - i > - 1 && Number(pion.case[1]) + i < 8 && (case_deplacement(pion, -i, i) || pion_adverse(pion, -i, i))){
        if(attaque(pion, -i, i)){break;}
        case_rose(pion, -i, i)
        i += 1
    }
    i = 1
    while(Number(pion.case[0]) + i < 8 && Number(pion.case[1]) - i > - 1 && (case_deplacement(pion, i, -i) || pion_adverse(pion, i, -i))){
        if(attaque(pion, i, -i)){break;}
        case_rose(pion, i, -i)
        i += 1
    }
    i = 1
    while(Number(pion.case[0]) + i < 8 && Number(pion.case[1]) + i < 8 && (case_deplacement(pion, i, i) || pion_adverse(pion, i, i))){
        if(attaque(pion, i, i)){break;}
        case_rose(pion, i, i)
        i += 1
    }
    i = 1
    while(Number(pion.case) - i * 10 > -1 && (case_deplacement(pion, -i, 0) || pion_adverse(pion, -i, 0))){
        if(attaque(pion, -i, 0)){break;}
        case_rose(pion, -i, 0)
        i += 1
    }
    i = 1
    while(Number(pion.case) + i * 10 < 78 && (case_deplacement(pion, i, 0) || pion_adverse(pion, i, 0))){
        if(attaque(pion, i, 0)){break;}
        case_rose(pion, i, 0)
        i += 1
        
    }
    i = 1
    while(Number(pion.case[1]) - i > -1 && (case_deplacement(pion, 0, -i) || pion_adverse(pion, 0, -i))){
        if(attaque(pion, 0, -i)){break;}
        case_rose(pion, 0, -i)
        i += 1
    }
    i = 1
    while(Number(pion.case[1]) + i < 8 && (case_deplacement(pion, 0, i) || pion_adverse(pion, 0, i))){
        if(attaque(pion, 0, i)){break;}
        case_rose(pion, 0, i)
        i += 1
    }
    for(let i = 0; i < pion_adverses.length; i ++){
        pion_adverses[i].src = "Image/mort.png"
    }
}

function Fou(pion){
    if(pion_adverses.includes(pion)){
        croquer(pion)
        return
    }
    if(tour % 2 == 0 && pion.id[0] == 'n' || tour % 2 == 1 && pion.id[0] == 'b'){return}
    reinitialiser()
    pion_selection = pion
    let i = 1
    while(Number(pion.case[0]) - i > - 1 && Number(pion.case[1]) - i > - 1 && (case_deplacement(pion, -i, -i) || pion_adverse(pion, -i, -i))){
        if(attaque(pion, -i, -i)){break;}
        case_rose(pion, -i, -i)
        i += 1
    }
    i = 1
    while(Number(pion.case[0]) - i > - 1 && Number(pion.case[1]) + i < 8 && (case_deplacement(pion, -i, i) || pion_adverse(pion, -i, i))){
        if(attaque(pion, -i, i)){break;}
        case_rose(pion, -i, i)
        i += 1
    }
    i = 1
    while(Number(pion.case[0]) + i < 8 && Number(pion.case[1]) - i > - 1 && (case_deplacement(pion, i, -i) || pion_adverse(pion, i, -i))){
        if(attaque(pion, i, -i)){break;}
        case_rose(pion, i, -i)
        i += 1
    }
    i = 1
    while(Number(pion.case[0]) + i < 8 && Number(pion.case[1]) + i < 8 && (case_deplacement(pion, i, i) || pion_adverse(pion, i, i))){
        if(attaque(pion, i, i)){break;}
        case_rose(pion, i, i)
        i += 1
    }
    for(let i = 0; i < pion_adverses.length; i ++){
        pion_adverses[i].src = "Image/mort.png"
    }
}

function Pion(pion){
    if(pion_adverses.includes(pion)){
        croquer(pion)
        return
    }
    if(tour % 2 == 0 && pion.id[0] == 'n' || tour % 2 == 1 && pion.id[0] == 'b'){return}
    reinitialiser()
    pion_selection = pion
    switch(pion.id){
        case "bp":
            if(Number(pion.case[0]) - 1 >= 0 && case_deplacement(pion, -1, 0)){
                case_rose(pion, -1, 0)
            }
            if(Number(pion.case[0]) - 1 >= 0 && Number(pion.case[1]) - 1 >= 0){
                attaque(pion, -1, -1)
            }
            if(Number(pion.case[0]) - 1 >= 0 && Number(pion.case[1]) + 1 <= 7){
                attaque(pion, -1, 1)
            }
            if(! pion.move){
                if(Number(pion.case[0]) - 2 >= 0 && case_deplacement(pion, -2, 0) && case_deplacement(pion, -1, 0)){
                    case_rose(pion, -2, 0)
                }
            }
            break;
        case "np":
            if(Number(pion.case[0]) + 1 <= 7 && case_deplacement(pion, 1, 0)){
                case_rose(pion, 1, 0)
            }
            if(Number(pion.case[0]) + 1 <= 7 && Number(pion.case[1]) - 1 >= 0){
                attaque(pion, 1, -1)
            }
            if(Number(pion.case[0]) + 1 <= 7 && Number(pion.case[1]) + 1 <= 7){
                attaque(pion, 1, 1)
            }
            if(! pion.move){
                if(Number(pion.case[0]) + 2 <= 7 && case_deplacement(pion, 2, 0) && case_deplacement(pion, 1, 0)){
                    case_rose(pion, 2, 0)
                }
            }
            break;
    }
    for(let i = 0; i < pion_adverses.length; i ++){
        pion_adverses[i].src = "Image/mort.png"
    }
}

function Roi(pion){
    if(pion_adverses.includes(pion)){
        croquer(pion)
        return
    }
    if(tour % 2 == 0 && pion.id[0] == 'n' || tour % 2 == 1 && pion.id[0] == 'b'){return}
    reinitialiser()
    pion_selection = pion
    if(Number(pion.case[0]) + 1 <= 7 && (case_deplacement(pion, 1, 0) || pion_adverse(pion, 1, 0))){
        if(! attaque(pion, 1, 0)){case_rose(pion, 1, 0)}
    }
    if(Number(pion.case[0]) - 1 >= 0 && (case_deplacement(pion, -1, 0) || pion_adverse(pion, -1, 0))){
        if(! attaque(pion, -1, 0)){case_rose(pion, -1, 0)}
    }
    if(Number(pion.case[1]) + 1 <= 7 && (case_deplacement(pion, 0, 1) || pion_adverse(pion, 0, 1))){
        if(! attaque(pion, 0, 1)){case_rose(pion, 0, 1)}
    }
    if(Number(pion.case[1]) - 1 >= 0 && (case_deplacement(pion, 0, -1) || pion_adverse(pion, 0, -1))){
        if(! attaque(pion, 0, -1)){case_rose(pion, 0, -1)}
    }

    if(Number(pion.case[0]) + 1 <= 7 && Number(pion.case[1]) + 1 <= 7 && (case_deplacement(pion, 1, 1) || pion_adverse(pion, 1, 1))){
        if(! attaque(pion, 1, 1)){case_rose(pion, 1, 1)}
    }
    if(Number(pion.case[0]) - 1 >= 0 && Number(pion.case[1]) - 1 >= 0 && (case_deplacement(pion, -1, -1) || pion_adverse(pion, -1, -1))){
        if(! attaque(pion, -1, -1)){case_rose(pion, -1, -1)}
    }
    if(Number(pion.case[0]) + 1 <= 7 && Number(pion.case[1]) - 1 >= 0 && (case_deplacement(pion, 1, -1) || pion_adverse(pion, 1, -1))){
        if(! attaque(pion, 1, -1)){case_rose(pion, 1, -1)}
    }
    if(Number(pion.case[0]) - 1 >= 0 && Number(pion.case[1]) + 1 <= 7 && (case_deplacement(pion, -1, 1) || pion_adverse(pion, -1, 1))){
        if(! attaque(pion, -1, 1)){case_rose(pion, -1, 1)}
    }
    for(let i = 0; i < pion_adverses.length; i ++){
        pion_adverses[i].src = "Image/mort.png"
    }
}

function Tour(pion){
    if(pion_adverses.includes(pion)){
        croquer(pion)
        return
    }
    if(tour % 2 == 0 && pion.id[0] == 'n' || tour % 2 == 1 && pion.id[0] == 'b'){return}
    reinitialiser()
    pion_selection = pion
    let i = 1

    while(Number(pion.case) - i * 10 > -1 && (case_deplacement(pion, -i, 0) || pion_adverse(pion, -i, 0))){
        if(attaque(pion, -i, 0)){break;}
        case_rose(pion, -i, 0)
        i += 1
    }
    i = 1

    while(Number(pion.case) + i * 10 < 78 && (case_deplacement(pion, i, 0) || pion_adverse(pion, i, 0))){
        if(attaque(pion, i, 0)){break;}
        case_rose(pion, i, 0)
        i += 1
        
    }
    i = 1

    while(Number(pion.case[1]) - i > -1 && (case_deplacement(pion, 0, -i) || pion_adverse(pion, 0, -i))){
        if(attaque(pion, 0, -i)){break;}
        case_rose(pion, 0, -i)
        i += 1
    }
    i = 1

    while(Number(pion.case[1]) + i < 8 && (case_deplacement(pion, 0, i) || pion_adverse(pion, 0, i))){
        if(attaque(pion, 0, i)){break;}
        case_rose(pion, 0, i)
        i += 1
    }
    for(let i = 0; i < pion_adverses.length; i ++){
        pion_adverses[i].src = "Image/mort.png"
    }
}
function verif_echec(pion, i1, i2, id){
    if(! case_deplacement(pion, i1, i2) && pion_adverse(pion, i1, i2)){
        if(document.getElementById(String(Number(pion.case[0]) + i1 + String(Number(pion.case[1]) + i2))).pion.id[1] == id){
            pion_adverses.push(document.getElementById(String(Number(pion.case[0]) + i1 + String(Number(pion.case[1]) + i2))).pion)
            return true
        }
    }
    return false
}


function echec(pion){
    if(Number(pion.case[0]) - 2 >= 0 && Number(pion.case[1]) - 1 >= 0 && pion_adverse(pion, -2, -1)){
        verif_echec(pion, -2, -1, 'c')
    }
    if(Number(pion.case[0]) - 2 >= 0 && Number(pion.case[1]) + 1 <= 7 && pion_adverse(pion, -2, 1)){
        verif_echec(pion, -2, 1, 'c')
    }
    if(Number(pion.case[0]) + 2 <= 7 && Number(pion.case[1]) - 1 >= 0 && pion_adverse(pion, 2, -1)){
        verif_echec(pion, 2, -1, 'c')
    }
    if(Number(pion.case[0]) + 2 <= 7 && Number(pion.case[1]) + 1 <= 7 && pion_adverse(pion, 2, 1)){
        verif_echec(pion, 2, 1, 'c')
    }
    if(Number(pion.case[0]) - 1 >= 0 && Number(pion.case[1])- 2 >= 0 && pion_adverse(pion, -1, -2)){
        verif_echec(pion, -1, -2, 'c')
    }
    if(Number(pion.case[0]) + 1 <= 7 && Number(pion.case[1]) - 2 >= 0 && pion_adverse(pion, 1, -2)){
        verif_echec(pion, 1, -2, 'c')
    }
    if(Number(pion.case[0]) - 1 >= 0 && Number(pion.case[1]) + 2 <= 7 && pion_adverse(pion, -1, 2)){
        verif_echec(pion, -1, 2, 'c')
    }
    if(Number(pion.case[0]) + 1 <= 7 && Number(pion.case[1]) + 2 <= 7 && pion_adverse(pion, 1, 2)){
        verif_echec(pion, 1, 2, 'c')
    }
    let i = 1
    while(Number(pion.case[0]) - i > - 1 && Number(pion.case[1]) - i > - 1 && (case_deplacement(pion, -i, -i) || pion_adverse(pion, -i, -i))){
        if(i == 1){
            if(verif_echec(pion, -i, -i, 'p') || verif_echec(pion, -i, -i, 'r')){break;}
        }
        if(verif_echec(pion, -i, -i, 'f') || verif_echec(pion, -i, -i, 'd')){break;}
        i += 1
    }
    i = 1
    while(Number(pion.case[0]) - i > - 1 && Number(pion.case[1]) + i < 8 && (case_deplacement(pion, -i, i) || pion_adverse(pion, -i, i))){
        if(i == 1){
            if(verif_echec(pion, -i, i, 'p') || verif_echec(pion, -i, i, 'r')){break;}
        }
        if(verif_echec(pion, -i, i, 'f') || verif_echec(pion, -i, i, 'd')){break;}
        i += 1
    }
    i = 1
    while(Number(pion.case[0]) + i < 8 && Number(pion.case[1]) - i > - 1 && (case_deplacement(pion, i, -i) || pion_adverse(pion, i, -i))){
        if(i == 1){
            if(verif_echec(pion, i, -i, 'p') || verif_echec(pion, i, -i, 'r')){break;}
        }
        if(verif_echec(pion, i, -i, 'f') || verif_echec(pion, i, -i, 'd')){break;}
        i += 1
    }
    i = 1
    while(Number(pion.case[0]) + i < 8 && Number(pion.case[1]) + i < 8 && (case_deplacement(pion, i, i) || pion_adverse(pion, i, i))){
        if(i == 1){
            if(verif_echec(pion, i, i, 'p') || verif_echec(pion, i, i, 'r')){break;}
        }
        if(verif_echec(pion, i, i, 'f') || verif_echec(pion, i, i, 'd')){break;}
        i += 1
    }
    i = 1
    while(Number(pion.case) - i * 10 > -1 && (case_deplacement(pion, -i, 0) || pion_adverse(pion, -i, 0))){
        if(i == 1){
            if(verif_echec(pion, -i, 0, 'p') || verif_echec(pion, -i, 0, 'r')){
                break;}
        }
        if(verif_echec(pion, -i, 0, 't') || verif_echec(pion, -i, 0, 'd')){break;}
        i += 1
    }
    i = 1
    while(Number(pion.case) + i * 10 < 78 && (case_deplacement(pion, i, 0) || pion_adverse(pion, i, 0))){
        if(i == 1){
            if(verif_echec(pion, i, 0, 'p') || verif_echec(pion, i, 0, 'r')){
                break;}
        }
        if(verif_echec(pion, i, 0, 't') || verif_echec(pion, i, 0, 'd')){break;}
        i += 1
        
    }
    i = 1
    while(Number(pion.case[1]) - i > -1 && (case_deplacement(pion, 0, -i) || pion_adverse(pion, 0, -i))){
        if(i == 1){
            if(verif_echec(pion, 0, -i, 'p') || verif_echec(pion, 0, -i, 'r')){
                break;}
        }
        if(verif_echec(pion, 0, -i, 't') || verif_echec(pion, 0, -i, 'd')){break;}
        i += 1
    }
    i = 1
    while(Number(pion.case[1]) + i < 8 && (case_deplacement(pion, 0, i) || pion_adverse(pion, 0, i))){
        if(i == 1){
            if(verif_echec(pion, 0, i, 'p') || verif_echec(pion, 0, i, 'r')){
                break;
            }
        }
        if(verif_echec(pion, 0, i, 't') || verif_echec(pion, 0, i, 'd')){break;}
        i += 1
    }
    if(pion_adverses.length > 0){
        pion.echec = true
        console.log("echec", pion, pion_adverses)
    }
    else{
        pion.echec = false
        console.log("pas echec", pion)
    }
    reinitialiser()
}

function deplacement(frame){
    if(frame.couleur == 2){
        if(pion_selection.id[1] == 'p' && ! pion_selection.move){pion_selection.move = true}
        pion_selection.style.top = String(rect.top + Number(frame.id[0]) * 100) + "px"
        pion_selection.style.left = String(rect.left + Number(frame.id[1]) * 100) + "px"
        sonDeplacement(frame)
        dernierDeplacement(frame)
        document.getElementById(pion_selection.case).pion = null
        frame.pion = pion_selection
        pion_selection.case = frame.id
        QI()
        tour += 1     
    }
    reinitialiser()
    if(tour % 2 == 0){
        echec(document.getElementById("br"))
    }
    else{
        echec(document.getElementById("nr"))
    }
}

function reinitialiser(){
    for(let i = 0; i < 8; i++){
        for(let j = 0; j < 8; j++){
            let frame = document.getElementById(String(i) + String(j))
            if(frame.couleur == 2){
                frame.couleur = (i+j) % 2
            }
            if(frame.couleur == 0){
                frame.src = "Image/case_blanc.png"
            }
            if(frame.couleur == 1){
                frame.src = "Image/case_noir.png"
            }   
            if(frame.couleur == 3){
                frame.src = "Image/case_jaune.png"          
                frame.couleur = (i+j) % 2
            }
        }
    }
    for(let i = 0; i < pion_adverses.length; i ++){
        if(pion_adverses[i].id[0] == 'n'){pion_adverses[i].src = "Image/Noir/" + String(pion_adverses[i].id) + ".png"}   
        else{pion_adverses[i].src = "Image/Blanc/" + String(pion_adverses[i].id) + ".png"}
    }
    pion_adverses = []
}

function sonDeplacement(frame){
    let SonMove = document.createElement("audio")
    if(frame.pion != null){
        SonMove.src = "Sounds/mort" + String(Math.floor(Math.random() * 11)) + ".mp3"
    }
    else{
        SonMove.src = "Sounds/move" + String(Math.floor(Math.random() * 7)) + ".mp3"
    }
    SonMove.play()
}

function QI(){
    if(tour % 2 == 0){
        QI_blanc += Math.floor(Math.random() * (200) - 100)
        document.getElementById("QI_blanc").innerHTML = "QI : " + String(QI_blanc)
    }
    else{
        QI_noir += Math.floor(Math.random() * (200) - 100)
        document.getElementById("QI_noir").innerHTML = "QI : " + String(QI_noir)
    }
}

function dernierDeplacement(frame){
    document.getElementById(pion_selection.case).couleur = 3
    frame.couleur = 3
    
}

function gagner(){
    let canvas = document.createElement("canvas")
    canvas.id = "canvas"
    canvas.style.position = "absolute"
    canvas.style.top = String(rect.top) + "px"
    canvas.style.left = String(rect.left) + "px"
    canvas.style.backgroundColor = "rgba(224,224,224, 0.85)"
    canvas.style.width = "800px"
    canvas.style.height = "800px"
    canvas.style.zIndex = "1"
    document.body.appendChild(canvas)

    let bouton = document.createElement("img")
    bouton.id = "image"
    bouton.innerHTML = "REJOUER"
    // bouton.style.width = "200px"
    // bouton.style.height = "100px"
    // bouton.style.borderRadius = "75%"
    bouton.style.top = String(rect.top + 500) + "px"
    bouton.style.left = String(rect.left + 300) + "px"
    bouton.style.position = "absolute"
    bouton.style.zIndex = "2"
    // bouton.style.backgroundImage = "url(Image/therock.png)"
    bouton.src = "Image/buzzer.png"
    bouton.onclick = function(){rejouer()}
    document.body.appendChild(bouton)

}

function rejouer(){
    document.getElementById("image").remove()
    document.getElementById("canvas").remove()
    let images = document.getElementsByTagName("img")
    l = images.length
    for (let i = 0; i < l; i++) {
        images[0].remove()
    }
    Initialisation()
}

Initialisation()