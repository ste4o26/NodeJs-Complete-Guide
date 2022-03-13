const name = 'Stefan';
let age = 26;
const hasHobbies = true;

function summarizeUser(name, age, hasHobbies) {
    let result = `My name is ${name}. I am ${age} years old.`;
    if (hasHobbies) result = result.concat('I have hobbies.');
    return result;
}

const userData = (name, age, hasHobbies) => {
    let result = `My name is ${name}. I am ${age} years old.`;
    if (hasHobbies) result = result.concat('I have hobbies.');
    return result;
}

// console.log(summarizeUser(name, age, hasHobbies));
// console.log(userData(name, age, hasHobbies));

// =================================================================================================================

const addOneTo = a => a + 1;
const addRandom = () => (((Math.random() + 1) * 10) + ((Math.random() + 1) * 100)).toFixed();

// console.log(addOneTo(5));
// console.log(addRandom());

const person = {
    name: 'Josh',
    age: 25,
    greeting() { console.log(`My name is ${this.name}. I am ${this.age} years old.`); }, //-> here the context is the person object itself
    // greeting: () => console.log(`My name is ${this.name}. I am ${this.age} years old.`) -> here the context(value of this) is the global object
}

// console.log(person);
// console.log(person.greeting());

// ================================================================================================================

const hobbies = ['Basketball', 'Cooking'];
for (const hobby of hobbies) {
    // console.log(hobby);
}

const coppiedArray = [...hobbies];
// console.log(coppiedArray);

const coppiedObject = {...person};
// console.log(coppiedObject);

const toArray = (...args) => args;
console.log(toArray(1, 2, 3, 4));