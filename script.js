// AJOUTER //
/*
    IMPORTANT :             
- Pouvoir gagner
- Style global du site
- rock
- prise en passant

    OPTIONEL:
- Animation du deplacement des pions
- Deplacer les pions en "drag and drop"
- mode de jeu pions aléatoires
*/

var rect = document.getElementById("plateau").getBoundingClientRect()

var largeur= Math.floor(screen.width / 20)

var Grille = [
["nt", "nc", "nf", "nd", "np", "np", "nc", "nt"],
["np", "np", "np", "np", "nr", "np", "np", "np"],
[null, null, null, null, null, null, null, null],
[null, null, null, null, null, null, null, null],
[null, null, null, null, "bd", null, null, null],
[null, null, null, null, null, null, null, null],
["bp", "bp", "bp", "bp", "bp", "bp", "bp", "bp"],
["bt", "bc", "bf", "bp", "br", "bf", "bc", "bt"]]

var pion_selection = null
var pion_adverses = []
var pion_echec = []
var tour = 0
var QI_blanc = 100
var QI_noir = 100

var fond = document.createElement('audio')
fond.src = "Sounds/fond" + String(Math.floor(Math.random() * 2)) + ".mp3"
fond.volume = 1
fond.loop = true

function Initialisation(){
    document.getElementById("plateau").style.left = String(screen.width / 2 - largeur * 4) + "px"
    document.getElementById("plateau").style.width = String(largeur * 8) + "px"
    document.getElementById("plateau").style.height = String(largeur * 8) + "px"
    // rect = document.getElementById("plateau").getBoundingClientRect()

    for(let i = 0; i < 8; i++){
        for(let j = 0; j < 8; j++){
            
            let frame = document.createElement("img")
            frame.id = String(i) + String(j)
            frame.echec = false
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

            frame.style.left = String(j * largeur) + "px"
            frame.style.top = String(i * largeur) + "px"
            frame.style.width = String(largeur) + "px"
            // frame.style.height = String(largeur) + "px"
            frame.style.position = "absolute"

            if(Grille[i][j] != null){ 
                let pion = document.createElement("img")
                pion.frame = String(i) + String(j)
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
                pion.style.left = String(j * largeur) + "px"
                pion.style.top = String(i * largeur) + "px"
                pion.style.width = String(largeur) + "px"
                // pion.style.height = String(largeur) + "px"
                
                frame.pion = pion
            }
            else{
                frame.pion = null
            }
        }
    }

    document.getElementById("pions_noirs_morts").style.left = String(screen.width / 2 - largeur * 7) + "px"
    document.getElementById("pions_noirs_morts").style.top = String(rect.top + largeur) + "px"
    document.getElementById("pions_noirs_morts").style.width = String( 3 * largeur) + "px"
    document.getElementById("pions_noirs_morts").style.height = String(6 * largeur) + "px"

    document.getElementById("pions_blancs_morts").style.left = String(screen.width / 2 + largeur * 4) + "px"
    document.getElementById("pions_blancs_morts").style.top = String(rect.top + largeur) + "px"
    document.getElementById("pions_blancs_morts").style.width = String( 3 * largeur) + "px"
    document.getElementById("pions_blancs_morts").style.height = String(6 * largeur) + "px"

    document.getElementById("QI_blanc").style.top = String(rect.top + 7 * largeur) + "px"
    document.getElementById("QI_blanc").style.left = String(screen.width / 2 + largeur * 5) + "px"
    document.getElementById("QI_blanc").style.width = String(largeur) + "px"
    document.getElementById("QI_blanc").style.height = String(largeur) + "px"

    document.getElementById("QI_noir").style.top = String(rect.top) + "px"
    document.getElementById("QI_noir").style.left = String(screen.width / 2 - largeur * 6) + "px"
    document.getElementById("QI_noir").style.width = String(largeur) + "px"
    document.getElementById("QI_noir").style.height = String(largeur) + "px"

    document.getElementById("canvas").style.width = String(largeur * 8) + "px"
    document.getElementById("canvas").style.height = String(largeur * 8) + "px"

    document.getElementById("image").style.top = String(5 * largeur) + "px"
    document.getElementById("image").style.left = String(3 * largeur) + "px"
    document.getElementById("image").style.width = String(2 * largeur) + "px"
    document.getElementById("image").style.height = String(largeur) + "px"

    document.getElementById("text").style.width = String(4 * largeur) + "px"
    document.getElementById("text").style.top = String(3 * largeur) + "px"
    document.getElementById("text").style.left = String(largeur * 2) + "px"

    document.getElementById("pions_changement").style.top = String(3 * largeur) + "px"
    document.getElementById("pions_changement").style.left = String(3 * largeur) + "px"
    document.getElementById("pions_changement").style.width = String(2 * largeur) + "px"
    document.getElementById("pions_changement").style.height = String(2 * largeur) + "px"

    let Son = document.createElement("img")
    Son.id = "son"
    Son.src = "Image/soundOff.png"
    Son.style.width = String(largeur) + "px"
    Son.style.height = String(largeur) + "px"
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

    // TEST
    /* */
    let button = document.createElement("button")
    button.style.width = String(2 * largeur) + "px"
    button.style.height = String(largeur) + "px"
    button.style.top = String(rect.top + 8 * largeur) + "px"
    button.style.left = String(screen.width / 2 - largeur) + "px"
    button.style.backgroundImage = "url(Image/therock.png)"
    button.style.position = "absolute"
    button.style.fontSize = String(largeur / 2) + "px"
    button.style.fontFamily = "IMPACT"
    button.style.color = "red"
    button.innerHTML = "GAGNER"
    button.onclick = function(){gagner()}
    document.body.appendChild(button)
    /* */
}

// Rends un case accessible par un pion
function case_rose(pion, i1, i2){
    let frame = document.getElementById(String(Number(pion.frame[0]) + i1 + String(Number(pion.frame[1]) + i2)))
    if((Number(pion.frame[0]) + i1 + Number(pion.frame[1]) + i2) % 2 == 0){
        if(frame.echec){
            frame.src = "Image/croix_rouge.png"
        }
        else{
            frame.src = "Image/croix_blanc.png"
        }
    }
    else{
        if(frame.echec){
            frame.src = "Image/croix_rouge.png"
        }
        else{
            frame.src = "Image/croix_noir.png"
        }
    }
    
    frame.couleur = 2
}

// Renvoie True si une case est vide
function case_deplacement(pion, i1, i2){
    if(document.getElementById(String(Number(pion.frame[0]) + i1 + String(Number(pion.frame[1]) + i2))).pion == null){
        return true
    }
    return false
}

// Renvoie True si il y a un pion adverse sur la case
function pion_adverse(pion, i1, i2){
    if(! case_deplacement(pion, i1, i2)){ // temp
        if(document.getElementById(String(Number(pion.frame[0]) + i1 + String(Number(pion.frame[1]) + i2))).pion.id[0] != pion.id[0]){
            return true
        }
    }
    return false
}

// Renvoie True si il y a un pion adverse sur la case et ajoute le pion a la liste pion_adverses
function attaque(pion, i1, i2){
    if(! case_deplacement(pion, i1, i2) && pion_adverse(pion, i1, i2)){
        document.getElementById(String(Number(pion.frame[0]) + i1 + String(Number(pion.frame[1]) + i2))).couleur = 2
        pion_adverses.push(document.getElementById(String(Number(pion.frame[0]) + i1 + String(Number(pion.frame[1]) + i2))).pion)
        return true
    }
    return false
}

function croquer(pion){
    deplacement(document.getElementById(pion.frame))
    pion.onclick = function(){return}
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

function test_sur_plateau(pion, i1, i2){
    return Number(pion.frame[0]) + i1 >= 0 && Number(pion.frame[0]) + i1 <= 7 && Number(pion.frame[1]) + i2 >= 0 && Number(pion.frame[1]) + i2 <= 7
}

function test_case_accessible(pion, i1, i2){
    return case_deplacement(pion, i1, i2) || pion_adverse(pion, i1, i2)
}

function Cava(pion){
    if(pion_adverses.includes(pion)){
        croquer(pion)
        return
    }
    if(tour % 2 == 0 && pion.id[0] == 'n' || tour % 2 == 1 && pion.id[0] == 'b'){return}
    reinitialiser()
    pion_selection = pion
    if(test_sur_plateau(pion, -2, -1) && test_case_accessible(pion, -2, -1) && verif_case_echec(pion, -2, -1)){
        if(! attaque(pion, -2, -1)){case_rose(pion, -2, -1)}
    }
    if(test_sur_plateau(pion, -2, 1) && test_case_accessible(pion, -2, 1) && verif_case_echec(pion, -2, 1)){
        if(! attaque(pion, -2, 1)){case_rose(pion, -2, 1)}              
    }
    if(test_sur_plateau(pion, 2, -1) && test_case_accessible(pion, 2, -1) && verif_case_echec(pion, 2, -1)){
        if(! attaque(pion, 2, -1)){case_rose(pion, 2, -1)}                
    }
    if(test_sur_plateau(pion, 2, 1) && test_case_accessible(pion, 2, 1) && verif_case_echec(pion, 2, 1)){
        if(! attaque(pion, 2, 1)){case_rose(pion, 2, 1)}               
    }
    if(test_sur_plateau(pion, -1, -2) && test_case_accessible(pion, -1, -2) && verif_case_echec(pion, -1, -2)){
        if(! attaque(pion, -1, -2)){case_rose(pion, -1, -2)}               
    }
    if(test_sur_plateau(pion, 1, -2) && test_case_accessible(pion, 1, -2) && verif_case_echec(pion, 1, -2)){
        if(! attaque(pion, 1, -2)){case_rose(pion, 1, -2)}                
    }
    if(test_sur_plateau(pion, -1, 2) && test_case_accessible(pion, -1, 2) && verif_case_echec(pion, -1, 2)){
        if(! attaque(pion, -1, 2)){case_rose(pion, -1, 2)}               
    }
    if(test_sur_plateau(pion, 1, 2) && test_case_accessible(pion, 1, 2) && verif_case_echec(pion, 1, 2)){
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
    while(test_sur_plateau(pion, -i, -i) && test_case_accessible(pion, -i, -i)){
        if(verif_case_echec(pion, -i, -i)){
            if(attaque(pion, -i, -i)){break;}
            case_rose(pion, -i, -i)
        }
        i += 1
    }
    i = 1
    while(test_sur_plateau(pion, -i, i) && test_case_accessible(pion, -i, i)){
        if(verif_case_echec(pion, -i, i)){
            if(attaque(pion, -i, i)){break;}
            case_rose(pion, -i, i)
        }
        i += 1
    }
    i = 1
    while(test_sur_plateau(pion, i, -i) && test_case_accessible(pion, i, -i)){
        if(verif_case_echec(pion, i, -i)){
            if(attaque(pion, i, -i)){break;}
            case_rose(pion, i, -i)
        }
        i += 1
    }
    i = 1
    while(test_sur_plateau(pion, i, i) && test_case_accessible(pion, i, i)){
        if(verif_case_echec(pion, i, i)){
            if(attaque(pion, i, i)){break;}
            case_rose(pion, i, i)
        }
        i += 1
    }
    i = 1
    while(test_sur_plateau(pion, -i, 0) && test_case_accessible(pion, -i, 0)){
        if(verif_case_echec(pion, -i, 0)){
            if(attaque(pion, -i, 0)){break;}
            case_rose(pion, -i, 0)
        }
        i += 1
    }
    i = 1
    while(test_sur_plateau(pion, i, 0) && test_case_accessible(pion, i, 0)){
        if(verif_case_echec(pion, i, 0)){
            if(attaque(pion, i, 0)){break;}
            case_rose(pion, i, 0)
        }
        i += 1
        
    }
    i = 1
    while(test_sur_plateau(pion, 0, -i) && test_case_accessible(pion, 0, -i)){
        if(verif_case_echec(pion, 0, -i)){
            if(attaque(pion, 0, -i)){break;}
            case_rose(pion, 0, -i)
        }
        i += 1
    }
    i = 1
    while(test_sur_plateau(pion, 0, i) && test_case_accessible(pion, 0, i)){
        if(verif_case_echec(pion, 0, i)){
            if(attaque(pion, 0, i)){break;}
            case_rose(pion, 0, i)
        }
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
    while(test_sur_plateau(pion, -i, -i) && test_case_accessible(pion, -i, -i)){
        if(verif_case_echec(pion, -i, -i)){
            if(attaque(pion, -i, -i)){break;}
            case_rose(pion, -i, -i)
        }
        i += 1
    }
    i = 1
    while(test_sur_plateau(pion, -i, i) && test_case_accessible(pion, -i, i)){
        if(verif_case_echec(pion, -i, i)){
            if(attaque(pion, -i, i)){break;}
            case_rose(pion, -i, i)
        }
        i += 1
    }
    i = 1
    while(test_sur_plateau(pion, i, -i) && test_case_accessible(pion, i, -i)){
        if(verif_case_echec(pion, i, -i)){
            if(attaque(pion, i, -i)){break;}
            case_rose(pion, i, -i)
        }
        i += 1
    }
    i = 1
    while(test_sur_plateau(pion, i, i) && test_case_accessible(pion, i, i)){
        if(verif_case_echec(pion, i, i)){
            if(attaque(pion, i, i)){break;}
            case_rose(pion, i, i)
        }
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
            if(Number(pion.frame[0]) - 1 >= 0 && case_deplacement(pion, -1, 0) && verif_case_echec(pion, -1, 0)){
                case_rose(pion, -1, 0)
            }
            if(Number(pion.frame[0]) - 1 >= 0 && Number(pion.frame[1]) - 1 >= 0 && verif_case_echec(pion, -1, -1)){
                attaque(pion, -1, -1)
            }
            if(Number(pion.frame[0]) - 1 >= 0 && Number(pion.frame[1]) + 1 <= 7 && verif_case_echec(pion, -1, 1)){
                attaque(pion, -1, 1)
            }
            if(! pion.move){
                if(Number(pion.frame[0]) - 2 >= 0 && case_deplacement(pion, -2, 0) && case_deplacement(pion, -1, 0) && verif_case_echec(pion, -2, 0)){
                    case_rose(pion, -2, 0)
                }
            }
            break;
        case "np":
            if(Number(pion.frame[0]) + 1 <= 7 && case_deplacement(pion, 1, 0) && verif_case_echec(pion, 1, 0)){
                case_rose(pion, 1, 0)
            }
            if(Number(pion.frame[0]) + 1 <= 7 && Number(pion.frame[1]) - 1 >= 0 && verif_case_echec(pion, 1, -1)){
                attaque(pion, 1, -1)
            }
            if(Number(pion.frame[0]) + 1 <= 7 && Number(pion.frame[1]) + 1 <= 7 && verif_case_echec(pion, 1, 1)){
                attaque(pion, 1, 1)
            }
            if(! pion.move){
                if(Number(pion.frame[0]) + 2 <= 7 && case_deplacement(pion, 2, 0) && case_deplacement(pion, 1, 0) && verif_case_echec(pion, 2, 0)){
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
    if(test_sur_plateau(pion, 1, 0) && test_case_accessible(pion, 1, 0)){
        if(! attaque(pion, 1, 0)){case_rose(pion, 1, 0)}
    }
    if(test_sur_plateau(pion, -1, 0) && test_case_accessible(pion, -1, 0)){
        if(! attaque(pion, -1, 0)){case_rose(pion, -1, 0)}
    }
    if(test_sur_plateau(pion, 0, 1) && test_case_accessible(pion, 0, 1)){
        if(! attaque(pion, 0, 1)){case_rose(pion, 0, 1)}
    }
    if(test_sur_plateau(pion, 0, -1) && test_case_accessible(pion, 0, -1)){
        if(! attaque(pion, 0, -1)){case_rose(pion, 0, -1)}
    }

    if(test_sur_plateau(pion, 1, 1) && test_case_accessible(pion, 1, 1)){
        if(! attaque(pion, 1, 1)){case_rose(pion, 1, 1)}
    }
    if(test_sur_plateau(pion, -1, -1) && test_case_accessible(pion, -1, -1)){
        if(! attaque(pion, -1, -1)){case_rose(pion, -1, -1)}
    }
    if(test_sur_plateau(pion, 1, -1) && test_case_accessible(pion, 1, -1)){
        if(! attaque(pion, 1, -1)){case_rose(pion, 1, -1)}
    }
    if(test_sur_plateau(pion, -1, 1) && test_case_accessible(pion, -1, 1)){
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

    while(test_sur_plateau(pion, -i, 0) && test_case_accessible(pion, -i, 0)){
        if(verif_case_echec(pion, -i, 0)){
            if(attaque(pion, -i, 0)){break;}
            case_rose(pion, -i, 0)
        }
        i += 1
    }
    i = 1

    while(test_sur_plateau(pion, i, 0) && test_case_accessible(pion, i, 0)){
        if(verif_case_echec(pion, i, 0)){
            if(attaque(pion, i, 0)){break;}
            case_rose(pion, i, 0)
        }
        i += 1
        
    }
    i = 1

    while(test_sur_plateau(pion, 0, -i) && test_case_accessible(pion, 0, -i)){
        if(verif_case_echec(pion, 0, -i)){
            if(attaque(pion, 0, -i)){break;}
            case_rose(pion, 0, -i)
        }
        i += 1
    }
    i = 1

    while(test_sur_plateau(pion, 0, i) && test_case_accessible(pion, 0, i)){
        if(verif_case_echec(pion, 0, i)){
            if(attaque(pion, 0, i)){break;}
            case_rose(pion, 0, i)
        }
        i += 1
    }
    for(let i = 0; i < pion_adverses.length; i ++){
        pion_adverses[i].src = "Image/mort.png"
    }
}

function verif_echec(pion, i1, i2, type){
    let frame = document.getElementById(String(Number(pion.frame[0]) + i1) + (String(Number(pion.frame[1]) + i2)))
    if(frame.pion != null && frame.pion.id[0] != pion.id[0] && frame.pion.id[1] == type){
        
        pion_echec.push(frame.pion)
        if(i1 == 0){
            case_interdite(pion.frame[0], String(Number(pion.frame[1]) + i2 / Math.abs(i2))) 
        }
        if(i2 == 0){
            case_interdite(String(Number(pion.frame[0]) + i1 / Math.abs(i1)), pion.frame[1])
        }
        if(i1 != 0 && i2 != 0){
            case_interdite(String(Number(pion.frame[0]) + i1 / Math.abs(i1)), String(Number(pion.frame[1]) + i2 / Math.abs(i2)))
        }
        return true
    }
    return false
}

function case_interdite(i1, i2){
    let frame = document.getElementById(i1 + i2)
    frame.src = "Image/case_rouge.png"
    frame.echec = true
    document.getElementById(pion_echec[pion_echec.length - 1].frame).src = "Image/case_rouge.png"
    document.getElementById(pion_echec[pion_echec.length - 1].frame).echec = true
}

function echec(pion){
    pion_echec = []
    if(test_sur_plateau(pion, -2, -1) && pion_adverse(pion, -2, -1)){
        verif_echec(pion, -2, -1, 'c')
    }
    if(test_sur_plateau(pion, -2, 1) && pion_adverse(pion, -2, 1)){
        verif_echec(pion, -2, 1, 'c')
    }
    if(test_sur_plateau(pion, 2, -1) && pion_adverse(pion, 2, -1)){
        verif_echec(pion, 2, -1, 'c')
    }
    if(test_sur_plateau(pion, 2, 1) && pion_adverse(pion, 2, 1)){
        verif_echec(pion, 2, 1, 'c')
    }
    if(test_sur_plateau(pion, -1, -2) && pion_adverse(pion, -1, -2)){
        verif_echec(pion, -1, -2, 'c')
    }
    if(test_sur_plateau(pion, 1, -2) && pion_adverse(pion, 1, -2)){
        verif_echec(pion, 1, -2, 'c')
    }
    if(test_sur_plateau(pion, -1, 2) && pion_adverse(pion, -1, 2)){
        verif_echec(pion, -1, 2, 'c')
    }
    if(test_sur_plateau(pion, 1, 2) && pion_adverse(pion, 1, 2)){
        verif_echec(pion, 1, 2, 'c')
    }
    let i = 1
    while(test_sur_plateau(pion, -i, -i) && test_case_accessible(pion, -i, -i)){
        if(i == 1){
            if(verif_echec(pion, -i, -i, 'p') || verif_echec(pion, -i, -i, 'r')){break;
            }
        }
        if(verif_echec(pion, -i, -i, 'f') || verif_echec(pion, -i, -i, 'd')){break;}
        i += 1
    }
    i = 1
    while(test_sur_plateau(pion, -i, i) && test_case_accessible(pion, -i, i)){
        
        if(i == 1){
            if(verif_echec(pion, -i, i, 'p') || verif_echec(pion, -i, i, 'r')){break;}
        }
        if(verif_echec(pion, -i, i, 'f') || verif_echec(pion, -i, i, 'd')){break;}
        i += 1
    }
    i = 1
    while(test_sur_plateau(pion, i, -i) && test_case_accessible(pion, i, -i)){
        if(i == 1){
            if(verif_echec(pion, i, -i, 'p') || verif_echec(pion, i, -i, 'r')){break;}
        }
        if(verif_echec(pion, i, -i, 'f') || verif_echec(pion, i, -i, 'd')){break;}
        i += 1
    }
    i = 1
    while(test_sur_plateau(pion, i, i) && test_case_accessible(pion, i, i)){
        
        if(i == 1){
            if(verif_echec(pion, i, i, 'p') || verif_echec(pion, i, i, 'r')){break;}
        }
        if(verif_echec(pion, i, i, 'f') || verif_echec(pion, i, i, 'd')){break;}
        i += 1
    }
    i = 1
    while(test_sur_plateau(pion, -i, 0) && test_case_accessible(pion, -i, 0)){
        if(i == 1){
            if(verif_echec(pion, -i, 0, 'r')){
                break;}
        }
        if(verif_echec(pion, -i, 0, 't') || verif_echec(pion, -i, 0, 'd')){break;}
        i += 1
    }
    i = 1
    while(test_sur_plateau(pion, i, 0) && test_case_accessible(pion, i, 0)){
        if(i == 1){
            if(verif_echec(pion, i, 0, 'r')){
                break;}
        }
        if(verif_echec(pion, i, 0, 't') || verif_echec(pion, i, 0, 'd')){break;}
        i += 1
    }
    i = 1
    while(test_sur_plateau(pion, 0, -i) && test_case_accessible(pion, 0, -i)){
        if(i == 1){
            if(verif_echec(pion, 0, -i, 'r')){
                break;}
        }
        if(verif_echec(pion, 0, -i, 't') || verif_echec(pion, 0, -i, 'd')){break;}
        i += 1
    }
    i = 1
    while(test_sur_plateau(pion, 0, i) && test_case_accessible(pion, 0, i)){
        if(i == 1){
            if(verif_echec(pion, 0, i, 'r')){
                break;
            }
        }
        if(verif_echec(pion, 0, i, 't') || verif_echec(pion, 0, i, 'd')){break;}
        i += 1
    }
    if(pion_echec.length > 0){
        pion.echec = true
        son_echec()
    }
    else{
        pion.echec = false
    }
}

function echec_et_mat(pion){
    let frame = pion.frame
    let positions = [[1, 0], [0, 1], [-1, 0], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]]
    for(let i = 0; i < positions.length; i++){
        if(test_sur_plateau(pion, positions[i][0], positions[i][1]) && test_case_accessible(pion, positions[i][0], positions[i][1])){
            pion.frame = String(Number(pion.frame[0]) + positions[i][0]) + String(Number(pion.frame[1]) + positions[i][1])
            echec(pion)
            pion.frame = frame
        }
    }
}

function verif_case_echec(pion, i1, i2){
    if(pion_echec.length > 0){
        let frame = document.getElementById(String(Number(pion.frame[0]) + i1) + String(Number(pion.frame[1]) + i2))
        if(frame.echec == true){return true}
        for(let i = 0; i < pion_echec.length; i++){
            if(pion_echec[i].frame == frame.id){
                return true
            }
        }
        return false
    }
    return true
}

function deplacement(frame){
    if(frame.couleur == 2){
        if(pion_selection.id[1] == 'p' && ! pion_selection.move){pion_selection.move = true}
        pion_selection.style.top = String(Number(frame.id[0]) * largeur) + "px"
        pion_selection.style.left = String(Number(frame.id[1]) * largeur) + "px"
        sonDeplacement(frame)
        dernierDeplacement(frame)
        document.getElementById(pion_selection.frame).pion = null
        frame.pion = pion_selection
        pion_selection.frame = frame.id
        if((pion_selection.frame[0] == "0" && pion_selection.id == "bp") || (pion_selection.frame[0] == "7" && pion_selection.id == "np")){changement_pion(pion_selection)}
        
        QI()
        tour += 1

        reinitialiser_case_echec()
        if(tour % 2 == 0){
            echec(document.getElementById("br"))
            echec_et_mat(document.getElementById("br"))
        }
        else{
            echec(document.getElementById("nr"))
            echec_et_mat(document.getElementById("nr"))
        }
    }
    reinitialiser()
}

function changement_pion(pion){
    let pions = ["d", "t", "c", "f"]
    document.getElementById("canvas").style.zIndex = "2"

    document.getElementById("pions_changement").style.zIndex = "2"
    pions_changement = document.getElementsByClassName("pions_changement")

    for (let i = 0; i < pions_changement.length; i++) {
        pions_changement[i].style.width = String(largeur) + "px"
        if(pion.id[0] == "b"){
            pions_changement[i].src = "Image/Blanc/b" + pions[i] + ".png"
        }
        else{
            pions_changement[i].src = "Image/Noir/n" + pions[i] + ".png"
        }
        
        pions_changement[i].onclick = function(){
            let pions = ["d", "t", "c", "f"]
            pion.src = this.src
            pion.id = pion.id[0] + pions[Number(this.id) - 1]
            switch(this.id){
                case "1":
                    pion.onclick = function(){Dame(this)}
                    break;
                case "2":
                    pion.onclick = function(){Tour(this)}
                    break;
                case "3":
                    pion.onclick = function(){Cava(this)}
                    break;
                case "4":
                    pion.onclick = function(){Fou(this)}
                    break;
            }
            document.getElementById("canvas").style.zIndex = "-1"
            document.getElementById("pions_changement").style.zIndex = "-1"
        }
    }
}

function reinitialiser_case_echec(){
    for(let i = 0; i < 8; i++){
        for(let j = 0; j < 8; j++){
            if(document.getElementById(String(i) + String(j)).echec){
                document.getElementById(String(i) + String(j)).echec = false
            }
        }
    }
}

function reinitialiser_case_blanc(frame){
    if(Math.floor(Math.random() * 10000) > 0){
        frame.src = "Image/case_blanc.png"
    }
    else{
        if(Math.floor(Math.random() * 100) > 0){
            frame.src = "Image/berthelon_blanc.png"
        }
        else{
            frame.src = "Image/prof_jaquot.png"
        }
    }
}

function reinitialiser_case_bnoir(frame){
    if(Math.floor(Math.random() * 10000) > 0){
        frame.src = "Image/case_noir.png"
    }
    else{
        if(Math.floor(Math.random() * 100) > 0){
            frame.src = "Image/berthelon_noir.png"
        }
        else{
            frame.src = "Image/prof_jaquot.png"
        }
    }
}

function reinitialiser(){
    for(let i = 0; i < 8; i++){
        for(let j = 0; j < 8; j++){
            let frame = document.getElementById(String(i) + String(j))
            if(! frame.echec){
                if(frame.couleur == 2){
                    frame.couleur = (i+j) % 2
                }
                if(frame.couleur == 0){
                    reinitialiser_case_blanc(frame)
                }
                if(frame.couleur == 1){
                    reinitialiser_case_bnoir(frame)
                }   
                if(frame.couleur == 3){
                    frame.src = "Image/case_jaune.png"     
                    frame.couleur = (i+j) % 2
                }
            }
            else{
                if(frame.couleur == 2){
                    frame.couleur = (i+j) % 2
                }
                if(frame.couleur == 0 || frame.couleur == 1){
                    frame.src = "Image/case_rouge.png"
                }
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
    for(let i = 0; i < 200; i++){
        let SonMove = document.createElement("audio")
        if(frame.pion != null){
            SonMove.src = "Sounds/mort" + String(Math.floor(Math.random() * 11)) + ".mp3"
        }
        else{
            SonMove.src = "Sounds/move" + String(Math.floor(Math.random() * 7)) + ".mp3"
        }
        SonMove.play()
    }
}

function son_echec(){
    let son = document.createElement("audio")
    son.src = "Sounds/echec" + String(Math.floor(Math.random() * 19)) + ".mp3"
    son.play()
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
    document.getElementById(pion_selection.frame).couleur = 3
    frame.couleur = 3
    
}

function gagner(){
    let canvas = document.getElementById("canvas")
    canvas.style.zIndex = "2"

    let image = document.getElementById("image")
    image.style.zIndex = "2"
    image.onclick = function(){rejouer()}

    let text = document.getElementById("text")
    text.style.fontSize = String(largeur / 2) + "px"
    text.style.zIndex = "2"
    text.innerHTML = "VICTOIRE DU JOUEUR ... !!"
}

function rejouer(){
    document.getElementById("QI_blanc").innerHTML = "QI : "
    document.getElementById("QI_noir").innerHTML = "QI : "
    QI_blanc = 100
    QI_noir = 100
    document.getElementById("image").style.zIndex = "-1"
    document.getElementById("canvas").style.zIndex = "-1"
    document.getElementById("text").style.zIndex = "-1"
    document.getElementById("pions_changement").style.zIndex = "-1"
    let images = document.getElementsByTagName("img")
    l = images.length
    for (let i = 5; i < l; i++) {
        images[5].remove()
    }
    Initialisation()
}

Initialisation()