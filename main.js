const gameBoard = (function() {
	const tiles = Array.from(document.querySelectorAll('.board div'))
	const arr = ["","","","","","","","",""]

	const setBoard = (i,v) => {
		if (arr[i] == ""){
			tiles[i].appendChild(createElem(v))
			arr[i] = v
		}
	}

	const createElem = (v) => {
		let para = document.createElement('p')
		para.textContent = v
		return para
	}

	const getArr = () => {
		return arr
	}
	
	return { tiles,setBoard,getArr }
})()

const Player = (symbol) => {

	const getSymbol = () => { 
		return symbol 
	}

	return { getSymbol }
}

const displayController = (function() {
	const selection = document.querySelector('#selection')
	const divChoices = Array.from(document.querySelectorAll('#selection div div'))
	const x = divChoices[0]
	const o = divChoices[1]
	const tiles = gameBoard.tiles
	const arr = gameBoard.getArr()

	let playerSym
	let computerSym
	let turn = 1
	let activeGame = true 

	const resetButton = document.querySelector('.reset-board')
	const winnerContainer = document.querySelector('#winner')
	const playAgain = document.querySelector('.replay-board')
	const winnerPrompt = document.querySelector('.prompt-win p')

	const init = () => {
		x.addEventListener('click', setSymbol)

		o.addEventListener('click', setSymbol)

		tiles.forEach( (tile,index) => {
			tile.addEventListener('click', () => {
				playerMoves(index)
				computerMoves()
				if (activeGame == true) { turn += 1 }
			})

			observeChangesInDOM(tile)
		})

		resetButton.addEventListener('click', resetBoard)
		playAgain.addEventListener('click',resetBoard)
	}

	const setSymbol = (e) => {
		selection.classList.add('hide-choices')
		if (e.target.textContent == "X"){
			playerSym = Player("X")
			computerSym = Player("O")
		} else if (e.target.textContent == "O"){
			playerSym = Player("O")
			computerSym = Player("X")
		}

		if (getWinner() == true) return
	}

	const getPlayerSym = () => {
		return playerSym.getSymbol()
	}

	const getComputerSym = () => {
		return computerSym.getSymbol()
	}

	const chooseAnIndexForTheComputer = () => {
		return arr.findIndex((element) => element == "")
	}

	const observeChangesInDOM = (tile) => {
		let observer = new MutationObserver(function(mutations) {
  			mutations.forEach(function(mutation) {
    			getWinner()
  			})    
		})

		let config = { attributes: true, childList: true, characterData: true }

		observer.observe(tile,config)
	}

	const playerMoves = (index) => {
		gameBoard.setBoard(index,getPlayerSym())
		console.log(turn)
	}

	const computerMoves = () => {
		setTimeout(function(){
			gameBoard.setBoard(chooseAnIndexForTheComputer(),getComputerSym())
		}, 600)
	}


	const getWinner = () => {
		let winningStates = [[0,1,2],[3,4,5],
		                     [6,7,8],[0,3,6],
		                     [1,4,7],[2,5,8],
		                     [0,4,8],[2,4,6]]

		for (let i = 0; i < 8;i++){
			if (arr[winningStates[i][0]] == "O" && arr[winningStates[i][1]] == "O" && arr[winningStates[i][2]] == "O"){
				activeGame = false
				arr.forEach( (item,index) => { if (arr[index] == "") {arr[index] = "?"} })
				winnerContainer.classList.remove('inactive')
				winnerContainer.classList.add('winner-prompt-container')
				winnerPrompt.textContent = "The winner is O"
				return true
			} else if (arr[winningStates[i][0]] == "X" && arr[winningStates[i][1]] == "X" && arr[winningStates[i][2]] == "X") {
				activeGame = false
				arr.forEach( (item,index) => { if (arr[index] == "") {arr[index] = "?"} })
				winnerContainer.classList.remove('inactive')
				winnerContainer.classList.add('winner-prompt-container')
				winnerPrompt.textContent = "The winner is X"
				return true
			}
		}
	}

	const resetBoard = () => {
		arr.forEach( (item,index) => { arr[index] = "" })
		tiles.forEach( tile => {
			if (tile.firstChild != null) { tile.removeChild(tile.firstChild) }
		})

		selection.classList.remove('hide-choices')
		winnerContainer.classList.add('inactive')
		activeGame = true
		turn = 1	
	}

	return { init }

})()

displayController.init()
