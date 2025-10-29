//Richard##########################################################################################################################

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
    .then((data) => {
        window.location.replace(`http://path/${gameID}`)
    })
}

//##############################################################################################################################

//Göki##########################################################################################################################



//##############################################################################################################################

//Nikola##########################################################################################################################



//##############################################################################################################################