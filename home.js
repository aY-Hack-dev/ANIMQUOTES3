let quotesData={}

const prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches
if(prefersDark)document.body.classList.add('dark-mode')

const themeToggle=document.getElementById('theme-toggle')
if(themeToggle){
themeToggle.classList.toggle('active',document.body.classList.contains('dark-mode'))
themeToggle.addEventListener('click',()=>{
document.body.classList.toggle('dark-mode')
themeToggle.classList.toggle('active')
if(typeof updateParticlesAnimation==='function')updateParticlesAnimation()
})
}

const menuBtn=document.getElementById('menu-btn')
const menuModal=document.getElementById('menu-modal')
const closeMenu=document.getElementById('close-menu')
const overlay=document.getElementById('overlay')

menuBtn.addEventListener('click',()=>{
menuModal.classList.add('visible')
overlay.classList.add('visible')
})

closeMenu.addEventListener('click',()=>{
menuModal.classList.remove('visible')
overlay.classList.remove('visible')
})

overlay.addEventListener('click',()=>{
menuModal.classList.remove('visible')
overlay.classList.remove('visible')
})

fetch('quotes.json').then(r=>r.json()).then(d=>{
quotesData=d
initSite()
})

function initSite(){
const cardsContainer=document.getElementById('anime-cards')
if(cardsContainer){
let list=Object.keys(quotesData).sort((a,b)=>a.localeCompare(b,'fr',{sensitivity:'base'}))
displayCards(list)
const searchInput=document.getElementById('search')
if(searchInput){
searchInput.addEventListener('input',()=>{
const t=searchInput.value.toLowerCase()
displayCards(list.filter(n=>n.toLowerCase().includes(t)))
})
}
}

const quoteSection=document.getElementById('quote-section')
if(!quoteSection)return

const animeName=new URLSearchParams(location.search).get('anime')
document.getElementById('anime-title').textContent=animeName

let currentIndex=0
const quotes=quotesData[animeName]||[{text:'Aucune citation trouvée',author:''}]
const textEl=document.querySelector('.text')
const authorEl=document.querySelector('.author')

function showQuote(i){
const q=quotes[i]
textEl.textContent=q.text
authorEl.textContent=q.author?'— '+q.author:''
}
showQuote(currentIndex)

document.getElementById('next').onclick=()=>{
currentIndex=(currentIndex+1)%quotes.length
showQuote(currentIndex)
}

document.getElementById('prev').onclick=()=>{
currentIndex=(currentIndex-1+quotes.length)%quotes.length
showQuote(currentIndex)
}

document.querySelector('.copy-btn').onclick=()=>{
navigator.clipboard.writeText(`${quotes[currentIndex].text}${quotes[currentIndex].author?' — '+quotes[currentIndex].author:''}`)
alert('Citation copiée ✅')
}

document.querySelector('.download-btn').onclick=()=>{
const c=document.createElement('canvas')
const x=c.getContext('2d')
const d=document.body.classList.contains('dark-mode')
c.width=900
c.height=450
const g=x.createLinearGradient(0,0,0,c.height)
if(d){g.addColorStop(0,'#0e0e0e');g.addColorStop(1,'#1c1c1c')}
else{g.addColorStop(0,'#fff');g.addColorStop(1,'#e9e9e9')}
x.fillStyle=g
x.fillRect(0,0,c.width,c.height)
x.fillStyle=d?'#fff':'#000'
x.font='32px Poppins'
wrapText(x,quotes[currentIndex].text,40,150,820,40)
x.font='26px Poppins'
x.fillText(`— ANIMQUOTES, ${quotes[currentIndex].author||''}`,40,380)
const a=document.createElement('a')
a.download=`${animeName}_quote.png`
a.href=c.toDataURL()
a.click()
}
}

function displayCards(list){
const c=document.getElementById('anime-cards')
if(!c)return
c.innerHTML=''
list.forEach(a=>{
const d=document.createElement('div')
d.className='card'
d.innerHTML=`<h3>${a}</h3>`
d.onclick=()=>location.href=`anime.html?anime=${encodeURIComponent(a)}`
c.appendChild(d)
})
}

function wrapText(ctx,text,x,y,maxWidth,lineHeight){
let words=text.split(' '),line=''
for(let i=0;i<words.length;i++){
let test=line+words[i]+' '
if(ctx.measureText(test).width>maxWidth&&i>0){
ctx.fillText(line,x,y)
line=words[i]+' '
y+=lineHeight
}else line=test
}
ctx.fillText(line,x,y)
}