const prompt = require("prompt-sync")({ sigint: true });

//npm i chalk@4.1.2, use the older version because of a compatibility issue with the newer version
//lets you change colors and styles of terminal text
const chalk = require("chalk")

/*
fish - {
    name: string
    weight: number
    value: number
}

*/

//generates a random name
const generateRandomName = () => {
    //first adjective options
    const adj1Arr = ["Large", "Small", "Scaly", "Slimy", "Quick"]

    //second adjective options
    const adj2Arr = ["Smooth", "Wild", "Slippery", "Gentle", "Striped"]

    //fish type options
    const typeArr = ["Salmon", "Trout", "Catfish", "Bass", "Cod", "Gold-fish", "Tuna", "Rockfish", "Puffer Fish", "Golden Doubloon", "Boot"]

    //get random 1st adjective
    let adj1Index = Math.floor(Math.random() * adj1Arr.length)
    let adj1 = adj1Arr[adj1Index]

    //get random 2nd adjective
    let adj2Index = Math.floor(Math.random() * adj2Arr.length)
    let adj2 = adj2Arr[adj2Index]

    //get random type
    let typeIndex = Math.floor(Math.random() * typeArr.length)
    let type = typeArr[typeIndex]

    //check if type is a golde doubloon
    if ((type === "Golden Doubloon") || (type === "Boot")) {
        return type

    //if type is a fish
    } else {

        //put them together: adj1 adj2 type
        let fish = `${adj1} ${adj2} ${type}`

        return fish
    }
}

//generates a random number for weight, 10 is our weight limit
const generateRandomWeight = () => {
    //toFixed(2) rounds to two decimal places, but turns it to a string
    //so we convert to a number with Number()
    return Number(((Math.random() * 6) + 1).toFixed(2))
}

//generates a random number for price, 40 seems like a good expensive price max
const generateRandomPrice = () => {
    //toFixed(2) rounds to two decimal places, but turns it to a string
    //so we convert to a number with Number()
    return Number((Math.random() * 40 + 2).toFixed(2))
}

//generates our fish with random attributes
const generateRandomFish = () => {
    //random name
    let fishName = generateRandomName()
    
    //define a new fish object
    let newFish = {}

    //check to see if the name is a golden doubloon, a boot or a fish 
    // if it is a golden doubloon, 
    // create a "fish" worth 100 and weighing nothing
    if (fishName === "Golden Doubloon") {
        newFish = {
            name: fishName,
            weight: 0,
            value: 100
        }
    
    //if it is a boot, create a "fish" worth 0 and weighing nothing 
    } else if (fishName === "Boot") {
        newFish = {
            name: fishName,
            weight: 0,
            value: 0
        }

    //if it is a fish, create a new fish with random weight and value
    } else {

        //random weight
        let fishWeight = generateRandomWeight()
        
        //random value
        let fishPrice = generateRandomPrice()

        //our new fish object
        newFish = {
            name: fishName,
            weight: fishWeight,
            value: fishPrice
        }
    }

    // console.log(newFish)
    return newFish
}

//display fish caught
const displayCaughtFish = (fish) => {
    console.log(`You caught a '${chalk.blue`${fish.name}`}' weighing ${chalk.blue`${fish.weight} lbs`} and valued at ${chalk.blue`$${fish.value}`}\n`)
}

//variables for tracking totals
//note that time is 6am in minutes from midnight
let time = 360
let totalWeightCaught = 0
let totalPriceCaught = 0
let caughtFishArr = []
let chummedWater = false
let chumLength = 0
let timeInterval = 0

//create an array for possible time intervals between catching fish in minutes
let timeIntervalArray = [15, 30, 45, 60, 75, 90]

//get a random time interval
const getRandomTime = (max) => {
    let randomIndex = Math.floor(Math.random() * max)
    return timeIntervalArray[randomIndex]
}

//display a time in HH:MM format
const displayTime = (time) => {
    let hours = Math.floor(time/60)
    let minutes = time - (hours * 60)

    if (minutes === 0) {
        return `${hours}:00`
    } else if (minutes < 10) {
        return `${hours}:0${minutes}`
    } else {
        return `${hours}:${minutes}`
    }
}

//display caught fish array
const displayCaughtFishArr = (array) => {
    console.log("\nCaught Fish")
    for (i = 0; i < array.length; i++) {
        console.log(`${i + 1}. ${array[i].name}, ${array[i].weight} lbs, $${array[i].value}`)
    }
    console.log("\n")
}

//catching fish
const catchingFish = (input, fishCaught) => {
    //check if the water is chummed
    if ((chummedWater === true) && (chumLength < 2)) {
        //get a random time interval for smaller intervals only
        timeInterval = getRandomTime(2)
        //increment the chumLength variable
        chumLength += 1
    //if the waters are not chummed or have been chummed for 3 or more turns
    } else {
        //get a random time interval for all possible intervals
        timeInterval = getRandomTime(6)

        //reset the chumming values
        chummedWater = false
        chumLength = 0
    }
    //add time interval to time, recall time is in minutes
    time += timeInterval

    //make sure player enters valid input
    while ((input != "k") && (input != "r") && (input != "f") && (input != "c")) {
        console.log(`Please enter ${chalk.magenta("[k]")}eep, ${chalk.magenta("[r]")}elease or ${chalk.magenta("[f]")}ree from previous round:`)
        input = prompt("> ").trim()
    }

    //if we decide to keep the fish
    if (input === "k") {
        //add fish weight to our total weight caught
        totalWeightCaught += fishCaught.weight
        //check that the total weight won't go over 10lbs, if it does
        if(totalWeightCaught > 10) {
            console.log("This fish would put you over 10 lbs, so you release it.")
            //remove the most recent fish from our total since we aren't keeping it
            totalWeightCaught -= fishCaught.weight
            console.log("Press [enter] to continue.")
            input = prompt("> ").trim()
            //make sure player enters valid input
            while(input != "") {
                console.log("Press [enter] to continue.")
                input = prompt("> ").trim()
            }
        //if the total weight isn't over 10lbs
        } else {
            //round the weight
            totalWeightCaught = Number(totalWeightCaught.toFixed(2))
            //add the price to our total value
            totalPriceCaught = Number((totalPriceCaught + fishCaught.value).toFixed(2))
            //add the current fish to our caught fish array
            caughtFishArr.push(fishCaught)
            console.log("You chose to keep the fish.")
        }
    } else if (input === "r") {
        console.log("You chose to release the fish.")
    } else if (input === "f") {
        //if caught fish list is empty, display that instead
        if (caughtFishArr.length === 0) {
            console.log("You haven't caught any fish. Please catch at least 1 fish before trying to free any")
            time -= timeInterval 
        } else {
            //display a list of caught fish if there is at least 1 fish in the list
            displayCaughtFishArr(caughtFishArr)

            //prompt player for which fish they want to remove
            console.log("Enter the number for the fish you want to set free?")
            input = prompt("> ").trim()

            //make sure user enters valid option
            while(input > caughtFishArr.length) {
                console.log("Out of range:")
                input = Number(prompt(`Please enter a number between 1 & ${caughtFishArr.length}: `))
            }

            //remove that fish
            let tempArray = []
            for (let i = 0; i < caughtFishArr.length; i++) {    
                if (i !== input - 1) {
                    tempArray.push(caughtFishArr[i])
                } else {
                    //return action summary
                    console.log (`${caughtFishArr[i].name} successfully freed`)
                }
            } 
            caughtFishArr = tempArray
        }
    } else if (input === "c") {
        //set chummedWater to true
        chummedWater = true
        //let player know it worked
        console.log("You chummed the water")
    }
}

//UI

const welcome = "You've Gone Fishing!!!\n\nTry to maximize the value of your caught fish. You can fish for six hours (till 12:00pm) and can catch at most 10 lbs of fish."

const playGame = () => {

    //player plays for 6 hours, starting at 6 ending at 12
    while (time < 720) {

        console.log("\n==============================================================================================\n")
        //get a string that displays the current value of time in hh:mm format
        let currentTime = displayTime(time)
        //update the player with their total caught information
        console.log(`The time is ${chalk.green`${currentTime}am`}. So far you've caught: ${chalk.green`${caughtFishArr.length}`} fish, ${chalk.green`${totalWeightCaught.toFixed(2)} lbs`}, ${chalk.green`$${totalPriceCaught.toFixed(2)}`}\n`)

        //generate a random fish
        const fishCaught = generateRandomFish()
        //display details for the caught fish
        displayCaughtFish(fishCaught)

        if (chummedWater === true) {
            //prompt player for desired action
            console.log(`Your action: ${chalk.magenta("[k]")}eep, ${chalk.magenta("[r]")}elease or ${chalk.magenta("[f]")}ree fish from previous round?`)
        } else {
            //prompt player for desired action
            console.log(`Your action: ${chalk.magenta("[k]")}eep, ${chalk.magenta("[r]")}elease, ${chalk.magenta("[f]")}ree fish from previous round, or ${chalk.magenta("[c]")}hum water?`)
        }
        //prompt player for desired action
        let input = prompt("> ").trim()

        //deal with player input
        catchingFish(input, fishCaught)

        //update current time to a string that displays the actual current value of time in hh:mm format
        // currentTime = displayTime(time)
        // //update the player with their total caught information
        // console.log(`\nThe time is ${currentTime}am. So far you've caught: ${caughtFishArr.length} fish, ${totalWeightCaught.toFixed(2)} lbs, $${totalPriceCaught.toFixed(2)}\n`)
    }

    //on the 6th turn, conclude the game
    //note that 720 is 12 hours past midnight or 6 hours past 6am, the start of our game
    if (time >= 720) {
        console.log("\n==============================================================================================\n")
        console.log("The time is 12:00pm. Times up!\n")

        console.log(`You caught ${caughtFishArr.length} fish:`)
        
        //display a list of the fish the player caught
        displayCaughtFishArr(caughtFishArr)

        //display totals of player's catch
        console.log(`Total weight: ${totalWeightCaught} lbs`)
        console.log(`Total price: $${totalPriceCaught}\n`)
    }
}

//run the game
console.log("\n")
console.log(welcome)
playGame()