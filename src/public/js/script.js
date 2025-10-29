//Richard##########################################################################################################################

const { response } = require("express");

async function startGame(templateID) {
    fetch(`http://path/`, {
        header: {
            "Content-Type": "application/json",
            "Accept": "application/json, text-plain, */*",
            "X-Requested-With": "XMLHttp"
        },
        method: "post",
        body: JSON.stringify({
            "game-code": gameID
        })
    })
}

function joinGame(gameID) {
    fetch(`https://abc/${gameID}`, {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json, text-plain, */*",
            "X-Requested-With": "XMLHttp"
        },
        method: "post",
        credentials: "same-origin",
        body: JSON.stringify({
            "game-code": gameID
        })
    }
    )
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`)
            }
            return response.json()
        })
        .then(() => {
            window.location.replace(`http://path/${gameID}`)
        })
        .catch((error) => {
            console.error("Fetch error:", error)
        });
}
``
//##############################################################################################################################

//Göki##########################################################################################################################

document.querySelector('#code-input').addEventListener('keydown',(event) =>{
    if(event.key === "Enter"){
        
    }
});

//##############################################################################################################################

//Nikola##########################################################################################################################

function selectAnswer(gameID, questionID, answerID) {

    fetch(`https://abc/${gameID}`, {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json, text-plain, */*",
            "X-Requested-With": "XMLHttp"
        },
        method: "POST",
        body: JSON.stringify({
            "game-id": gameID,
            "question-id": questionID,
            "answer-id": answerID
        })
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error(`ERROR: Status: ${response.status}`)
        }
    })
    .catch((error)=>{
        console.error(error)
    })
}



//##############################################################################################################################