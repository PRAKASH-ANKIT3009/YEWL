const evenNumbers = [0, 2, 4, 6, 8]
const animals= ['Lion', 'Tiger', 'Goat', 'Wolf', 'Donkey']
const oddNumbers = ['Anurag', 1, 3, 5]

// evenNumber.shift() // by using this we can remove elements in array from th beginning

// evenNumbers.unshift(5) // gives length of array and added 5 as first element of the array

const addedArray1 = evenNumbers.concat(animals) // gives  [0, 2, 4, 6, 8, 'Lion', 'Tiger', 'Goat', 'Wolf', 'Donkey']

const addedArray2 = animals.concat(evenNumbers, oddNumbers) // gives ['Lion', 'Tiger', 'Goat', 'Wolf', 'Donkey', 0, 2, 4, 6, 8, 'Anurag', 1, 3, 5]

const elementIndex =  evenNumbers.indexOf(6) // if 6 present in the array then it gives index of 6 otherwise gives -1 and if duplicates of element is present then it gives index of 1st one

const isIncluded = animals.includes('Wolf') // gives true if Wolf is present in the array and otherwise false

// animals.reverse() // it reversed the existed array

// animals.sort() // sorted the original array alphabetically 

// sort() compares each aplhabet of every element of the array

animals.slice(3) // gives ['Wolf', 'Donkey']
animals.slice(2, 4) // gives ['Goat', 'Wolf']
// it gives result in new array

// animals.splice(2, 2) // here 2 reprsents remove elements from index 2 to 2 elements the output will be ['Goat', 'Wolf']

// animals.splice(3, 1, 'adfgh') then output will be []

// it gives result in original array

