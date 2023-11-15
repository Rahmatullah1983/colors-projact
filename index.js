//Global selectors and veraibles
const colorDivs = document.querySelectorAll('.color');
const generateBtn = document.querySelector('.generate');
const sliders = document.querySelectorAll('input[type="range"]');
const currentHexes = document.querySelectorAll('.color h2');
const popup = document.querySelector('.copy-container');
const adjustButton = document.querySelectorAll('.adjust');
const lockButton = document.querySelectorAll(".lock");
const closeAdjustments = document.querySelectorAll('.close-adjustment');
const sliderContainers = document.querySelectorAll(".sliders");
let initialColors;
//for local storage
let savedPalettes =[];
// add our event listners
generateBtn.addEventListener('click', randomColors);
        
    

sliders.forEach(slider => {
    slider.addEventListener("input", hslControls);
});
colorDivs.forEach((div, index) => {
    div.addEventListener("change", () => {
        updateTextUI(index);
    });
});
currentHexes.forEach(hex =>{
    hex.addEventListener('click',() =>{
        copyToClipboard(hex);
    
    })
})
popup.addEventListener("transitionend",()=>{
    const popupBox = popup.children[0];

    popup.classList.remove('active')
    popupBox.classList.remove('active');

    
   
})
adjustButton.forEach((button, index)=>{
    button.addEventListener('click',()=>{
        
        openAdjsutmentPanel(index);
    

    })
})
closeAdjustments.forEach((button,index)=>{
    button.addEventListener('click',()=>{

        closeAdjsutmentPanel(index);
    })
})

lockButton.forEach((button, index) => {
    button.addEventListener("click", e => {
      lockLayer(e, index);
    });
  });
    
//functions

function generateHax() {
    /* randum color by javaSript
      const letters = '#123456789ABCDEF';
        let hash= '#';
        for(let i = 0; i<6; i++){
            
            hash += letters[Math.floor(Math.random() * 16)];
        }
        return hash;*/
    const hexColor = chroma.random();
    return hexColor;

}



function randomColors() {
  
    initialColors = [];
    colorDivs.forEach((div, index) => {
      
        const hexText = div.children[0];
        randomColor = generateHax();
        //add it to the array
        if(div.classList.contains('locked')){
            initialColors.push(hexText.innerText)
            return;
        }else{
        initialColors.push(chroma(randomColor).hex());
        }
        //add the color to bg
        div.style.backgroundColor = randomColor;
        hexText.innerText = randomColor;

        checkTextContrast(randomColor, hexText);
        //Initial colrize Sliders
        const color = chroma(randomColor);
        const sliders = div.querySelectorAll('.sliders input');
        const hue = sliders[0];
        const brightness = sliders[1];
        const saturation = sliders[2];
        colorizeSliders(color, hue, brightness, saturation); 
    });      
        restInputs();
        //check for Button contrast
        adjustButton.forEach((button,index)=>{
            checkTextContrast(initialColors[index], button);
            checkTextContrast(initialColors[index], lockButton[index]);
        })
}

function checkTextContrast(color, text) {
    const luminance = chroma(color).luminance();
    if (luminance > 0.5) {
        text.style.color = "black";
    } else {
        text.style.color = "white";
    }
}
function colorizeSliders(color, hue, brightness, saturation) {
    //scale saturation
    const noSat = color.set("hsl.s", 0)
    const fullSat = color.set("hsl.s", 1);
    const scaleSat = chroma.scale([noSat, color, fullSat]);
    const midBright = color.set("hsl.l", 0.5);
    const scaleBright = chroma.scale(["black", midBright, "white"]);

    //Update input colors
    saturation.style.backgroundImage = `linear-gradient(to right, ${scaleSat(0)},${scaleSat(1)})`;
    brightness.style.backgroundImage = `linear-gradient(to right, ${scaleBright(0)},
${scaleBright(0.5)},${scaleSat(1)})`;
    hue.style.backgroundImage = `linear-gradient(to right,rgb(204,75,75),rgb(204,204,75),rgb(204,75,204),rgb(75,204,204)`

}
function hslControls(e) {
    const index =
        e.target.getAttribute("data-bright") ||
        e.target.getAttribute("data-sat") ||
        e.target.getAttribute("data-hue");
    
    let sliders = e.target.parentElement.querySelectorAll('input[type="range"]');
    const hue = sliders[0];
    const brightness = sliders[1];
    const saturation = sliders[2];
    const bgColor = initialColors[index];
        let color = chroma(bgColor)
        .set('hsl.s', saturation.value)
        .set('hsl.l', brightness.value)
        .set('hsl.h', hue.value);
    colorDivs[index].style.backgroundColor = color;
    //colorize inputs/sliders
colorizeSliders(color,hue,brightness,saturation);
}
function updateTextUI(index) {
    const activeDiv = colorDivs[index];
    const color = chroma(activeDiv.style.backgroundColor);
    const textHex = activeDiv.querySelector('h2');
    const icons = activeDiv.querySelectorAll('.controls button');
    textHex.innerText = color.hex();
    //check contrast
    checkTextContrast(color, textHex);
    for (icon of icons) {
        checkTextContrast(color, icon);
    }
}
function restInputs(){

    const sliders = document.querySelectorAll(".sliders input");
    sliders.forEach(slider =>{
        if(slider.name=='hue'){
            const hueColor = initialColors[slider.getAttribute('data-hue')];
            const hueValue =  chroma(hueColor).hsl()[0]
            slider.value= Math.floor(hueValue);


        }
        if(slider.name=='brightness'){
            const brightColor = initialColors[slider.getAttribute('data-bright')];
            const brightValue =  chroma(brightColor).hsl()[2]
    
            slider.value= Math.floor(brightValue *100) /100;


        }
        
        if(slider.name=='saturation'){
            const satColor = initialColors[slider.getAttribute('data-sat')];
            const satValue =  chroma(satColor).hsl()[1]
    
            slider.value= Math.floor(satValue);


        }
    })
}
function copyToClipboard(hex){
    const el = document.createElement('textarea');
    el.value = hex.innerText;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    //popup animation
const popupBox = popup.children[0];
popup.classList.add("active");
popupBox.classList.add("active");

}
function  openAdjsutmentPanel(index){
    sliderContainers[index].classList.toggle("active");
   
}

function  closeAdjsutmentPanel(index){
    sliderContainers[index].classList.remove("active");
   
} 
function lockLayer(e, index) {
    e.stopPropagation(); // Prevent event propagation to parent elements
    const lockSVG = e.target;
    const activeBg = colorDivs[index];

    if (lockSVG.classList.contains("fa-lock-open")) {
        lockSVG.classList.remove("fa-lock-open");
        lockSVG.classList.add("fa-lock");
        activeBg.classList.add("locked"); // Add the "locked" class to the color div
    } else {
        lockSVG.classList.remove("fa-lock");
        lockSVG.classList.add("fa-lock-open");
        activeBg.classList.remove("locked"); // Remove the "locked" class from the color div
    }
}
//implement save to palette and local storage

const saveBtn = document.querySelector(".save");
const submitSave = document.querySelector(".submit-save");
const closeSave = document.querySelector(".close-save");
const saveContainer= document.querySelector(".save-container");
const SaveInput = document.querySelector(".save-container input");
const libraryContainer = document.querySelector(".library-container");
const libraryBtn = document.querySelector(".library");
const closeLibraryBtn = document.querySelector(".close-library");
console.log(closeLibraryBtn);

//eventListners
saveBtn.addEventListener("click", openPalette);
closeSave.addEventListener("click", closePalette);
submitSave.addEventListener("click", savePalette);
libraryBtn.addEventListener("click", openLibrary);
closeLibraryBtn.addEventListener("click", closeLibrary);
function openPalette(e){
    const popup = saveContainer.children[0];
    saveContainer.classList.add('active');
    popup.classList.add('active');

}
function closePalette(e){
    const popup = saveContainer.children[0];
    saveContainer.classList.remove('active');
    popup.classList.add('remove');

}
function savePalette(e) {
    saveContainer.classList.remove("active");
    popup.classList.remove("active");
    const name = SaveInput.value;
    const colors = [];

    currentHexes.forEach(hex => {
        colors.push(hex.innerText);
    });

    // Generate Object
    const paletteNr = savedPalettes.length; // Increment the paletteNr here
    const paletteObj = { name, colors, nr: paletteNr };
        savedPalettes.push(paletteObj);
        
       saveToLocal(paletteObj);
        SaveInput.value ="";
        //genrate the palette for library
        const palette = document.createElement("div");
        palette.classList.add('custom-palette');
        const title = document.createElement("h4");
        title.innerText = paletteObj.name;
        const preview = document.createElement("div");
        preview.classList.add("small-preview");
        paletteObj.colors.forEach(smallColor => {
            const smallDiv= document.createElement("div");
            smallDiv.style.backgroundColor = smallColor;
            preview.appendChild(smallDiv);
        });
        const palatteBtn = document.createElement("button");
        palatteBtn.classList.add("pick-palette-btn");
        palatteBtn.classList.add(paletteObj.nr);
        palatteBtn.innerText = "Select";

        //Attech event to the btn
        palatteBtn.addEventListener('click', e => {
            closeLibrary();
            const paletteIndex = e.target.classList[1];
            initialColors =[];
            savedPalettes[paletteIndex].colors.forEach((color, index) => {
                initialColors.push(color);
                colorDivs[index].style.backgroundColor = color;
                const text = colorDivs[index].children[0];
                checkTextContrast(color, text);
                updateTextUI(index);
            });  
            restInputs();
        });
//Apend to library
palette.appendChild(title);
palette.appendChild(preview);
palette.appendChild(palatteBtn);
libraryContainer.children[0].appendChild(palette);


}
function saveToLocal(paletteObj) {
    let localPalettes;

        if (localStorage.getItem("palettes") === null) {
            localPalettes = [];
        } else {
            localPalettes = JSON.parse(localStorage.getItem("palettes"));
        }
    
    
    localPalettes.push(paletteObj);
    localStorage.setItem("palettes", JSON.stringify(localPalettes));
}
function openLibrary(){
    const popup = libraryBtn.children[0];
    libraryContainer.classList.add("active");
    popup.classList.add("active");
}

function closeLibrary(){
    const popup = libraryBtn.children[0];
    libraryContainer.classList.remove("active");
    popup.classList.remove("active");

}
// Function to get palettes from local storage
function getLocal() {
    if (localStorage.getItem("palettes") === null) {
        savedPalettes = [];
    } else {
        savedPalettes = JSON.parse(localStorage.getItem("palettes"));
    }

    // Generate the palettes for the library
    savedPalettes.forEach(paletteObj => {
        const palette = document.createElement("div");
        palette.classList.add('custom-palette');
        const title = document.createElement("h4");
        title.innerText = paletteObj.name;
        const preview = document.createElement("div");
        preview.classList.add("small-preview");
        paletteObj.colors.forEach(smallColor => {
            const smallDiv = document.createElement("div");
            smallDiv.style.backgroundColor = smallColor;
            preview.appendChild(smallDiv);
        });
        const palatteBtn = document.createElement("button");
        palatteBtn.classList.add("pick-palette-btn");
        palatteBtn.classList.add(paletteObj.nr);
        palatteBtn.innerText = "Select";

        // Attach event to the btn
        palatteBtn.addEventListener('click', e => {
            closeLibrary();
            const paletteIndex = e.target.classList[1];
            initialColors = [];
            savedPalettes[paletteIndex].colors.forEach((color, index) => {
                initialColors.push(color);
                colorDivs[index].style.backgroundColor = color;
                const text = colorDivs[index].children[0];
                checkTextContrast(color, text);
                updateTextUI(index);
            });
            restInputs();
        });

        // Append to library
        palette.appendChild(title);
        palette.appendChild(preview);
        palette.appendChild(palatteBtn);
        libraryContainer.children[0].appendChild(palette);
    });
}

// Call getLocal to load saved palettes from local storage

getLocal();

randomColors();


