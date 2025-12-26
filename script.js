const quotes=[
"Même quand les mots nous trahissent, nos actions peuvent exprimer ce que le cœur ressent vraiment.",
"Chaque geste de pardon et de compréhension guérit les blessures invisibles.",
"Ne crains pas d’avancer seul, le courage se construit pas à pas.",
"Ce n’est pas la force qui définit l’âme, mais la persévérance.",
"Le chemin peut être long, mais chaque pas compte.",
"La vraie victoire commence à l’intérieur."
]

const q=document.getElementById('quote')
q.textContent=quotes[Math.floor(Math.random()*quotes.length)]

const c=document.querySelector('.container')
for(let i=0;i<30;i++){
const p=document.createElement('div')
p.className='particle'
p.style.left=Math.random()*innerWidth+'px'
p.style.animationDuration=5+Math.random()*5+'s'
p.style.width=2+Math.random()*6+'px'
p.style.height=p.style.width
c.appendChild(p)
}

const bar=document.querySelector('.progress')
let w=0
const t=setInterval(()=>{
w++
bar.style.width=w+'%'
if(w>=100){
clearInterval(t)
document.body.classList.add('fade-out')
setTimeout(()=>location.replace('home.html'),500)
}
},30)