let dataJson = [];
let stateObjects = [];
let lowerMedian = document.getElementById('lowerMedian');
let higherMedian = document.getElementById('higherMedian');
let disastercardsdiv = document.getElementById('naturalDisasterCards');
let selectedDisastersARR = [];
lowerMedian.addEventListener("change", updateMedianValues);
higherMedian.addEventListener("change", updateMedianValues);
disastercardsdiv.addEventListener("click", filterDisasters);

function StateObjects(stateNameTemp, medianIncomeTemp, naturalDisastersTemp ){
    this.state = stateNameTemp;
    this.medianIncome = medianIncomeTemp;
    this.naturalDisasters = naturalDisastersTemp;
}

window.onload = async function() {
    const cardContainer = document.getElementById('map-card-container');
    const lowerMedianSelect = document.getElementById('lowerMedian');
    const higherMedianSelect = document.getElementById('higherMedian');
    const disasters = [];

    try{
        await fetchData();
        populateCards(cardContainer);

    }
    catch (error){
        console.error("Error fetching data:", error);
    }

    let lowertemp = Infinity;
    let highertemp = 0;
    dataJson.forEach(state => {
        if (state['MedianIncome'] < lowertemp){
            lowertemp = state['MedianIncome']
        }
        if (state['MedianIncome'] > highertemp){
            highertemp = state['MedianIncome']
        }
        
        stateObjects.push( new StateObjects(state['state'].replaceAll(" ","_"), state['MedianIncome'], state['NatDisaster']));

        state['NatDisaster'].forEach(item =>{
            if (disasters.includes(item)){
                
            }else{
                disasters.push(item);
            }

            })          
    });
    for (let i = Math.floor(lowertemp/10000)*10000; i < Math.ceil(highertemp/10000)*10000 + 10000; i  += 10000){
            const optionForLower = document.createElement('option');
            optionForLower.value = i;
            optionForLower.innerHTML = i;
            lowerMedianSelect.appendChild(optionForLower);

            const optionForHigher = document.createElement('option');
            optionForHigher.value = i;
            optionForHigher.innerHTML = i;
            higherMedianSelect.appendChild(optionForHigher);
    }

    populateDisasterCards(disasters);
}

async function fetchData(){
    const response = await fetch('./data/new.json');
    if(!response.ok){
        throw new Error('Network response was not ok');
    }
    dataJson = await response.json();
}

function populateCards(container){
    
    dataJson.forEach(state =>{
        container.appendChild(createCard(state['state']));

        
     });
}

function createCard(state){
    const card = document.createElement('div');
    const stateName = document.createElement('p');
    let state_normalize = state.replaceAll(' ', '_');

    card.classList.add('card','usState',state_normalize, 'notHidden');    
    stateName.innerText = state;    
    card.appendChild(stateName);
 
    return card;
}

function updateMedianValues(elementTarget){
    const lowerLimit = document.getElementById('lowerMedian').value;
    const upperLimit = document.getElementById('higherMedian').value;
    

    dataJson.forEach( state => {
        const tempstate = document.querySelector(`.${state['state'].replaceAll(" ","_")}`);
        if (state['MedianIncome'] < lowerLimit || state['MedianIncome'] > upperLimit){
            if(tempstate.classList.contains("notHidden")){
                tempstate.classList.toggle("hidden");
                tempstate.classList.toggle("notHidden");
            }
        }   

       if (state['MedianIncome'] >= lowerLimit && state['MedianIncome'] <= upperLimit){
        if(tempstate.classList.contains("hidden")){
             tempstate.classList.toggle("hidden");
                tempstate.classList.toggle("notHidden");
        }
       }
    })


    
}

function populateDisasterCards(disasters){
    let disastercards = document.getElementById('naturalDisasterCards');
    disasters.forEach((disaster) => {
        let card = document.createElement('div');
        card.classList = 'disasterCards';
        card.innerHTML = disaster;
        disastercards.appendChild(card);
    });
}


function filterDisasters(event){
    if ( event.target.classList.contains('selectedDisasterCard')){
        event.target.classList.remove('selectedDisasterCard');
    }else{
        event.target.classList.add('selectedDisasterCard');
    }

    updateStates();
}


function updateStates(){
    let selectedDisastersARR = [].slice.call(document.getElementsByClassName('selectedDisasterCard'));


    if (selectedDisastersARR.length == 0){
        dataJson.forEach((state) =>{
            const tempstate = document.querySelector(`.${state['state'].replaceAll(" ","_")}`);
            tempstate.classList.remove("hidden")
            tempstate.classList.add("notHidden") 
        })
    }


    dataJson.forEach((state) =>{
        let disasterIncluded = false;
        const tempstate = document.querySelector(`.${state['state'].replaceAll(" ","_")}`);
        
        selectedDisastersARR.every((disaster)=> {
            if (state.NatDisaster.includes(disaster.innerHTML)){
                console.log(state.state)
                disasterIncluded = true;
                return false;
            }
            return true;
        }) 

        if (disasterIncluded && tempstate.classList.contains("notHidden")){
            tempstate.classList.remove("notHidden")
            tempstate.classList.add("hidden") 
        }

        if (disasterIncluded == false){
            tempstate.classList.remove("hidden")
            tempstate.classList.add("notHidden") 
        }}) 
}